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
        Authorization: `Bearer ${token}`, // Always include token
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error; // Throw the original error to maintain the error message
  }
};
