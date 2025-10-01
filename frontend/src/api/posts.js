const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function fetchPosts(name) {
  const url = new URL('/posts', API_BASE_URL);
  if (name && name.trim().length > 0) {
    url.searchParams.set('name', name.trim());
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}
