export default function Header({ favFilter, onChangeFavFilter }) {
  return <header>
    <h1 className="text-xl">Git Trender</h1>
    <label htmlFor="favourites-filter"><b>Favourites: </b></label>
    <input
      checked={favFilter}
      onKeyUp={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onChangeFavFilter(e)
        }
      }}
      type="checkbox"
      id="favourites-filter"
    />
  </header>
}
