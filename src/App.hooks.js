import { useState, useEffect } from 'react'
import { GIT_TRENDER_DATE, GIT_TRENDER_FAVOURITES, GIT_TRENDER_FILTER_FAVS } from './constants.js'

export const useSyncedState = () => {
  // TODO make this default state more robust...
  const [favourites, setFavourites] = useState(JSON.parse(window.localStorage.getItem(GIT_TRENDER_FAVOURITES)))
  // TODO make this default state more robust...
  const [filterFavs, setFilterFavs] = useState(window.localStorage.getItem(GIT_TRENDER_FILTER_FAVS) === 'true' || false)
  const [date, setDate] = useState(window.localStorage.getItem(GIT_TRENDER_DATE) || '2017-01-10')

  useEffect(() => {
    window.localStorage.setItem(GIT_TRENDER_FILTER_FAVS, String(filterFavs))
  }, [filterFavs])

  useEffect(() => {
    window.localStorage.setItem(GIT_TRENDER_FAVOURITES, JSON.stringify(favourites))
  }, [favourites])

  useEffect(() => {
    date && window.localStorage.setItem(GIT_TRENDER_DATE, date)
  }, [date])

  return [
    favourites,
    setFavourites,
    filterFavs,
    setFilterFavs,
    date,
    setDate,
  ]
}
