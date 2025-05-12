'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ApifyClient } from 'apify-client';

interface Tweet {
  url: string;
  text: string;
  likesCount: number;
  retweetsCount: number;
  repliesCount: number;
  timestamp: string;
}

interface TwitterAnalytics {
  posts: Tweet[];
}

interface TwitterScraperContextType {
  scrapeTwitter: (profileUrl: string) => Promise<TwitterAnalytics | null>;
  loading: boolean;
  error: string | null;
}

const TwitterScraperContext = createContext<TwitterScraperContextType | undefined>(undefined);

export const TwitterScraperProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeTwitter = async (profileUrl: string): Promise<TwitterAnalytics | null> => {
    setLoading(true);
    setError(null);

    try {
      const client = new ApifyClient({
        token: process.env.NEXT_PUBLIC_APIFY_API_KEY,
      });

      const input = {
        "maxItems": 10,
        "sort": "Latest",
        "startUrls": [
          profileUrl
        ]
      }
      const run = await client.actor("apidojo/twitter-scraper-lite").call(input);
      console.log('Results from dataset');
      console.log("💾 Check your data here: https://console.apify.com/storage/datasets/" + run["defaultDatasetId"])
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      items.forEach((item) => {
          console.dir(item);
      });

      const posts: Tweet[] = (items || []).map((item: any) => ({
        url: item.url || `https://twitter.com/status/${item.id || 'unknown'}`,
        text: item.text || '',
        likesCount: item.likeCount || item.likesCount || 0,
        retweetsCount: item.retweetCount || item.retweetsCount || 0,
        repliesCount: item.replyCount || item.repliesCount || 0,
        timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
      }));

      return { posts };
    } catch (err: any) {
      console.error('❌ Twitter scrape error:', err);
      setError(err.message || 'Something went wrong');
      return { posts: [] };
    } finally {
      setLoading(false);
    }
  };

  return (
    <TwitterScraperContext.Provider value={{ scrapeTwitter, loading, error }}>
      {children}
    </TwitterScraperContext.Provider>
  );
};

export const useTwitterScraper = (): TwitterScraperContextType => {
  const context = useContext(TwitterScraperContext);
  if (!context) {
    throw new Error('useTwitterScraper must be used within TwitterScraperProvider');
  }
  return context;
};
