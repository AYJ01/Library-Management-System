const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAuthors = async () => {
  const response = await fetch(`${API_BASE_URL}/authors/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch authors');
  return response.json();
};

export const createAuthor = async (authorData) => {
  const response = await fetch(`${API_BASE_URL}/authors/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(authorData),
  });
  if (!response.ok) throw new Error('Failed to create author');
  return response.json();
};

export const getBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/books/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch books');
  return response.json();
};

export const createBook = async (bookData) => {
  const response = await fetch(`${API_BASE_URL}/books/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookData),
  });
  if (!response.ok) throw new Error('Failed to create book');
  return response.json();
};

export const getBorrowers = async () => {
  const response = await fetch(`${API_BASE_URL}/borrowers/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch borrowers');
  return response.json();
};

export const createBorrower = async (borrowerData) => {
  const response = await fetch(`${API_BASE_URL}/borrowers/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(borrowerData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to borrow book');
  }
  return response.json();
};

