import axios from './axios.js'

export const getAllSysInfo = () => axios.get('/sysinfos')
