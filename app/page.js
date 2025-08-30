import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      <Hero />
      <About />
      <Events />
      <Footer />
    </div>
  );
}
