import axios from 'axios'
import cookie from '@/utils/cookie'
import Swal from 'sweetalert2'

const url = 'https://todolist-api.hexschool.io'

const api = async (type, link, payload, log) => {
  try {
    const { data } = await axios[type](`${url + link}`, payload, log)
    if (data.token) {
      cookie.set('token', data.token, 3)
    }
    return data
  } catch (error) {
    Swal.fire({
      title: 'Oops...!',
      text: error.response.data.message,
      icon: 'error',
      confirmButtonText: 'OK',
    })
    return false
  }
}

export default api
