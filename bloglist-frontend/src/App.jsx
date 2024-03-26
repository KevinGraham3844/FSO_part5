/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import './index.css'
import Blog from './components/Blog'
import ErrorNotification from './components/ErrorNotification'
import CreateNotification from './components/CreateNotification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [createdMessage, setcreatedMessage] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    console.log(user)
    blogService.getAll().then(blogs => {
      blogs = blogs.sort((a, b) => a.likes - b.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const updateBlog = async (blogObject) => {
    await blogService.updateBlog(blogObject)
  }

  const removeBlog = async (blogObject) => {
    await blogService.deleteBlog(blogObject)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    console.log(newBlog)

    setcreatedMessage(`a new blog ${newBlog.title} by ${newBlog.author} added!`)
    setTimeout(() => {
      setcreatedMessage(null)
    }, 5000)
    setBlogs(blogs.concat(newBlog))

  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(user)
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      console.log(errorMessage)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h1>log in to application</h1>
        <ErrorNotification message={errorMessage}/>
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          setUserFunc={({ target }) => setUsername(target.value)}
          setPassFunc={({ target }) => setPassword(target.value)}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <CreateNotification message={createdMessage}/>
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} inputId={user.id}/>
        </Togglable>
      </div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          deleteBlog={removeBlog}
        />
      )}
    </div>
  )
}

export default App