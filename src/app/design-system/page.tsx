export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">The Lantern</h1>
          <p className="text-text-secondary">LupaLearn Design System — Every concept you master lights the path ahead.</p>
        </div>

        {/* Colors */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Surface Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "bg", class: "bg-bg border border-border" },
              { name: "surface", class: "bg-surface border border-border" },
              { name: "elevated", class: "bg-elevated border border-border" },
              { name: "floating", class: "bg-floating border border-border" },
              { name: "accent", class: "bg-accent" },
              { name: "accent-soft", class: "bg-accent-soft border border-accent/20" },
              { name: "success", class: "bg-success" },
              { name: "danger", class: "bg-danger" },
              { name: "warning", class: "bg-warning" },
              { name: "border", class: "bg-border" },
              { name: "text-primary", class: "bg-text-primary" },
              { name: "text-muted", class: "bg-text-muted" },
            ].map((c) => (
              <div key={c.name} className={`h-16 rounded-xl ${c.class} flex items-end p-2`}>
                <span className="text-xs text-text-muted bg-elevated/80 px-1.5 py-0.5 rounded">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Course Lantern Colors */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Course Lantern Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Programming", hex: "#E8B84B" },
              { name: "Architecture", hex: "#C87D4B" },
              { name: "Algorithms", hex: "#5BA0D9" },
              { name: "Networking", hex: "#9B7FD4" },
              { name: "OS", hex: "#D4943A" },
              { name: "Databases", hex: "#45B7A0" },
              { name: "Security", hex: "#5BB88B" },
              { name: "AI", hex: "#C76BAE" },
            ].map((c) => (
              <div key={c.name} className="h-16 rounded-xl flex items-end p-2" style={{ backgroundColor: c.hex }}>
                <span className="text-xs bg-black/40 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Typography</h2>
          <div className="space-y-3">
            <p className="text-3xl font-bold text-text-primary tracking-tight">Hero — Page title (28px bold)</p>
            <p className="text-xl font-semibold text-text-primary tracking-tight">H1 — Section (20px semibold)</p>
            <p className="text-lg font-medium text-text-secondary">H2 — Group (18px medium)</p>
            <p className="text-[15px] text-text-primary">Body — Explanation (15px)</p>
            <p className="text-sm text-text-secondary">Supporting — Metadata (14px)</p>
            <p className="text-xs text-text-muted">Caption — Secondary (12px)</p>
            <p className="text-sm text-text-secondary mt-4">Code: <code className="font-mono text-accent bg-accent-soft px-1.5 py-0.5 rounded text-sm">JetBrains Mono</code></p>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Spacing</h2>
          <div className="space-y-2">
            {[{ label: "xs", w: 4 }, { label: "sm", w: 8 }, { label: "md", w: 16 }, { label: "lg", w: 24 }, { label: "xl", w: 32 }, { label: "2xl", w: 48 }].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-8">{s.label}</span>
                <div className="h-4 bg-accent rounded" style={{ width: s.w }} />
                <span className="text-xs text-text-muted">{s.w}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-accent text-text-inverse text-sm font-medium rounded-xl hover:brightness-110 transition-all shadow-sm animate-glow-pulse">Primary</button>
            <button className="px-5 py-2.5 border border-border text-text-secondary text-sm font-medium rounded-xl hover:bg-surface hover:border-border-hover transition-colors">Secondary</button>
            <button className="px-5 py-2.5 text-text-muted text-sm font-medium rounded-xl hover:text-text-secondary hover:bg-surface transition-colors">Ghost</button>
            <button className="px-5 py-2.5 bg-danger text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">Danger</button>
            <button disabled className="px-5 py-2.5 bg-surface text-text-muted text-sm font-medium rounded-xl cursor-not-allowed">Disabled</button>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-xl bg-surface border border-border shadow-sm">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Surface Card</h3>
              <p className="text-sm text-text-secondary">For most content surfaces.</p>
            </div>
            <div className="p-6 rounded-xl bg-elevated border border-border shadow-md">
              <h3 className="text-sm font-semibold text-text-primary mb-1">Elevated Card</h3>
              <p className="text-sm text-text-secondary">For modals and important surfaces.</p>
            </div>
          </div>
        </section>

        {/* Learning Card */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Learning Card</h2>
          <div className="max-w-sm p-5 rounded-xl bg-surface border border-border shadow-sm hover:border-accent/30 transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">Variables</h3>
                <p className="text-xs text-text-muted">18 min · Beginner · +30 XP</p>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <span>Mastery</span><span className="ml-auto">72%</span>
              </div>
              <div className="h-2 rounded-full bg-surface overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: "72%" }} />
              </div>
            </div>
            <div className="text-sm font-medium text-accent group-hover:brightness-110 transition-all">Continue →</div>
          </div>
        </section>

        {/* Input */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Input</h2>
          <div className="max-w-sm space-y-3">
            <input type="text" placeholder="What would you like to illuminate?"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
            <input type="text" placeholder="Disabled"
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-muted text-sm cursor-not-allowed" />
          </div>
        </section>

        {/* Badges */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-soft text-accent border border-accent/20">Beginner</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">Intermediate</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">Advanced</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface border border-border text-text-muted">Default</span>
          </div>
        </section>

        {/* Progress */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Progress</h2>
          <div className="max-w-sm">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Set Theory</span><span>3/7</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: "42%" }} />
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Tabs</h2>
          <div className="flex gap-1 p-1 bg-surface rounded-xl w-fit">
            {["Learn", "Practice", "Review"].map((tab, i) => (
              <button key={tab}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${i === 0 ? "bg-elevated text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"}`}>
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
