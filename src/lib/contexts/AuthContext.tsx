'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    isGuest: boolean;
    isAdmin: boolean;
    guestId: string | null;
    setAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);

    useEffect(() => {
        // Handle Guest ID
        let gid = localStorage.getItem('kcet_guest_id');
        if (!gid) {
            gid = 'guest_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('kcet_guest_id', gid);
        }
        setGuestId(gid);

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || 'User',
                    image: firebaseUser.photoURL || undefined
                });
                setIsGuest(false);
                localStorage.removeItem('kcet_guest');
            } else {
                setUser(null);
                const savedGuest = localStorage.getItem('kcet_guest');
                if (savedGuest) setIsGuest(true);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsGuest(false);
            localStorage.removeItem('kcet_guest');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const setAsGuest = () => {
        setIsGuest(true);
        localStorage.setItem('kcet_guest', 'true');
    };

    const adminEmails = [
        'yashwinka8@gmail.com',
        'yashwinka8@gamil.com',
        'yashwinanand61@gmail.com', 
        'admin@kcetpredictor.com'
    ];
    
    const isAdmin = user ? adminEmails.includes(user.email.toLowerCase()) : false;

    useEffect(() => {
        if (user) {
            console.log("Logged in as:", user.email, "Is Admin:", isAdmin);
        }
    }, [user, isAdmin]);

    return (
        <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout, isGuest, isAdmin, guestId, setAsGuest }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
