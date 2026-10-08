import '../styles/plain.css'
import { portfolio } from '../data/portfolio.js'

// Web links open in a new tab. mailto and local links open normally.
function Anchor({ url, children }) {
  const external = /^https?:/.test(url)
  const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={url} {...extra}>
      {children}
    </a>
  )
}

// A page with a link shows the link (its "A = open" line is only for the console).
function Pages({ pages }) {
  return pages.map((page, i) => (
    <div key={i}>
      <h4>{page.title}</h4>
      {page.link ? (
        <p>
          <Anchor url={page.link.url}>{page.link.label}</Anchor>
        </p>
      ) : (
        (page.lines ?? []).map((line, j) => <p key={j}>{line}</p>)
      )}
    </div>
  ))
}

function Items({ items }) {
  return items.map((item, i) => (
    <section key={i}>
      <h3>{item.label}</h3>
      <Pages pages={item.pages ?? []} />
    </section>
  ))
}

export default function PlainView({ onBack }) {
  return (
    <div className="plain">
      <main className="plain-page">
        <button type="button" className="plain-back" onClick={onBack}>
          &larr; Back to the console
        </button>

        <h1>{portfolio.name}</h1>
        <p>{portfolio.title}</p>

        <h2>About</h2>
        <Pages pages={portfolio.about ?? []} />

        <h2>Projects</h2>
        <Items items={portfolio.projects ?? []} />

        <h2>Skills</h2>
        <Pages pages={portfolio.skills ?? []} />

        <h2>Experience</h2>
        <Items items={portfolio.experience ?? []} />

        <h2>Contact</h2>
        <ul>
          {(portfolio.contact ?? []).map((c, i) => (
            <li key={i}>
              <Anchor url={c.url}>{c.label}</Anchor>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}