import { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import FavouriteIcon from './components/FavouriteIcon'
import StarIcon from './components/StarIcon'
import Header from './components/Header'

import { useSyncedState } from './App.hooks.js'

function createdDate(created_at) {
  const createdDate = new Date(created_at)
  return createdDate.toDateString()
}

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
  const ignoreRef = useRef(false)

  const [
    favourites,
    setFavourites,
    filterFavs,
    setFilterFavs,
    date,
    setDate,
    lang,
    setLang,
  ] = useSyncedState()

  useEffect(() => {
    if (lang) {
      setSearchParams(prev => {
        (!date && prev.set('q', 'language' + lang))
          || (!lang && prev.set('q', 'created:>' + date))
          || prev.set('q', 'language:' + lang + ' created:>' + date)
        return prev
      })
    } else {
      setSearchParams('q=created:>' + date + '&sort=stars&order=desc')
    }
  }, [date, lang, setSearchParams])

  useEffect(() => {
    if (window.location.search.length) {
      setSearchParams(window.location.search)
    }
  }, [setSearchParams])

  useEffect(() => {
    if (!ignoreRef.current) (async () => {
      ignoreRef.current = true
      try {
        setErrorMessage(null)
        const { data } = await axios(`https://api.github.com/search/repositories${window.location.search}`) 
        const { items, message } = data
        if (message) throw new Error(message)
        setRepos(items)
      } catch (e) {
        if (e.message) {
          setErrorMessage(e.message)
        } else {
          setErrorMessage('Unkown error')
        }

      }
      ignoreRef.current = false
    })()
  }, [searchParams])

  return (
    <div className="App container mx-auto max-w-4xl mt-6 pt-6">
      <Header
        onChangeDate={({ target }) => {
          setDate(target.value)
        }}
        onChangeLang={lang => {
          setLang(lang)
        }}
        filterFavs={filterFavs}
        favourites={favourites}
        onChangeFilterFavourites={({ target }) => setFilterFavs(target.checked)}
        onClearFavourites={() => {
          setFavourites([])
          setFilterFavs(false)
        }}
      />
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
                      <p>{ repo.description }</p>
                      <div>
                        <small>{ createdDate(repo.created_at) }</small>
                      </div>
                      <div className="flex items-center">
                        { repo.language && <small className="text-white bg-zinc-800 px-1 mr-2 rounded">{ repo.language }</small> }
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
