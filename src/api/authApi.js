import axiosClient from './axiosClient';

const authApi = {
  signup: payload => axiosClient.post('auth/signup', payload),
  login: payload => axiosClient.post('auth/login', payload),
  verifyToken: () => axiosClient.post('auth/verify-token')
}

export default authApi;