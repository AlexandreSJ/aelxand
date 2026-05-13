import { type Section } from './Sidebar'

const sections: Section[] = ['about', 'projects', 'stack', 'hobbies', 'contact']

const ChevronUp = () => (
  <svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
)
const ChevronDown = () => (
  <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
)

interface Props {
  active: Section
  onSelect: (section: Section) => void
  showHint: boolean
}

export function ScrollNav({ active, onSelect, showHint }: Props) {
  const currentIndex = sections.indexOf(active)

  return (
    <>
      <nav className="scroll-nav" aria-label="Section navigation">
        <button
          className="scroll-nav__top"
          onClick={() => onSelect('about')}
          aria-label="Go to top"
        >
          TOP
        </button>
        <button
          className="scroll-nav__arrow"
          onClick={() => onSelect(sections[Math.max(0, currentIndex - 1)])}
          disabled={currentIndex === 0}
          aria-label="Previous section"
        >
          <ChevronUp />
        </button>
        <div className="scroll-nav__pills">
          {sections.map(section => (
            <button
              key={section}
              className={`scroll-nav__pill ${section === active ? 'scroll-nav__pill--active' : ''}`}
              onClick={() => onSelect(section)}
              aria-label={`Go to ${section}`}
              aria-current={section === active ? 'true' : undefined}
            />
          ))}
        </div>
        <button
          className="scroll-nav__arrow"
          onClick={() => onSelect(sections[Math.min(sections.length - 1, currentIndex + 1)])}
          disabled={currentIndex === sections.length - 1}
          aria-label="Next section"
        >
          <ChevronDown />
        </button>
      </nav>
      <div className={`scroll-hint ${showHint ? '' : 'scroll-hint--hidden'}`} aria-hidden="true">
        scroll
        <div className="scroll-hint__arrow"><ChevronDown /></div>
      </div>
    </>
  )
}
