import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8080/api'
// axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true

export default axios
