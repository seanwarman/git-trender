import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Repos from './Repos'
import { repo } from '../stubs/githubSearchApi'

test('that it renders the same number of items it\'s given as li elements', () => {
  const repos = [repo, repo, repo].map((r,i) => ({ ...r, id: r.id + i }))
  render(<Repos repos={repos} />)

  expect(screen.getAllByRole('listitem').length).toBe(repos.length)
})

test('that clicking a favourite icon will call onCheck with the clicked id as it\'s arg', async () => {
  const repos = Array(10).fill(repo).map((r,i) => ({ ...r, id: r.id + i }))
  let called = null

  render(<Repos repos={repos} favourites={[]} onCheck={(checkedId) => {
    called = checkedId
  }} />)

  const icons = await screen.findAllByRole('checkbox')
  userEvent.click(icons[0])

  expect(called).toBe(repos[0].id)
})

test('that only the items in favourites are checked', () => {
  const ids = [123, 345, 567, 789]
  const repos = Array(10).fill(repo).map((r,i) => ({ ...r, id: ids[i] || r.id + i }))
  render(<Repos repos={repos} favourites={ids} />)
})

test('that, if favFilter is true, only the repos in favourites are displayed', async () => {
  const ids = [123, 345, 567, 789]
  const repos = Array(10).fill(repo).map((r,i) => ({ ...r, id: ids[i] || r.id + i }))

  render(<Repos repos={repos} favourites={ids} favFilter={true} />)

  const repoEls = await screen.findAllByRole('listitem')
  const elIds = Array.from(repoEls).map(el => Number(el.dataset.testid))

  expect(elIds).toEqual(ids)
})
