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
}

export default DataService
