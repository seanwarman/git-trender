import { render, screen } from '@testing-library/react'
import Header from './Header'

test('has the heading "Git Trender"', () => {
  render(<Header />)
  expect(screen.getByText('Git Trender')).toBeInTheDocument()
})

test('to have an input labeled Favourites', () => {
  render(<Header />)
  const inputElement = screen.getByLabelText(/Favourites/)
  expect(inputElement).toBeInTheDocument()
})

test('for the input to have the checkbox role', () => {
  render(<Header />)
  const inputElement = screen.getByLabelText(/Favourites/)
  expect(screen.getAllByRole('checkbox')).toContain(inputElement)
})

