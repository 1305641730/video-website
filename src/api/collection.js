import axios from './axios.js'

export const deleteCollection = (userId, videoId) => axios.delete('/collections/' + userId + '/' + videoId)
