import axios from './axios.js'

export const getVideos = () => axios.get('/videos')
export const getVideosById = (id) => axios.get('/videos/userid/' + id)
export const getVideosBykeyword = (video) => axios.post('/videos/keyword', video)
export const deleteVideo = (id) => axios.delete('/videos/' + id)
export const uploadImg = (formData) => axios.post('/videos/img', formData)
export const uploadVideo = (formData) => axios.post('/videos', formData)
export const uploadVideoInfo = (video) => axios.post('/videos/info', video)
export const getVideoTypes = () => axios.get('/videotypes')
export const getVideoById = (id) => axios.get('/videos/' + id)
