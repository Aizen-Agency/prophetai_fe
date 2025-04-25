'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ApifyClient } from 'apify-client';

interface Tweet {
  url: string;
  content: string;
  likes: number;
  retweets: number;
  replies: number;
  date: string;
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
        token: "apify_api_ybMbddryhwVdnfhoWT7bYZWxd4s1A64quJvO",
      });

      const input = {
        "startUrls": [
            profileUrl
        ],
        // "searchTerms": [
        //     "elonmusk",
        //     "taylorswift13"
        // ],
        "maxItems": 100,
        // "twitterHandles": [
        //     "elonmusk",
        //     "taylorswift13"
        // ],
        // "twitterUserIds": [
        //     "44196397",
        //     "17919972"
        // ],
        "getFollowers": true,
        "getFollowing": true,
        "getRetweeters": true,
        "includeUnavailableUsers": false,
        "customMapFunction": "({ ...item }) => item"
    };

      const run = await client.actor("apidojo/twitter-user-scraper").call(input);
      console.log('Results from dataset');
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      items.forEach((item) => {
          console.dir(item);
      });


      // if (!run) throw new Error('All Twitter scraper actors failed');

      // const { items } = await client.dataset(run.defaultDatasetId).listItems();

      const posts: Tweet[] = (items || []).map((item: any) => ({
        url: item.url || `https://twitter.com/status/${item.id || 'unknown'}`,
        content: item.text || item.full_text || item.content || '',
        likes: item.likesCount || item.likes_count || item.favorites_count || 0,
        retweets: item.retweetsCount || item.retweets_count || 0,
        replies: item.repliesCount || item.replies_count || 0,
        date: item.timestamp || item.created_at || new Date().toISOString(),
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
