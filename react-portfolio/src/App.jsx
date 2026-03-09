export default function App() {
  return (
    <main className="app-shell">
      <header className="react-head">
        <h1>React Wrapper Enabled</h1>
        <p>Your current portfolio is now mounted inside a React app.</p>
      </header>

      <section className="site-frame-wrap">
        <iframe
          className="site-frame"
          src="/Kshetra.html"
          title="Kshetradnya Portfolio"
          loading="lazy"
        />
      </section>
    </main>
  );
}
