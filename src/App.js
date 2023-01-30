import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import {
  useSyncedState,
} from './App.hooks.js'

import FavouriteIcon from './components/FavouriteIcon'
import StarIcon from './components/StarIcon'

function onClickFavouritePartial(setFavourites, id) {
  return (checked) => {
    setFavourites(prev => {
      if (!checked) return prev.filter(prevId => prevId !== id)
      return [
        ...prev,
        id,
      ]
    })
  }
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [repos, setRepos] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [total, setTotal] = useState(0)

  const [
    favourites,
    setFavourites,
    filterFavs,
    setFilterFavs,
    date,
    setDate,
  ] = useSyncedState()

  useEffect(() => {
    if (window.location.search.length) {
      setSearchParams(window.location.search)
    } else {
      setSearchParams('q=created:>' + date + '&sort=stars&order=desc')
    }
  }, [setSearchParams, date])

  useEffect(() => {
    (async() => {
      if (!window.location.search.length) return
      try {
        setErrorMessage(null)
        const { data } = await axios(`https://api.github.com/search/repositories${window.location.search}`) 
        const { total_count, items, message } = data
        if (message) throw new Error(message)
        setTotal(total_count)
        setRepos(items)
      } catch (e) {
        if (e.message) {
          setErrorMessage(e.message)
        } else {
          setErrorMessage('Unkown error')
        }
      }
    })()
  }, [setTotal, setRepos, searchParams, setErrorMessage])

  return (
    <div className="App container mx-auto max-w-4xl mt-6 pt-6">
      <header>
        <h1 className="text-2xl font-bold">Git Trender</h1>
        <br />
        <div className="columns-3">
          <div><label htmlFor="checkbox-favourites"><b>Favourites:</b></label> 
            <input
              disabled={favourites.length === 0}
              className="ml-2"
              id="checkbox-favourites"
              type="checkbox"
              checked={filterFavs}
              onChange={({ target }) => setFilterFavs(target.checked)}
            />
          </div>
          <div>
            <label htmlFor="created-from"><b>Created from</b>: </label>
            <input id="created-from" type="date" onChange={({ target }) => {
              setDate(target.value)
              setSearchParams(prev => {
                prev.set('q', 'created:>' + target.value)
                return prev
              })
            }} />
          </div>
          <div className="text-end">
            <button
              className={ favourites.length ? "text-[blueviolet]" : "text-gray-400" }
              onClick={() => {
                setFavourites([])
                setFilterFavs(false)
            }}>Clear favourites</button>
          </div>
        </div>
        <br />
      </header>
      <main>
        { errorMessage && <p className="bg-red-300  p-3 rounded-md">{ errorMessage }</p> }
        {
          repos.reduce((reposAcc, repo, i) => {
            const favourited = !!favourites.find(fvid => fvid === repo.id)

            if (
              !filterFavs
              || (filterFavs && favourited)
            ) return [
              ...reposAcc,
              <div className="card" key={repo.id}>
                <div className="flex justify-between columns-2">
                  <div className="flex w-[80%]">
                    <img
                      alt="The user's avatar"
                      className="mr-3 inline-block h-12 w-12 rounded-full ring-2 ring-white"
                      src={repo.owner?.avatar_url}
                    />
                    <div>
                      <h4 className="text-xl font-bold underline underline-offset-3">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={repo.html_url}
                          className="card-link"
                        >
                          { repo.name }
                        </a>
                      </h4>
                      <p><small>{ repo.description }</small></p>
                      <div className="flex items-center">
                        <StarIcon
                          style={{ width: '1rem' }}
                        /> &nbsp; <small> { repo.stargazers_count }</small>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <FavouriteIcon
                      checked={favourited}
                      onClick={onClickFavouritePartial(setFavourites, repo.id)}
                    />
                  </div>
                </div>
              </div>,
            ]

            if (i === repos.length -1 && !reposAcc?.length) return (
              <p className="bg-slate-200 p-3 rounded-md">
                No repos to display, you may have favourites from a different <b>Created from</b> date selected
              </p>
            )

            return reposAcc
          }, [])
        }
      </main>
    </div>
  )
}

export default App;
