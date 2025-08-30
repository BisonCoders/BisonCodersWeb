import Events from './components/Events';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';


export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <Hero />
      <Events/>
      <Footer />
    </div>
  );
}
