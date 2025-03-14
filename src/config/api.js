const BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  ADMIN: {
    REGISTER: `${BASE_URL}/admin/register`,
    LOGIN: `${BASE_URL}/admin/login`,
    GET_ALL: `${BASE_URL}/admin/all`,
    DELETE: adminId => `${BASE_URL}/admin/delete/${adminId}`,
  },
  PRODUCTS: {
    GET_ALL: `${BASE_URL}/products/all`,
    GET_ONE: id => `${BASE_URL}/products/${id}`,
    ADD: `${BASE_URL}/products/add`,
    UPDATE: id => `${BASE_URL}/products/update/${id}`,
    DELETE: id => `${BASE_URL}/products/delete/${id}`,
  },
  ORDERS: {
    GET_ALL: `${BASE_URL}/order/all`,
  },
};

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const adminAuth = localStorage.getItem('adminAuth');
    const token = adminAuth ? JSON.parse(adminAuth).token : null;

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific HTTP status codes
      switch (response.status) {
        case 401:
          throw new Error('Invalid credentials');
        case 404:
          throw new Error('User not found');
        case 423:
          throw new Error('Account locked');
        case 403:
          throw new Error('Account disabled');
        case 500:
          throw new Error(`Server error: ${data}`);
        default:
          throw new Error(data || 'Request failed');
      }
    }

    return data;
  } catch (error) {
    if (!error.response && !navigator.onLine) {
      throw new Error('Network error - Please check your internet connection');
    }
    throw error;
  }
};
