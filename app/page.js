import Header from './components/Header';
import ProjectsFeed from './components/ProjectsFeed';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <ProjectsFeed />
    </div>
  );
}
