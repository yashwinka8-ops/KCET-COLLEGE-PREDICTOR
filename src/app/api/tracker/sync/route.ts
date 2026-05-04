import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function translateText(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=kn&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Google Translate returns a nested array: [[["translated", "original", ...]]]
    // We need to stitch the translated parts back together
    return data[0].map((item: any) => item[0]).join('');
  } catch (error) {
    console.error('Translation Error:', error);
    return text; // Fallback to original if translation fails
  }
}

export async function GET() {
  try {
    const targetUrl = 'https://cetonline.karnataka.gov.in/kea/ugcet2026';
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) throw new Error('Failed to fetch KEA portal');

    const html = await response.text();
    const $ = cheerio.load(html);
    const rawNotifications: any[] = [];

    // Step 1: Extract raw Kannada notifications
    $('#ContentPlaceHolder1_req_accordion .card a').each((i, el) => {
      const originalText = $(el).text().trim();
      const href = $(el).attr('href');
      
      if (originalText && href && !originalText.includes('Back')) {
        rawNotifications.push({ originalText, href });
      }
    });

    // Step 2: Batch translate all titles for speed (using ||| as a delimiter)
    const combinedText = rawNotifications.map(n => n.originalText).join(' ||| ');
    const translatedCombined = await translateText(combinedText);
    const translatedTitles = translatedCombined.split(' ||| ');

    // Step 3: Process and normalize
    const notifications = rawNotifications.map((n, i) => {
      const translatedTitle = translatedTitles[i]?.trim() || n.originalText;
      const dateMatch = n.originalText.match(/(\d{2}-\d{2}-\d{4})/);
      
      let fullHref = n.href;
      if (n.href.startsWith('..')) {
        fullHref = `https://cetonline.karnataka.gov.in/kea/${n.href.replace('../', '')}`;
      } else if (n.href.startsWith('/')) {
        fullHref = `https://cetonline.karnataka.gov.in${n.href}`;
      } else if (!n.href.startsWith('http')) {
        fullHref = `https://cetonline.karnataka.gov.in/kea/${n.href}`;
      }

      return {
        title: translatedTitle.replace(/\(\s*\d{2}-\d{2}-\d{4}\s*\)/, '').trim(),
        date: dateMatch ? dateMatch[0] : 'Latest',
        link: fullHref,
        category: translatedTitle.toLowerCase().includes('result') ? 'Result' : 
                  translatedTitle.toLowerCase().includes('ticket') ? 'Admit Card' :
                  translatedTitle.toLowerCase().includes('schedule') ? 'Schedule' : 'Notification'
      };
    });

    // Step 4: Deduplicate and limit
    const uniqueNotifications = Array.from(new Set(notifications.map(n => n.title)))
      .map(title => notifications.find(n => n.title === title))
      .filter(n => n?.title && n.title.length > 5)
      .slice(0, 15);

    return NextResponse.json({ 
      success: true, 
      data: uniqueNotifications, 
      timestamp: new Date().toISOString() 
    });

  } catch (error: any) {
    console.error('KEA AI Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
