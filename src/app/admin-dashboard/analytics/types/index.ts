// User type
export interface User {
    id: number
    name: string
    username: string
    avatar: string
  }
  
  // Daily views type
  export interface DailyView {
    date: string
    views: number
  }
  
  // Instagram data type
  export interface InstagramData {
    id: number
    userId: number
    title: string
    views: number
    likes: number
    comments: number
    shares: number
    dailyViews: DailyView[]
    averageViewsPerDay: number
    weekOverWeekGrowth: string
    performance: "high" | "medium" | "low"
    date: Date
  }
  
  // Instagram summary type
  export interface InstagramSummary {
    totalViews: number
    totalLikes: number
    totalComments: number
    totalShares: number
  }
  
  // Performance filter type
  export type PerformanceFilter = "all" | "high" | "medium" | "low"
  
  // Sort by type
  export type SortBy = "date" | "views" | "likes" | "comments" | "shares" | "averageViewsPerDay"
  
  // Sort order type
  export type SortOrder = "asc" | "desc"
  