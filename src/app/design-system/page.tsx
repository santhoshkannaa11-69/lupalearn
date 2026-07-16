export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Design System</h1>
        <p className="text-text-secondary mb-10">Living reference for the Lupa Learning Language.</p>

        {/* Colors */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "bg", class: "bg-bg border border-border" },
              { name: "surface", class: "bg-surface border border-border" },
              { name: "elevated", class: "bg-elevated border border-border" },
              { name: "floating", class: "bg-floating border border-border" },
              { name: "accent", class: "bg-accent" },
              { name: "accent-hover", class: "bg-accent-hover" },
              { name: "accent-soft", class: "bg-accent-soft" },
              { name: "warning", class: "bg-warning" },
              { name: "danger", class: "bg-danger" },
              { name: "info", class: "bg-info" },
              { name: "border", class: "bg-border" },
              { name: "text-primary", class: "bg-text-primary" },
            ].map((c) => (
              <div key={c.name} className={`h-16 rounded-lg ${c.class} flex items-end p-2`}>
                <span className="text-xs text-text-muted bg-elevated/80 px-1.5 py-0.5 rounded">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Typography</h2>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-text-primary">H1 — Page purpose (24px bold)</p>
            <p className="text-lg font-semibold text-text-primary">H2 — Section (18px semibold)</p>
            <p className="text-base font-medium text-text-primary">H3 — Group (16px medium)</p>
            <p className="text-[15px] text-text-primary">Body — Explanation (15px regular)</p>
            <p className="text-sm text-text-secondary">Supporting — Metadata (14px)</p>
            <p className="text-xs text-text-muted">Caption — Secondary info (12px)</p>
            <p className="text-sm text-text-secondary mt-4">Code: <code className="font-mono text-accent bg-accent-soft px-1.5 py-0.5 rounded text-sm">JetBrains Mono</code></p>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Spacing</h2>
          <div className="space-y-2">
            {[
              { token: "XS", px: 4 },
              { token: "S", px: 8 },
              { token: "M", px: 16 },
              { token: "L", px: 24 },
              { token: "XL", px: 32 },
              { token: "2XL", px: 48 },
            ].map((s) => (
              <div key={s.token} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-8">{s.token}</span>
                <div className="h-4 bg-accent rounded" style={{ width: s.px }} />
                <span className="text-xs text-text-muted">{s.px}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors shadow-sm">
              Primary
            </button>
            <button className="px-4 py-2 border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-surface transition-colors">
              Secondary
            </button>
            <button className="px-4 py-2 text-text-secondary text-sm font-medium rounded-lg hover:text-text-primary hover:bg-surface transition-colors">
              Ghost
            </button>
            <button className="px-4 py-2 bg-danger text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              Danger
            </button>
            <button disabled className="px-4 py-2 bg-surface text-text-muted text-sm font-medium rounded-lg cursor-not-allowed">
              Disabled
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-surface border border-border shadow-sm">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Default Card</h3>
              <p className="text-sm text-text-secondary">With subtle shadow and rounded corners.</p>
            </div>
            <div className="p-6 rounded-xl bg-elevated border border-border shadow-md">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Elevated Card</h3>
              <p className="text-sm text-text-secondary">For modals, drawers, and important surfaces.</p>
            </div>
          </div>
        </section>

        {/* Input */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Inputs</h2>
          <div className="max-w-sm space-y-3">
            <input
              type="text"
              placeholder="Default input"
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
            />
            <input
              type="text"
              placeholder="Disabled input"
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-text-muted text-sm cursor-not-allowed"
            />
          </div>
        </section>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-soft text-accent">Beginner</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">Intermediate</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">Advanced</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">Info</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-border text-text-muted">Default</span>
          </div>
        </section>

        {/* Learning Card (signature component) */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Learning Card</h2>
          <a href="#" className="block max-w-sm p-5 rounded-xl bg-surface border border-border shadow-sm hover:shadow-md hover:border-border-hover transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">Variables</h3>
                <p className="text-xs text-text-muted">18 min · Beginner · +30 XP</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <span>Mastery</span>
                <span className="ml-auto">72%</span>
              </div>
              <div className="h-2 rounded-full bg-surface overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: "72%" }} />
              </div>
            </div>
            <div className="flex items-center text-xs text-text-muted gap-2 mb-3">
              <span className="text-accent-soft text-accent">✓</span>
              <span>Prerequisites met</span>
            </div>
            <div className="text-sm font-medium text-accent group-hover:text-accent-hover transition-colors">
              Continue →
            </div>
          </a>
        </section>

        {/* Progress Bar */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Progress</h2>
          <div className="max-w-sm space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                <span>Module 1: Set Theory</span>
                <span>3/7</span>
              </div>
              <div className="h-2 rounded-full bg-surface overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tabs</h2>
          <div className="flex gap-1 p-1 bg-surface rounded-lg w-fit">
            {["Learn", "Practice", "Review"].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  i === 0 ? "bg-elevated text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* Skeleton */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Skeleton</h2>
          <div className="max-w-sm space-y-3 animate-pulse">
            <div className="h-4 rounded-lg bg-surface w-3/4" />
            <div className="h-4 rounded-lg bg-surface w-1/2" />
            <div className="h-24 rounded-lg bg-surface" />
          </div>
        </section>
      </div>
    </div>
  )
}
