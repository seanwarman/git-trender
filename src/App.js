import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import Header from './components/Header'
import Main from './components/Main'
import Repos from './components/Repos'

import { GIT_RENDER_INITIAL_SEARCH } from './constants'

import { repo } from './stubs/githubSearchApi'

function App() {
  const [favourites, setFavourites] = useState([])
  const [search, setSearch] = useSearchParams()
  const [favFilter, setFavFilter] = useState(false)

  useEffect(() => {
    if (!search.toString().length) {
      setSearch(GIT_RENDER_INITIAL_SEARCH)
    }
  }, [search, setSearch])

  return (
    <>
      <Header
        onChangeFavFilter={setFavFilter}
        favFilter={favFilter}
      />
      <Main>
        <Repos
          favFilter={favFilter}
          favourites={favourites}
          repos={Array(9).fill(repo).map((r,i) => ({ ...r, id: r.id + i }))}
          onCheck={checkedId => {
            setFavourites(prev => {
              if (!prev.includes(checkedId)) return [...prev, checkedId]
              return prev.filter(id => id !== checkedId)
            })
          }}
        />
      </Main>
    </>
  )
}

export default App
