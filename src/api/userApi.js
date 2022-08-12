import axiosClient from "./axiosClient";

const userApi = {
  getAllUser: () => axiosClient.post('user/get-all-user'),
  getUser: payload => axiosClient.post('user/info', payload),
  updateUser: payload => axiosClient.put('user/update', payload),
  updateUserImage: payload => axiosClient.put('user/update-image', payload),
  deleteUser: payload => axiosClient.post('/user/delete', payload)
}

export default userApi;