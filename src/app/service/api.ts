// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const api = async <T = any>(
  url: string,
  options: RequestInit = {},
  requiresJson = true
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // If using cookies
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody?.message || 'API Error')
  }

  return requiresJson ? response.json() : (response as any)
}
