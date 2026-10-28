export type Stacks = { title: string; items: string[][] }[]

/**
 * A still shell screen: one `cat` of a markdown file, then the prompt waiting.
 * It is content, not texture, so it stays readable by assistive tech.
 */
export function Terminal({ file, stacks, path }: { file: string; stacks: Stacks; path: string }) {
  return (
    <figure className="term">
      <figcaption className="term__bar">
        <span className="term__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="term__path">{path}</span>
      </figcaption>
      <div className="term__screen">
        <pre className="term__rows">
          <span className="term__cmd"><b aria-hidden="true">~ $ </b>cat {file}{'\n'}</span>
          {stacks.map((s, i) => (
            <span key={s.title}>
              {i > 0 && '\n'}
              <span className="term__h"><b aria-hidden="true">## </b>{s.title}{'\n'}</span>
              {s.items.map(group => (
                <span key={group[0]} className="term__out"><b aria-hidden="true">- </b>{group.join(' · ')}{'\n'}</span>
              ))}
            </span>
          ))}
          <span className="term__cmd"><b aria-hidden="true">~ $ </b></span>
          <span className="term__cur" aria-hidden="true" />
        </pre>
        <div className="term__roll" aria-hidden="true" />
        <div className="term__vig" aria-hidden="true" />
      </div>
    </figure>
  )
}
