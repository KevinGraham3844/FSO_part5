import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<Blog Form /> updates parent state and calls onSubmit', async() => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} inputId={'fakeid12345'}/>)

  const title = container.querySelector('#title-input')
  const author = container.querySelector('#author-input')
  const url = container.querySelector('#url-input')
  const submitButton = screen.getByText('create')

  await user.type(title, 'testing functionality of blogform')
  await user.type(author, 'cameron ghahremani')
  await user.type(url, 'testingthisblog.com')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing functionality of blogform')
  expect(createBlog.mock.calls[0][0].author).toBe('cameron ghahremani')
  expect(createBlog.mock.calls[0][0].url).toBe('testingthisblog.com')
  expect(createBlog.mock.calls[0][0].id).toBe('fakeid12345')
})