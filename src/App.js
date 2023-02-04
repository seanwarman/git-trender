import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import Header from './components/Header'
import Main from './components/Main'
import Repos from './components/Repos'

import { GIT_RENDER_INITIAL_SEARCH } from './constants'

async function getData(search) {
  try {
    const { data } = await axios(`https://api.github.com/search/repositories?${search.toString()}`) 
    const { items } = data

    return items

  } catch (error) {
    throw error
  }
}

function App({ onChangeUrl = getData }) {
  const [favourites, setFavourites] = useState([])
  const [search, setSearch] = useSearchParams()
  const [favFilter, setFavFilter] = useState(false)
  const [repos, setRepos] = useState([])

  useEffect(() => {
    if (!search.toString().length) {
      setSearch(GIT_RENDER_INITIAL_SEARCH)
    }
  }, [search, setSearch])

  useEffect(() => {
    if (search.toString().length) {
      (async () => {
        try {
          const items = await onChangeUrl(search)
          setRepos(items)
        } catch (error) {
          console.log(`@FILTER error:`, error)
          // setError(error)
        }
      })()
    }
  }, [onChangeUrl, search, setRepos])

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
          repos={repos}
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
