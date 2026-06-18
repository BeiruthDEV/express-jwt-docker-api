export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        {eyebrow && <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-black tracking-tight text-ink md:text-[34px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm font-medium leading-6 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
