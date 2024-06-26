import axios from 'axios';
import {BASE_URL} from 'config';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
},
});

export default apiClient;