import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true //  ESSENCIAL para cookies
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      console.error('Erro HTTP:', status, error.response.data);

      if (status === 401) {
        // não existe mais localStorage
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else {
      console.error('Erro de conexão:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;