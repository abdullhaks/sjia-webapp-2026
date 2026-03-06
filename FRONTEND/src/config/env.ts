/**
 * Environment Configuration
 * Safely resolves the API URL and Base URL for Vercel, Render, or Local scenarios.
 */

// If deployed on Vercel, use the reverse proxy rewrite rule to avoid 401 Cross-Domain Cookie blocks.
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

export const API_URL = isVercel
    ? '/api/backend'
    : (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

export const BASE_URL = isVercel
    ? ''
    : ((import.meta as any).env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000');
