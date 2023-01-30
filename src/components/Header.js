import { useRef } from 'react'

export default function Header({
  filterFavs,
  favourites,
  onChangeDate,
  onChangeLang,
  onChangeFilterFavourites,
  onClearFavourites,
}) {
  const timeoutRef = useRef(null)
  const inputRef = useRef('')

  return <header>
    <h1 className="text-2xl font-bold">Git Trender</h1>
    <br />
    <div className="columns-4">
      <div><label htmlFor="checkbox-favourites"><b>Favourites:</b></label> 
        <input
          disabled={favourites.length === 0}
          className="ml-2"
          id="checkbox-favourites"
          type="checkbox"
          checked={filterFavs}
          onChange={onChangeFilterFavourites}
        />
      </div>
      <div>
        <label htmlFor="created-from"><b>Created from: </b></label>
        <input id="created-from" type="date" onChange={onChangeDate} />
      </div>
      <div>
        <label htmlFor="language"><b>Language: </b></label>
        <input
          className="pl-1 border-solid border-2 border-gray rounded"
          id="language"
          onChange={({ target }) => {
            timeoutRef.current = setTimeout(() => {
              clearTimeout(timeoutRef.current)
              const { value } = target
              onChangeLang(value)
            }, 1000)
          }}
        />
      </div>
      <div className="text-end">
        <button
          className={ favourites.length ? "text-[blueviolet]" : "text-gray-400" }
          onClick={onClearFavourites}>Clear favourites</button>
      </div>
    </div>
    <br />
  </header>
}
