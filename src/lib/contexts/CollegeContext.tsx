'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, onSnapshot, query } from 'firebase/firestore';
import { College } from '@/lib/types';
import { useAuth } from './AuthContext';
import localCollegesRaw from '@/lib/data/colleges.json';

const localColleges = localCollegesRaw as College[];

interface CollegeContextType {
    colleges: College[];
    isLoading: boolean;
    version: number;
    refreshData: () => Promise<void>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export function CollegeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [colleges, setColleges] = useState<College[]>(localColleges);
    const [isLoading, setIsLoading] = useState(true);
    const [version, setVersion] = useState(0);

    const isAdmin = user?.email === 'yashwinka8@gmail.com' || 
                  user?.email === 'yashwinka8@gamil.com' || 
                  user?.email === 'yashwinanand61@gmail.com';

    const refreshData = async (newVersion?: number) => {
        try {
            console.log("🔄 Syncing Institutional Database...");
            const querySnapshot = await getDocs(collection(db, 'colleges'));
            const cloudData = querySnapshot.docs.map(doc => doc.data() as College);
            
            setColleges(prev => {
                const merged = [...localColleges];
                cloudData.forEach(cloudCollege => {
                    const index = merged.findIndex(c => c.college_id === cloudCollege.college_id);
                    if (index !== -1) merged[index] = { ...merged[index], ...cloudCollege };
                    else merged.push(cloudCollege);
                });
                
                if (!isAdmin) {
                    localStorage.setItem('cached_colleges_v2', JSON.stringify(merged));
                    if (newVersion) localStorage.setItem('db_version', newVersion.toString());
                }
                return merged;
            });

            if (newVersion) setVersion(newVersion);
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            // 🚀 ADMIN MODE: Real-time, No Caching
            console.log("🔐 Admin Mode Active: Live Cloud Sync Enabled");
            const q = query(collection(db, 'colleges'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const cloudData = snapshot.docs.map(doc => doc.data() as College);
                setColleges(prev => {
                    const merged = [...localColleges];
                    cloudData.forEach(cloudCollege => {
                        const index = merged.findIndex(c => c.college_id === cloudCollege.college_id);
                        if (index !== -1) merged[index] = { ...merged[index], ...cloudCollege };
                        else merged.push(cloudCollege);
                    });
                    return merged;
                });
                setIsLoading(false);
            });
            return () => unsubscribe();
        } else {
            // 👤 USER MODE: Cached, Version-Controlled
            const cached = localStorage.getItem('cached_colleges_v2');
            const localVer = parseInt(localStorage.getItem('db_version') || '0');
            
            if (cached) {
                try {
                    setColleges(JSON.parse(cached));
                    setVersion(localVer);
                } catch (e) {
                    localStorage.removeItem('cached_colleges_v2');
                }
            }

            const unsubscribe = onSnapshot(doc(db, 'metadata', 'config'), (snap) => {
                if (snap.exists()) {
                    const cloudVer = snap.data().version || 0;
                    const currentLocalVer = parseInt(localStorage.getItem('db_version') || '0');
                    if (cloudVer > currentLocalVer) refreshData(cloudVer);
                    else setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            });
            return () => unsubscribe();
        }
    }, [isAdmin]);

    return (
        <CollegeContext.Provider value={{ colleges, isLoading, version, refreshData: () => refreshData() }}>
            {children}
        </CollegeContext.Provider>
    );
}

export const useColleges = () => {
    const context = useContext(CollegeContext);
    if (!context) throw new Error('useColleges must be used within a CollegeProvider');
    return context;
};
