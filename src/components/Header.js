export default function Header({
  filterFavs,
  favourites,
  onChangeDate,
  onChangeFilterFavourites,
  onClearFavourites,
}) {
  return <header>
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
          onChange={onChangeFilterFavourites}
        />
      </div>
      <div>
        <label htmlFor="created-from"><b>Created from</b>: </label>
        <input id="created-from" type="date" onChange={onChangeDate} />
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
