import { useState } from 'react'

import Header from './components/Header'
import Main from './components/Main'
import Repos from './components/Repos'

import { repo } from './stubs/githubSearchApi'

function App() {
  const [favourites, setFavourites] = useState([])
  return (
    <>
      <Header />
      <Main>
        <Repos
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
