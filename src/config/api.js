const BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  ADMIN: {
    REGISTER: `${BASE_URL}/admin/register`,
    LOGIN: `${BASE_URL}/admin/login`,
  },
  PRODUCTS: {
    GET_ALL: `${BASE_URL}/products/all`,
    GET_ONE: id => `${BASE_URL}/products/${id}`,
    ADD: `${BASE_URL}/products/add`,
    UPDATE: id => `${BASE_URL}/products/update/${id}`,
    DELETE: id => `${BASE_URL}/products/delete/${id}`,
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
      throw new Error(data.message || 'Request failed');
    }

    // For product creation, verify the response has required fields
    if (endpoint === API_ENDPOINTS.PRODUCTS.ADD && !data.productID) {
      console.warn('Backend response missing productID:', data);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw new Error(error.message || 'Something went wrong');
  }
};
