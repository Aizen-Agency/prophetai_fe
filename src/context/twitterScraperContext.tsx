'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ApifyClient } from 'apify-client';

interface Tweet {
  text: string;
}

interface TwitterAnalytics {
  posts: Tweet[];
}

interface TwitterScraperContextType {
  scrapeTwitter: (profileUrl: string) => Promise<string[] | null>;
  loading: boolean;
  error: string | null;
}

const TwitterScraperContext = createContext<TwitterScraperContextType | undefined>(undefined);

export const TwitterScraperProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeTwitter = async (profileUrl: string): Promise<string[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const client = new ApifyClient({
        token: "apify_api_df3Pk3RNqipvAGM4s8RtscKvp0pFgX2aYrQY",
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

      const tweets: string[] = (items || []).map((item: any) => item.text || '');

      return tweets;
    } catch (err: any) {
      console.error('❌ Twitter scrape error:', err);
      setError(err.message || 'Something went wrong');
      return [];
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
