/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import EditForm from '../components/EditForm'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const [currentLikes, setLikes] = useState(blog.likes)
  const [removeVisible, setRemoveVisible] = useState(true)
  const [hideRemovedBlog, setRemovedBlog] = useState('')

  useEffect(() => {
    console.log(blog.user.id)
    console.log(user.id)
    if (user.id !== blog.user.id) {
      setRemoveVisible(false)
    }
    if (blog.user === user.id) {
      setRemoveVisible(true)
    }
  }, [])

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const removeVisibility = { display: removeVisible ? '' : 'none' }


  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const removeBlog = () => {
    if (window.confirm(
      `remove blog ${blog.title} by ${blog.author}`
    )) {
      deleteBlog(blog)
      setRemovedBlog('none')
    }
  }

  const setNewLikes = () => {
    const updatedBlog = {
      author: blog.author,
      id: blog.id,
      likes: currentLikes + 1,
      title: blog.title,
      url: blog.url,
      user: {
        username: blog.user.username,
        name: blog.user.name,
        id: blog.user.id
      }
    }
    updateBlog(updatedBlog)
    setLikes(currentLikes + 1)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={{ display: hideRemovedBlog }} className='singleBlog'>
      <div style={blogStyle}>
        <div data-testid='blog-header' style={hideWhenVisible} className='seenBlog'>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>show</button>
        </div>
        <div style={showWhenVisible} className='hiddenBlog'>
          <div>
            {blog.title}
            <button onClick={toggleVisibility}>hide</button>
            <div style={removeVisibility}>
              <EditForm blog={blog} textType={'title'} editBlog={updateBlog} />
            </div>
          </div>
          <div>
            {blog.url}
            <div style={removeVisibility}>
              <EditForm blog={blog} textType={'url'} editBlog={updateBlog} />
            </div>
          </div>
          <div>
            likes {currentLikes}
            <button onClick={setNewLikes}>like</button>
          </div>
          <div>
            {blog.author}
            <div style={removeVisibility}>
              <EditForm blog={blog} textType={'author'} editBlog={updateBlog} />
            </div>
          </div>
          <button onClick={removeBlog} style={removeVisibility}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog