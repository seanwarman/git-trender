import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import App from './App'
import { GIT_RENDER_INITIAL_SEARCH } from './constants'

import { repo } from './stubs/githubSearchApi'

const QUERY_TIMEOUT = 5000

jest.setTimeout(QUERY_TIMEOUT * 3)

const customRender = (props) => {
  const { onChangeSearch, initialEntries } = props || { onChangeSearch: null, initialEntries: null }

  const appProps = onChangeSearch ? { onChangeSearch: search => act(() => onChangeSearch(search)) } : {}

  render(<RouterProvider router={createMemoryRouter([{
    path: '/',
    element: <App {...appProps}  />
  }], {
    initialEntries: initialEntries || ['/']
  })} />)
}

const mockRepos = Array(9).fill(repo).map((r,i) => ({ ...r, id: r.id + i }))

test('to have a main role element', () => {
  customRender()
  expect(screen.getByRole('main')).toBeInTheDocument()
})

test('to have a list role element', () => {
  customRender()
  expect(screen.getByRole('list')).toBeInTheDocument()
})

test('clicking a bookmark icon highlights that bookmark', async () => {
  customRender({
    onChangeSearch: () => [repo]
  })

  const iconEls = await screen.findAllByLabelText(/Favourite checkbox/, {}, {
    timeout: QUERY_TIMEOUT,
  })

  userEvent.click(iconEls[0])
  expect(iconEls[0].getAttribute('aria-checked')).toBe('true')
})

test('clicking the filter checkbox, filters the list to match favourites', async () => {
  customRender({ onChangeSearch: () => mockRepos })

  let iconEls = await screen.findAllByLabelText(/Favourite checkbox/, {
    timeout: QUERY_TIMEOUT,
  })
  userEvent.click(iconEls[0])
  userEvent.click(iconEls[1])
  const favCheckbox = await screen.findByLabelText(/Favourites/)
  userEvent.click(favCheckbox)

  iconEls = await screen.findAllByLabelText(/Favourite checkbox/)
  expect(iconEls.length).toBe(2)
})

test('that the icon can be changed by clicking or pressing enter or space', async () => {
  customRender({ onChangeSearch: () => mockRepos })

  const [icon] = await screen.findAllByLabelText(/Favourite checkbox/, {
    selector: '[aria-checked="false"]',
  }, {
    timeout: QUERY_TIMEOUT,
  })

  userEvent.click(icon)
  expect(icon.getAttribute('aria-checked')).toMatch('true')

  userEvent.keyboard('[Enter]')
  expect(icon.getAttribute('aria-checked')).toMatch('false')

  userEvent.keyboard('[Space]')
  expect(icon.getAttribute('aria-checked')).toMatch('true')
})

test('clicking or pressing enter or space on the filter checkbox, filters the list to match favourites', async () => {
  customRender({ onChangeSearch: () => mockRepos })

  const icons = await screen.findAllByLabelText(/Favourite checkbox/, {
    selector: '[aria-checked="false"]',
  })

  userEvent.click(icons[0])
  userEvent.click(icons[1])
  userEvent.click(icons[2])

  const favCheckbox = await screen.findByLabelText(/Favourites/)

  userEvent.click(favCheckbox)
  expect(favCheckbox.checked).toBe(true)

  userEvent.keyboard('[Space]')
  expect(favCheckbox.checked).toBe(false)

  let iconsSelected = await screen.findAllByLabelText(/Favourite checkbox/)
  expect(iconsSelected.length).toBeGreaterThan(3)

  userEvent.keyboard('[Enter]')
  expect(favCheckbox.checked).toBe(true)

  iconsSelected = await screen.findAllByLabelText(/Favourite checkbox/)

  expect(iconsSelected.length).toBe(3)
  expect(icons.some(icon => icon.value === iconsSelected[0].value)).toBe(true)
  expect(icons.some(icon => icon.value === iconsSelected[1].value)).toBe(true)
  expect(icons.some(icon => icon.value === iconsSelected[2].value)).toBe(true)
})

test('going to the root address, ie "/", sends an onChangeSearch event with the default search params', async () => {
  customRender({
    onChangeSearch: search => {
      expect('?' + search.toString()).toBe(GIT_RENDER_INITIAL_SEARCH)
    },
    initialEntries: ['/'],
  })
})

test('going to the root address with added params sends those params, not the default params, to the onChangeSearch event', async () => {
  const pathWithParams = '/?q=created%3A%3E2014-01-12'
  customRender({
    onChangeSearch: search => {
      expect('/?' + search.toString()).toBe(pathWithParams)
    },
    initialEntries: [pathWithParams],
  })
})

// test('entering a language into the input updates the search params in the url', () => {
//   throw Error('TODO')
// })

// test('entering a language into the input displays a new list of results filtered by that language', async () => {
//   delete window.location
//   window.location = new URL('https://site.com')

//   render(<RouterProvider router={router} />)

//   const langInput = await screen.findByLabelText(/Language/)
//   langInput.focus()
//   userEvent.keyboard('java')
//   expect(window.location.search).toContain('language%3Ajava')
// })
//
// test('options are synced to the user\'s browser store', () => {
//   throw Error('TODO')
// })
