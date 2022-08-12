import axiosClient from './axiosClient'

const statisticsApi = {
  getAll: (payload) => axiosClient.post('statistics/getAll', payload),
  create: (payload) => axiosClient.post('statistics/create', payload),
  update: (payload) => axiosClient.put('statistics/update', payload),
  delete: (payload) => axiosClient.post('statistics/delete', payload),
}

export default statisticsApi;
