import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ title, children }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const mainMargin = collapsed ? 'lg:ml-[80px]' : 'lg:ml-[286px]';

  return (
    <div className="app-shell">
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
      />
      <section className={`flex min-h-screen min-w-0 flex-1 flex-col bg-shell transition-[margin] duration-300 ${mainMargin}`}>
        <Topbar title={title} onMenu={() => setOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </section>
    </div>
  );
}
