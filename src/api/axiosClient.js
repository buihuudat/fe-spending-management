import axios from 'axios';
import queryString from 'query-string';

// const baseUrl = 'https://spending-572b.onrender.com/api/';
const baseUrl = 'https://be-spending-buihuudat.vercel.app/api/';
// const baseUrl = 'http://localhost:5000/api/';
const getToken = () => localStorage.getItem('token');

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: params => queryString.stringify({ params })
});

axiosClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${getToken()}`
    }
  }
})

axiosClient.interceptors.response.use(response => {
  if (response && response.data) return response.data;
  return response;
}, err => {
  if (!err.response) {
    return alert(err);
  }
  throw err.response
})

export default axiosClient;
