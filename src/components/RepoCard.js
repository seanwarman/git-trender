export default function RepoCard({ repo, children }) {
  return <div>
    <h3 className="font-xl">
      <a href={repo.html_url}>{ repo.name }</a>
    </h3>
    { children }
  </div>
}
