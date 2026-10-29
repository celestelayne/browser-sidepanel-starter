import { useState } from 'react';

const CREATE_SLICE_COMMAND = '/create-slice <slice-name>';

const STEPS = [
  { title: 'Create a slice', description: 'Define the user job and specification' },
  { title: 'Implement', description: 'Build the approved slice' },
  { title: 'Review', description: 'Verify against requirements' },
];

type CopyState = 'idle' | 'copied' | 'failed';

const COPY_MESSAGES: Record<CopyState, string> = {
  idle: '',
  copied: 'Command copied. Paste it into Claude Code.',
  failed: 'Could not copy. Select the command under Next step instead.',
};

type AppProps = { version: string };

function App({ version }: AppProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(CREATE_SLICE_COMMAND);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <>
      <main className="panel-main">
        <section className="card welcome" aria-labelledby="welcome-title">
          <h1 id="welcome-title">Welcome</h1>
          <p>Your side panel is ready. Add a feature slice to get started.</p>
          <button type="button" className="button-primary" onClick={copyCommand}>
            Copy /create-slice command
          </button>
          <p className="copy-status" role="status">
            {COPY_MESSAGES[copyState]}
          </p>
        </section>

        <section aria-labelledby="quick-start-title">
          <h2 id="quick-start-title">Quick start</h2>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.title}>
                <div>
                  <strong>{step.title}</strong>
                  <span>{step.description}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="callout" aria-labelledby="next-step-title">
          <svg className="callout-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 21h6M10 17h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
          </svg>
          <div>
            <h2 id="next-step-title">Next step</h2>
            <p>
              Run <code>{CREATE_SLICE_COMMAND}</code> to plan your first feature.
            </p>
          </div>
        </section>
      </main>
      <footer className="panel-footer">
        <span>Browser Side Panel Starter</span>
        <span>v{version}</span>
      </footer>
    </>
  );
}

export default App;
