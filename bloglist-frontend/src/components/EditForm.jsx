import { useState } from 'react'

const EditForm = ({ blog, textType, editBlog }) => {

  const [newText, setText] = useState('')
  const [editVisibility, setEditVisibility] = useState(false)

  const showEdit = { display: editVisibility ? '' : 'none' }

  const toggleEdit = (event) => {
    event.preventDefault()
    setEditVisibility(!editVisibility)
  }

  const updateBlog = () => {

    const updatedBlogObject = {
      author: textType === 'author' ? newText : blog.author,
      id: blog.id,
      liked: blog.likes,
      title: textType === 'title' ? newText : blog.title,
      url: textType === 'url' ? newText : blog.url,
      user: {
        username: blog.user.username,
        name: blog.user.name,
        id: blog.user.id
      }
    }

    editBlog(updatedBlogObject)

  }

  return (
    <div>
      <button onClick={toggleEdit}>edit</button>
      <div style={showEdit}>
        <form onSubmit={updateBlog}>
          <div>
            <input
              data-testid='editbox'
              value={newText}
              onChange={event => setText(event.target.value)}
            />
          </div>
          <button type='submit'>update</button>
          <button onClick={toggleEdit}>cancel</button>
        </form>
      </div>
    </div>
  )
}

export default EditForm