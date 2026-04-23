import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add idempotency keys to POST requests
api.interceptors.request.use((config) => {
  if (config.method === 'post' && config.url === '/expenses/') {
    // Check if we already have an idempotency key for this request
    // This is useful for retries
    if (!config.headers['X-Idempotency-Key']) {
      config.headers['X-Idempotency-Key'] = uuidv4();
    }
  }
  return config;
});

// Simple retry logic
api.interceptors.response.use(null, async (error) => {
  const { config, response } = error;
  
  // Retry on network errors or 5xx status codes
  const shouldRetry = !response || (response.status >= 500 && response.status <= 599);
  const retryCount = config.__retryCount || 0;
  const maxRetries = 3;

  if (shouldRetry && retryCount < maxRetries) {
    config.__retryCount = retryCount + 1;
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    
    console.log(`Retrying request (${config.__retryCount}/${maxRetries}) in ${delay}ms...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return api(config);
  }

  return Promise.reject(error);
});

export default api;
