import { I_PDF, I_LoginResponse } from '../types';

// Mock PDF data for testing
export const mockPDFs: I_PDF[] = [
  {
    id: '1',
    title: 'React Fundamentals Guide',
    description: 'A comprehensive guide to React fundamentals including components, state, and props.',
    url: '/api/pdfs/1/download',
    uploadDate: '2024-01-15T10:30:00Z',
    size: 2048576, // 2MB
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    description: 'Learn TypeScript best practices and advanced patterns for better code quality.',
    url: '/api/pdfs/2/download',
    uploadDate: '2024-01-20T14:45:00Z',
    size: 1536000, // 1.5MB
  },
  {
    id: '3',
    title: 'Node.js API Development',
    description: 'Complete guide to building RESTful APIs with Node.js and Express.',
    url: '/api/pdfs/3/download',
    uploadDate: '2024-01-25T09:15:00Z',
    size: 3072000, // 3MB
  },
  {
    id: '4',
    title: 'Database Design Patterns',
    description: 'Essential database design patterns and optimization techniques.',
    url: '/api/pdfs/4/download',
    uploadDate: '2024-02-01T16:20:00Z',
    size: 2560000, // 2.5MB
  },
];

// Mock login responses for testing
export const mockLoginResponses: Record<string, I_LoginResponse> = {
  'admin@example.com': {
    code: 'admin',
    subscription: true,
    token: 'mock-admin-token',
    user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
    },
  },
  'user@example.com': {
    code: 'user',
    subscription: true,
    token: 'mock-user-token',
    user: {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
    },
  },
  'nosub@example.com': {
    code: 'user',
    subscription: false,
    token: 'mock-nosub-token',
    user: {
      id: '3',
      email: 'nosub@example.com',
      name: 'No Subscription User',
    },
  },
};
