// Draws a list of items with a cursor. It only draws what it is given.
export default function Menu({ items, cursor }) {
    return (
      <ul className="menu">
        {items.map((item, i) => (
          <li
            key={item.label}
            className={i === cursor ? 'menu__row menu__row--on' : 'menu__row'}
          >
            <span className="menu__cursor">{i === cursor ? '▶' : ''}</span>
            {item.label}
          </li>
        ))}
      </ul>
    )
  }