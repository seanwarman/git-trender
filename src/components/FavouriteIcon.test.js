import { render, screen } from '@testing-library/react'
import FavouriteIcon from './FavouriteIcon'

import { repo } from '../stubs/githubSearchApi'

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
