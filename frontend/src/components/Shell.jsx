import Navbar from './Navbar';

export default function Shell({ eyebrow, title, description, actions, children }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-brand">{eyebrow}</p>}
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </header>
        {children}
      </main>
    </>
  );
}
