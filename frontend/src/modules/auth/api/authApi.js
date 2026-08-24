import apiClient from '../../../utils/apiClient.js';

/**
 * Auth API Module
 * 
 * Handles all authentication-related API calls.
 */

/**
 * Register a new user
 * 
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{id: string, username: string}>}
 */
export async function register(username, password) {
  const response = await apiClient.post('/auth/register', {
    username,
    password,
  });
  return response.data.data;
}

/**
 * Login user
 * 
 * @param {string} username
 * @param {string} password
 * @returns {{ token: string, user: { id: string, username: string } }}
 */
export async function login(username, password) {
  const response = await apiClient.post('/auth/login', {
    username,
    password,
  });
  return response.data.data;
}

/**
 * Logout user
 */
export async function logout() {
  await apiClient.post('/auth/logout');
}

/**
 * Get current user profile
 * 
 * @returns {{ id: string, username: string, createdAt: string }}
 */
export async function getMe() {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
}
