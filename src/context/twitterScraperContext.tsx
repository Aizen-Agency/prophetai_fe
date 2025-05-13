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

      // Start the actor run
      const run = await client.actor("apidojo/twitter-scraper-lite").call(input);
      
      // Create an abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 1 minute timeout

      try {
        // Wait for the run to complete with timeout
        await Promise.race([
          new Promise((resolve, reject) => {
            const checkStatus = async () => {
              try {
                const runInfo = await client.run(run.id).get();
                if (runInfo && (runInfo.status === 'SUCCEEDED' || runInfo.status === 'FAILED')) {
                  resolve(runInfo);
                } else {
                  setTimeout(checkStatus, 5000); // Check every 5 seconds
                }
              } catch (error) {
                reject(error);
              }
            };
            checkStatus();
          }),
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
              reject(new Error('Operation timed out after 1 minute'));
            });
          })
        ]);

        // Get the results
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        if (!items || items.length === 0) {
          throw new Error('No data was collected');
        }

        const posts: Tweet[] = items.map((item: any) => ({
          url: item.url || `https://twitter.com/status/${item.id || 'unknown'}`,
          text: item.text || '',
          likesCount: item.likeCount || item.likesCount || 0,
          retweetsCount: item.retweetCount || item.retweetsCount || 0,
          repliesCount: item.replyCount || item.repliesCount || 0,
          timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
        }));

        return { posts };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err: any) {
      console.error('❌ Twitter scrape error:', err);
      setError(err.message || 'Something went wrong');
      return null;
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
