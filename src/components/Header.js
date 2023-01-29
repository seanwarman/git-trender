export default function Header() {
  return <header>
    <h1 className="text-xl">Git Trender</h1>
    <label htmlFor="favourites-filter"><b>Favourites: </b></label>
    <input type="checkbox" id="favourites-filter" />
  </header>
}
