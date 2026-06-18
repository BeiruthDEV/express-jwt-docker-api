import Layout from './Layout';
import PageHeader from './PageHeader';

export default function Shell({ eyebrow, title, description, actions, children }) {
  return (
    <Layout title={title}>
      <main className="w-full px-5 py-5 lg:px-8 lg:py-6 2xl:px-9">
        <PageHeader eyebrow={eyebrow} title={title} description={description} actions={actions} />
        {children}
      </main>
    </Layout>
  );
}
