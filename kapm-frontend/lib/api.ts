import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8004/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor dla dodania tokena
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor dla obsługi odświeżania tokena
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          Cookies.set('access_token', response.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed - logout user
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login/', { username, password });
    const { access, refresh, user } = response.data;

    Cookies.set('access_token', access);
    Cookies.set('refresh_token', refresh);
    Cookies.set('user', JSON.stringify(user));

    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } finally {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('user');
    }
  },

  register: async (data: any) => {
    return api.post('/auth/register/', data);
  },

  getUser: () => {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!Cookies.get('access_token');
  },
};

// Public API endpoints
export const publicAPI = {
  getBlogPosts: () => api.get('/public/blog/'),
  getBlogPost: (id: number) => api.get(`/public/blog/${id}/`),
  getPages: () => api.get('/public/pages/'),
  getPage: (slug: string) => api.get(`/public/pages/${slug}/`),
  getCategories: () => api.get('/public/categories/'),
  getTags: () => api.get('/public/tags/'),
  getComments: (postId: number) => api.get(`/public/comments/?post=${postId}`),
  createComment: (data: any) => api.post('/public/comments/', data),
};

// Admin API endpoints
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats/'),
  getRecentPosts: () => api.get('/admin/dashboard/recent-posts/'),
  getRecentComments: () => api.get('/admin/dashboard/recent-comments/'),

  // Blog management
  getBlogPosts: () => api.get('/admin/blog/'),
  getBlogPost: (id: number) => api.get(`/admin/blog/${id}/`),
  createBlogPost: (data: any) => api.post('/admin/blog/', data),
  updateBlogPost: (id: number, data: any) => api.put(`/admin/blog/${id}/`, data),
  deleteBlogPost: (id: number) => api.delete(`/admin/blog/${id}/`),

  // Pages management
  getPages: () => api.get('/admin/pages/'),
  getPage: (id: number) => api.get(`/admin/pages/${id}/`),
  createPage: (data: any) => api.post('/admin/pages/', data),
  updatePage: (id: number, data: any) => api.put(`/admin/pages/${id}/`, data),
  deletePage: (id: number) => api.delete(`/admin/pages/${id}/`),

  // Categories management
  getCategories: () => api.get('/admin/categories/'),
  getCategory: (id: number) => api.get(`/admin/categories/${id}/`),
  createCategory: (data: any) => api.post('/admin/categories/', data),
  updateCategory: (id: number, data: any) => api.put(`/admin/categories/${id}/`, data),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}/`),

  // Tags management
  getTags: () => api.get('/admin/tags/'),
  getTag: (id: number) => api.get(`/admin/tags/${id}/`),
  createTag: (data: any) => api.post('/admin/tags/', data),
  updateTag: (id: number, data: any) => api.put(`/admin/tags/${id}/`, data),
  deleteTag: (id: number) => api.delete(`/admin/tags/${id}/`),

  // Media management
  getMediaFiles: () => api.get('/admin/media/'),
  uploadMedia: (formData: FormData) => api.post('/admin/media/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteMedia: (id: number) => api.delete(`/admin/media/${id}/`),

  // Comments management
  getComments: () => api.get('/admin/comments/'),
  approveComment: (id: number) => api.patch(`/admin/comments/${id}/`, { is_approved: true }),
  deleteComment: (id: number) => api.delete(`/admin/comments/${id}/`),

  // Users management
  getUsers: () => api.get('/admin/users/'),
  getUser: (id: number) => api.get(`/admin/users/${id}/`),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}/`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}/`),
};