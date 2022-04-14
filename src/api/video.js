import axios from './axios.js'

export const getVideos = () => axios.get('/videos')
export const uploadImg = (formData) => axios.post('/videos/img', formData)
export const uploadVideo = (formData) => axios.post('/videos', formData)
export const uploadVideoInfo = (video) => axios.post('/videos/info', video)
export const getVideoTypes = () => axios.get('/videotypes')
export const getVideoById = (id) => axios.get('/videos/' + id)
