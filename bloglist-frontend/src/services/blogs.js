import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log(token)
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateBlog = async updatedObject => {
  const specificIdUrl = `${baseUrl}/${updatedObject.id}`

  const response = await axios.put(specificIdUrl, updatedObject)
  return response.data
}

const deleteBlog = async requestedBlog => {
  const config = {
    headers: { Authorization: token }
  }
  const specificIdUrl = `${baseUrl}/${requestedBlog.id}`
  await axios.delete(specificIdUrl, config, requestedBlog)
}

export default { getAll, setToken, create, updateBlog, deleteBlog }