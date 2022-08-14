import axiosClient from "./axiosClient";

const adminApi = {
  delete: payload => axiosClient.post('admin/delete', payload)
}

export default adminApi;