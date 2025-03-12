const BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  ADMIN: {
    REGISTER: `${BASE_URL}/admin/register`,
    LOGIN: `${BASE_URL}/admin/login`,
  },
  PRODUCTS: {
    GET_ALL: `${BASE_URL}/products/all`,
    ADD: `${BASE_URL}/products/add`,
  },
};

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Something went wrong');
  }
};
