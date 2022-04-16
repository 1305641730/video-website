import axios from './axios.js'

export const sendCode = (username, email) => axios.post('/users/sendcode?username=' + username + '&email=' + email)
export const registerUser = (user) => axios.post('/users/register', user, { withCredentials: true })
export const isExist = (user) => axios.post('/users/exist', user)
export const loginUser = (user) => axios.post('/users/login', user)
export const validateToken = (token) => axios.post('/users/validate', token)
export const getUserById = (id) => axios.get('/users/' + id)
export const updateUser = (user) => axios.put('/users', user)
export const updatePwd = (user) => axios.put('/users/updatepwd', user)
export const uploadAvatar = (file) => axios.post('/users/uploadAvatar', file)
