import { render, screen } from '@testing-library/react'
import { repo } from '../stubs/githubSearchApi'
import RepoCard from './RepoCard'

test('to have a title matching the repo\'s name', () => {
  render(<RepoCard repo={repo} />)
  expect(screen.getByText(repo.name)).toBeInTheDocument()
})

test('to include a link to the repo url', () => {
  render(<RepoCard repo={repo} />)

  const link = screen.getByRole('link')
  expect(link.href).toBe(repo.html_url)
})
