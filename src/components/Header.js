export default function Header({ favFilter, onChangeFavFilter, onChangeLang }) {
  return <header>
    <h1 className="text-xl">Git Trender</h1>
    <label htmlFor="favourites-filter"><b>Favourites: </b></label>
    <input
      checked={!!favFilter}
      onKeyUp={e => {
        e.preventDefault()
        if (e.key === 'Enter' || e.key === ' ') {
          onChangeFavFilter(!favFilter)
        }
      }}
      onChange={() => {
        onChangeFavFilter(!favFilter)
      }}
      type="checkbox"
      id="favourites-filter"
    />
    <label htmlFor="language-filter"><b>Language: </b></label>
    <input
      id="language-filter"
      onKeyUp={({ key, target }) => {
        if (key === 'Enter') {
          onChangeLang(target.value)
        }
      }}
    />
  </header>
}
