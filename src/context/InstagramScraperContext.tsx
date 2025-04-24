// context/InstagramScraperContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import DataService from '@/app/service/DataService';

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
    console.log('Fetching Instagram analytics from backend');
    setLoading(true);
    setError(null);
    
    try {
      // Fetch analytics data using DataService
      const response = await DataService.getInstagramAnalytics();
      console.log('Received Instagram analytics from backend:', response);
      
      if (!response || !response.analytics || response.analytics.length === 0) {
        throw new Error('No analytics data available');
      }
      
      // Use the latest analytics data (assuming the most recent is last)
      const latestAnalytics = response.analytics[response.analytics.length - 1];
      
      // Parse the posts from JSON if needed
      let analyticsPosts;
      if (typeof latestAnalytics.posts === 'string') {
        analyticsPosts = JSON.parse(latestAnalytics.posts);
      } else {
        analyticsPosts = latestAnalytics.posts;
      }
      
      console.log('Parsed analytics data:', analyticsPosts);
      
      // Format the result similar to how we did with Apify data
      const result: AnalyticsResult = {
        posts: analyticsPosts.posts || [],
        total_comments: analyticsPosts.total_comments || 0,
        total_likes: analyticsPosts.total_likes || 0,
        total_shares: analyticsPosts.total_shares || 0,
        total_views: analyticsPosts.total_views || 0,
      };

      console.log('Final analytics result:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching analytics:', errorMessage);
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
