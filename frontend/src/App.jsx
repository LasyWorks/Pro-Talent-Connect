import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { HeroSection, StatsSection, CTASection } from './components/HomeComponents'
import FeaturedPlayers from './components/FeaturedPlayers'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import About from './pages/About'
import Players from './pages/Players'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    // Simple hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      
      // Check if it's a blog detail page (e.g., blog/123)
      if (hash.startsWith('blog/')) {
        const id = hash.split('/')[1];
        setCurrentPage('blog-detail');
        setBlogId(id);
      } else {
        setCurrentPage(hash || 'home');
        setBlogId(null);
      }
    };

    handleHashChange(); // Set initial page
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'blog':
        return <BlogPage />;
      case 'blog-detail':
        return <BlogDetailPage blogId={blogId} />;
      case 'about':
        return <About />;
      case 'players':
        return <Players />;
      case 'services':
        return <Services />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login />;
      case 'admin':
        return <AdminDashboard />;
      case 'home':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <main>
              <HeroSection />
              <StatsSection />
              <FeaturedPlayers />
              <CTASection />
            </main>
          </div>
        );
    }
  };

  // Don't show NavBar and Footer for login and admin pages
  const showLayout = currentPage !== 'login' && currentPage !== 'admin';

  return (
    <div className="min-h-screen">
      {showLayout && <NavBar currentPage={currentPage} />}
      {renderPage()}
      {showLayout && <Footer />}
    </div>
  )
}

export default App
