import axios from './axios.js'

export const sendComments = (comment) => axios.post('/comments', comment)
export const getComments = (id) => axios.get('/comments/' + id)
export const getCommentsByUserId = (userId) => axios.get('/comments/userid/' + userId)
