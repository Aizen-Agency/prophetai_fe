// context/InstagramScraperContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ApifyClient } from 'apify-client';

interface PostData {
  avg_views_per_day: number;
  comments: number;
  date: string;
  likes: number;
  shares: number;
  video: string;
  views: number;
}

interface AnalyticsResult {
  posts: PostData[];
  total_comments: number;
  total_likes: number;
  total_shares: number;
  total_views: number;
}

interface ScraperContextType {
  scrapeInstagram: (profileUrl: string) => Promise<AnalyticsResult | null>;
  loading: boolean;
  error: string | null;
}

const InstagramScraperContext = createContext<ScraperContextType | undefined>(undefined);

export const InstagramScraperProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeInstagram = async (profileUrl: string): Promise<AnalyticsResult | null> => {
    console.log('Starting Instagram scraping for URL:', profileUrl);
    setLoading(true);
    setError(null);
    
    try {
      if (!process.env.NEXT_PUBLIC_APIFY_API_KEY) {
        console.error('NEXT_PUBLIC_APIFY_API_KEY is not configured in environment variables');
        throw new Error('NEXT_PUBLIC_APIFY_API_KEY is not configured');
      }

      console.log('NEXT_PUBLIC_APIFY_API_KEY found:', process.env.NEXT_PUBLIC_APIFY_API_KEY ? 'Yes' : 'No');

      const client = new ApifyClient({
        token: process.env.NEXT_PUBLIC_APIFY_API_KEY,
      });

      console.log('Initialized Apify client');

      const input = {
        directUrls: [profileUrl],
        resultsType: 'posts',
        resultsLimit: 10,
        searchType: 'user',
        searchLimit: 1,
        proxyConfiguration: { useApifyProxy: true },
      };

      console.log('Starting Apify actor run with input:', input);
      const run = await client.actor('apify/instagram-api-scraper').call(input);
      console.log('Apify run completed:', run);

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      console.log('Retrieved items from dataset:', items.length);

      if (!items || items.length === 0) {
        throw new Error('No posts found for the given profile');
      }

      const formattedPosts: PostData[] = items.map((item: any, index: number) => {
        const postDate = new Date(item.timestamp * 1000);
        const daysSincePost = Math.max(1, Math.floor((Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        return {
          avg_views_per_day: item.video_view_count
            ? Math.round(item.video_view_count / daysSincePost)
            : 0,
          comments: item.commentsCount || 0,
          date: postDate.toLocaleDateString(),
          likes: item.likesCount || 0,
          shares: item.sharesCount || 0,
          video: `Instagram Post ${index + 1}`,
          views: item.videoViewCount || 0,
        };
      });

      console.log('Formatted posts:', formattedPosts);

      const result: AnalyticsResult = {
        posts: formattedPosts,
        total_comments: formattedPosts.reduce((sum, post) => sum + post.comments, 0),
        total_likes: formattedPosts.reduce((sum, post) => sum + post.likes, 0),
        total_shares: formattedPosts.reduce((sum, post) => sum + post.shares, 0),
        total_views: formattedPosts.reduce((sum, post) => sum + post.views, 0),
      };

      console.log('Final analytics result:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Scraping error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstagramScraperContext.Provider value={{ scrapeInstagram, loading, error }}>
      {children}
    </InstagramScraperContext.Provider>
  );
};

export const useInstagramScraper = (): ScraperContextType => {
  const context = useContext(InstagramScraperContext);
  if (!context) {
    throw new Error('useInstagramScraper must be used within InstagramScraperProvider');
  }
  return context;
};
