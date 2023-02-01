import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import App from './App'
import { GIT_RENDER_INITIAL_SEARCH } from './constants'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
])

test('to have a main role element', () => {
  render(<RouterProvider router={router} />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})

test('to have a list role element', () => {
  render(<RouterProvider router={router} />)
  expect(screen.getByRole('list')).toBeInTheDocument()
})

test('clicking a bookmark icon highlights that bookmark', async () => {
  render(<RouterProvider router={router} />)

  const iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  userEvent.click(iconEls[0])
  expect(iconEls[0].getAttribute('aria-checked')).toBe('true')
})

test('clicking the filter checkbox, filters the list to match favourites', async () => {
  render(<RouterProvider router={router} />)

  let iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  userEvent.click(iconEls[0])
  userEvent.click(iconEls[1])
  const favCheckbox = await screen.findByLabelText(/Favourites/)
  userEvent.click(favCheckbox)

  iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  expect(iconEls.length).toBe(2)
})

test('that the icon can be tabbed to and enter or space triggers an event', async () => {
  let keyupCount = 0
  render(<RouterProvider router={router} />)

  userEvent.tab()
  userEvent.tab()
  userEvent.tab()
  userEvent.keyboard('[Enter]')
  let iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  expect(iconEls.length).toBe(1)

  userEvent.tab()
  userEvent.tab()
  userEvent.keyboard('[Space]')
  iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  expect(keyupCount).toBe(2)
})

test('pressing enter or space on the filter checkbox, filters the list to match favourites', async () => {
  render(<RouterProvider router={router} />)

  const favCheckbox = await screen.findByLabelText(/Favourites/)

  userEvent.tab()
  userEvent.keyboard('[Space]')
  expect(favCheckbox.checked).toBe(true)

  userEvent.keyboard('[Enter]')
  expect(favCheckbox.checked).toBe(false)
})

test('changing the url search params requests different results from github', () => {
  delete window.location
  window.location = new URL('https://site.com')

  render(<RouterProvider router={router} />)
  expect(window.location.search).toEqual(GIT_RENDER_INITIAL_SEARCH)
})

test('entering a language into the input updates the search params and triggers a new request', async () => {
  delete window.location
  window.location = new URL('https://site.com')

  render(<RouterProvider router={router} />)

  const langInput = await screen.findByLabelText(/Language/)
  langInput.focus()
  userEvent.keyboard('java')
  expect(window.location.search).toContain('language%3Ajava')
})
