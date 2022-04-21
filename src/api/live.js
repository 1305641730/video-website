import axios from '@/api/axios.js'

export const getLiveByUserId = (userId) => axios.get('/lives?userId=' + userId)
export const getLiveById = (id) => axios.get('/lives/' + id)
export const getLives = (pageNum, pageSize) => axios.get('/lives/' + pageNum + '/' + pageSize)
export const saveLiveData = (live) => axios.put('/lives', live)
export const getAllLiveTypes = () => axios.get('/livetypes')
export const openLive = (live) => axios.post('/lives', live)
export const closeLive = (userId) => axios.delete('/lives/' + userId)
