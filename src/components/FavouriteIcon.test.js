import { render, screen } from '@testing-library/react'
import FavouriteIcon from './FavouriteIcon'

import { repo } from '../stubs/githubSearchApi'
import userEvent from '@testing-library/user-event'

function getAriaChecked(el) {
  return el.getAttribute('aria-checked')
}

test('to have the role of checkbox', async () => {
  let favourites = []
  let checked = false
  render(<FavouriteIcon checked={checked} favourites={favourites} repos={[repo]} />)

  const iconElement = screen.getByRole('checkbox')
  expect(getAriaChecked(iconElement)).not.toBeNull()
})

test('that the icon can be tabbed to and enter or space triggers an event', () => {
  let favourites = []
  let checked = false
  let keyupCount = 0
  render(<FavouriteIcon checked={checked} favourites={favourites} repos={[repo]} />)

  userEvent.tab()
  userEvent.keyboard('enter')
  userEvent.keyboard('space')
  expect(keyupCount).toBe(2)

})
