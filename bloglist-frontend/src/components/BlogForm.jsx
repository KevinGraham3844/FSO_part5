import { useState } from 'react'

const BlogForm = ({ createBlog, inputId }) => {

  const [newAuthor, setAuthor] = useState('')
  const [newTitle, setTitle] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      id: inputId
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
                title <input
            data-testid='title'
            value={newTitle}
            onChange={event => setTitle(event.target.value)}
            id='title-input'
          />
        </div>
        <div>
                author <input
            data-testid='author'
            value={newAuthor}
            onChange={event => setAuthor(event.target.value)}
            id='author-input'
          />
        </div>
        <div>
                url <input
            data-testid='url'
            value={newUrl}
            onChange={event => setUrl(event.target.value)}
            id='url-input'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm