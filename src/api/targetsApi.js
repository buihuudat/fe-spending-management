import axiosClient from "./axiosClient";

const targetsApi = {
  get: (payload) => axiosClient.post(`/targets`, payload),
}

export default targetsApi;