import axios from './axios.js'

export const sendComments = (comment) => axios.post('/comments', comment)
export const getComments = () => axios.get('/comments')
