import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import App from './App'
import { GIT_RENDER_INITIAL_SEARCH } from './constants'

import { repo } from './stubs/githubSearchApi'

const QUERY_TIMEOUT = 5000

jest.setTimeout(QUERY_TIMEOUT * 3)

const customRender = (props) => {
  const { onChangeUrl, initialEntries } = props || { onChangeUrl: null, initialEntries: null }

  const appProps = onChangeUrl ? { onChangeUrl: search => act(() => onChangeUrl(search)) } : {}

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
    onChangeUrl: () => [repo]
  })

  const iconEls = await screen.findAllByLabelText(/Favourite checkbox/, {}, {
    timeout: QUERY_TIMEOUT,
  })

  userEvent.click(iconEls[0])
  expect(iconEls[0].getAttribute('aria-checked')).toBe('true')
})

test('clicking the filter checkbox, filters the list to match favourites', async () => {
  customRender({ onChangeUrl: () => mockRepos })

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
  customRender({ onChangeUrl: () => mockRepos })

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
  customRender({ onChangeUrl: () => mockRepos })

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

//
//
// I know, the next two tests are testing implementation, but I can't find a
// good way to test the window.location object in Testing Library's simulated
// environment so this is the next best thing.
//
//
test('going to the root address, ie "/", sends an onChangeUrl event with the default search params', () => {
  let searchParams = null
  const initSearchParams = new URLSearchParams(GIT_RENDER_INITIAL_SEARCH)

  customRender({
    onChangeUrl: search => {
      searchParams = search
    },
    initialEntries: ['/'],
  })

  expect(searchParams.toString()).toBe(initSearchParams.toString())
})

test('going to the root address with added params sends those params, not the default params, to the onChangeUrl event', async () => {
  const pathWithParams = '/?q=created%3A%3E2014-01-12'
  customRender({
    onChangeUrl: search => {
      expect('/?' + search.toString()).toBe(pathWithParams)
    },
    initialEntries: [pathWithParams],
  })
})

test('entering a language into the input updates the search params', async () => {
  let searchStr = null

  customRender({
    onChangeUrl: search => {
      searchStr = search.toString()
    },
  })

  const langInput = screen.getByLabelText(/Language/)
  userEvent.click(langInput)
  userEvent.keyboard('java[Enter]')

  await waitFor(() => {
    expect(searchStr).toContain('language%3Ajava')
  })
})

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
