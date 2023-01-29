import FavouriteIcon from './FavouriteIcon'
import RepoCard from './RepoCard'

export default function Repos({ favourites = [], repos, onCheck, favFilter }) {
  return (
    <ul>
      {
        repos.reduce((reposAcc, repo) => {
          if (favFilter && !favourites.includes(repo.id)) return reposAcc

          return [
            ...reposAcc,
            <li key={repo.id} data-testid={repo.id}>
              <RepoCard repo={repo}>
                <FavouriteIcon
                  checked={favourites.includes(repo.id)}
                  onClick={() => {
                    onCheck(repo.id)
                  }}
                />
              </RepoCard>
            </li>
          ]
        }, [])
      }
    </ul>
  )
}
