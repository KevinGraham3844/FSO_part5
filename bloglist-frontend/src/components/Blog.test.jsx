import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    const blog = {
      author: 'cameron ghahremani',
      id: 'fakeid9348',
      likes: 10,
      title: 'testing functionality of blog rendering',
      url: 'testingblog.com',
      user: {
        name: 'cameron ghahremani',
        username: 'cghahremani',
        id: 'fakeid12345'
      }
    }

    const user = {
      name: 'cameron ghahremani',
      username: 'cghahremani',
      id: 'fakeid12345'
    }

    container = render(<Blog blog={blog} user={user}/>).container
    //screen.debug(container)
  })

  test('title/author are shown while remaining elements are hidden', () => {
    const seenContent = container.querySelector('.seenBlog')

    const hiddenContent = container.querySelector('.hiddenBlog')

    expect(seenContent).toHaveTextContent(
      'testing functionality of blog rendering'
    )

    expect(hiddenContent).toHaveStyle('display: none')
  })

  test('hidden elements switch styles to be seen when clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const hiddenContent = container.querySelector('.hiddenBlog')
    expect(hiddenContent).not.toHaveStyle('display: none')
  })
})

test('addLike function is called twice on two clicks of the like button', async () => {
  const blog = {
    author: 'cameron ghahremani',
    id: 'fakeid9348',
    likes: 10,
    title: 'testing functionality of blog rendering',
    url: 'testingblog.com',
    user: {
      name: 'cameron ghahremani',
      username: 'cghahremani',
      id: 'fakeid12345'
    }
  }

  const user = {
    name: 'cameron ghahremani',
    username: 'cghahremani',
    id: 'fakeid12345'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} updateNewLikes={mockHandler}/>)

  const testUser = userEvent.setup()
  const button = screen.getByText('like')
  await testUser.click(button)
  await testUser.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})