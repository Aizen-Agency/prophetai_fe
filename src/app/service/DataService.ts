// services/DataService.ts

import { api } from './api'

const DataService = {
  // Auth
  login: (data: { email: string; password: string }) =>
    api('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  signup: (data: {
    firstname: string
    lastname: string
    phoneNo: string
    email: string
    password: string
  }) =>
    api('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Dashboard
  getInsights: (userId: number) => api(`/insights/${userId}`),

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

  // Scripts
  getScripts: (userId: number) => api(`/scripts/${userId}`),

  uploadScript: (data: { userId: number; title: string; content: string }) =>
    api('/scripts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteScript: (scriptId: number) =>
    api(`/scripts/${scriptId}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-multiple-idea`, {
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
    title: string;
    content: string;
    product_name: string;
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
  }
}

export default DataService
