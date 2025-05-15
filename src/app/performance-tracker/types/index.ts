// User type definition
export interface User {
    id: number
    name: string
    username: string
    avatar: string
  }
  
  // Daily views data structure
  export interface DailyView {
    date: string
    views: number
  }
  
  // Instagram video data structure
  export interface InstagramVideo {
    id: number
    userId: number
    title: string
    views: number
    likes: number
    comments: number
    shares: number
    display_url: string
    dailyViews: DailyView[]
    averageViewsPerDay: number
    weekOverWeekGrowth: string
    performance: "high" | "medium" | "low"
    date: Date
  }
  
  // Summary statistics
  export interface InstagramSummary {
    totalViews: number
    totalLikes: number
    totalComments: number
    // totalShares: number
  }
  
  // Chart data point
  export interface ChartDataPoint {
    date: string
    views: number
  }
  