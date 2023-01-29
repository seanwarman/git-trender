import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('to have a main role element', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})

test('to have a list role element', () => {
  render(<App />)
  expect(screen.getByRole('list')).toBeInTheDocument()
})

test('clicking a bookmark icon highlights that bookmark', async () => {
  render(<App />)
  const iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  userEvent.click(iconEls[0])

  expect(iconEls[0].getAttribute('aria-checked')).toBe('true')
})

test('clicking the filter checkbox, filters the list to match favourites', () => {
  throw Error('TODO')
})

test('pressing enter or space on the filter checkbox, filters the list to match favourites', () => {
  throw Error('TODO')
})

test('changing the url search params requests different results from github', () => {
  throw Error('TODO')
})

test('entering a language into the input updates the search params and triggers a new request', () => {
  throw Error('TODO')
})
