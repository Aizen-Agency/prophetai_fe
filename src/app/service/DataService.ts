// services/DataService.ts

import { api } from './api'

const DataService = {
  // Auth
  login: async (data: { email: string; password: string }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || responseData.error || 'An error occurred during login'
        };
      }
      
      return responseData;
    } catch (error) {
      throw error;
    }
  },

  signup: async (data: {
    firstname: string
    lastname: string
    phoneNo: string
    email: string
    password: string
  }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw {
          status: response.status,
          message: responseData.message || responseData.error || 'An error occurred during signup'
        };
      }
      
      return responseData;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard
  getInsights: (userId: number) => fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/insights/${userId}`, {
    method: 'GET',
    credentials: 'include',
  }),


  // Videos
  getVideos: (userId: number) => api(`/videos/${userId}`),

  uploadVideo: (formData: FormData) =>
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }),

  deleteVideo: (videoId: number) =>
    api(`/videos/${videoId}`, {
      method: 'DELETE',
    }),

  // Script Ideas
  generateScriptIdeas: (data: {
    product_name: string
    description: string
    link: string
    script_idea: string
  }) =>
    api('/generate-script-idea', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateMultipleIdeas: async (data: {
    product_name: string
    description: string
    link: string
    script_idea: string
  }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-scripts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to generate multiple ideas')
      }

      return await response.json()
    } catch (error) {
      console.error('Error generating multiple ideas:', error)
      throw error
    }
  },

  async saveScript(data: {
    user_id: number;
    idea_id: string;
    idea_title: string;
    script_title: string;
    script_content: string;
    is_locked: boolean;
  }) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save script');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving script:', error);
      throw error;
    }
  },

  async deleteScriptById(data: {
    user_id: number;
    script_id: string;
  }) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete script');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting script:', error);
      throw error;
    }
  },

  // Video Generation
  async generateVideo(data: {
    user_id: number;
    script_id: number;
  }) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  },

  async getVideosByUserId(userId: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Admin Routes
  getAllVideos: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all videos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all videos:', error);
      throw error;
    }
  },

  // Channels
  async addChannel(data: {
    user_id: number;
    product_id: number;
    product_name: string;
    link?: string;
    description?: string;
  }) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add channel');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding channel:', error);
      throw error;
    }
  },

  async getChannels(userId: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch channels');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching channels:', error);
      throw error;
    }
  },

  async deleteChannel(channelId: number) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/channels/${channelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete channel');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting channel:', error);
      throw error;
    }
  },

  // Instagram Analytics
  async getInstagramAnalytics() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instagram-analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Instagram details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Instagram details:', error);
      throw error;
    }
  },

  async calculateInstagramAnalytics(posts: any[]) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculate-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating Instagram analytics:', error);
      throw error;
    }
  },

  async getScript(data: {
    user_id: number;
    idea_id: string;
  }) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch script');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching script:', error);
      throw error;
    }
  },
}

export default DataService
