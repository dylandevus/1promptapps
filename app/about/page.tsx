import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'What 1PromptApps is and what counts as one prompt.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>← 1PromptApps</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--ink)' }}>About</h1>
        <p className="text-base mb-10" style={{ color: 'var(--muted)' }}>
          1PromptApps is a curated gallery of static webapps built from a single AI prompt.
          Each entry shows the original prompt, a live demo, screenshots, the model and tool used,
          generation time, and honest notes on what worked and what needed editing.
        </p>

        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink)' }}>What counts as one prompt?</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          One prompt = the single message you sent to the AI that generated the app.
          Follow-up prompts for features are allowed — declare them via <code className="prompt-block text-xs px-1 py-0.5 rounded" style={{ background: '#F0F0EE' }}>followUpCount</code>.
          Prompts to fix errors after generation are tracked separately via <code className="prompt-block text-xs px-1 py-0.5 rounded" style={{ background: '#F0F0EE' }}>errorFixes</code>.
        </p>
        <p className="text-sm mb-10" style={{ color: 'var(--muted)' }}>
          We never claim an app was "verified one prompt." We show the prompt, the result, and the honest numbers — visitors decide what it means.
        </p>

        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--ink)' }}>Submit an app</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
          Open a pull request to{' '}
          <a href="https://github.com/dylandevus/1promptapps" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--accent)' }}>
            dylandevus/1promptapps
          </a>{' '}
          adding your app folder. See <code className="prompt-block text-xs px-1 py-0.5 rounded" style={{ background: '#F0F0EE' }}>CONTRIBUTING.md</code> for the full flow.
        </p>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <Link href="/" className="text-sm underline" style={{ color: 'var(--accent)' }}>← Back to gallery</Link>
        </div>
      </main>
    </div>
  )
}
