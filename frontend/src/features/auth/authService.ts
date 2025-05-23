import axios from 'axios';

// Define these types or import them. For now, using 'any'.
// Consider creating a shared types file, e.g., frontend/src/features/auth/types.ts
export interface IRegisterFormInput {
  username: string;
  email: string;
  password: string;
}

export interface ILoginFormInput {
  email: string;
  password: string;
}

// User type based on backend response (excluding password)
export interface User {
  id: string;
  username: string;
  email: string;
}


const API_URL = '/api/auth/'; // Adjust if your backend proxy is different in vite.config.ts

// Register user
const register = async (userData: IRegisterFormInput) => {
  const response = await axios.post<{ user: User, token: string }>(API_URL + 'register', userData);
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    // Set Axios default header for subsequent requests
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
  }
  return response.data; // Contains user and token
};

// Login user
const login = async (userData: ILoginFormInput) => {
  const response = await axios.post<{ user: User, token: string }>(API_URL + 'login', userData);
  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    // Set Axios default header
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
  }
  return response.data; // Contains user and token
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  // Remove Axios default header
  delete axios.defaults.headers.common['Authorization'];
  // Note: User state will be cleared in the slice/reducer
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
