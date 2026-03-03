import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import {
  HeroSection,
  StatsSection,
  FeaturedPlayers,
} from "./components/HomeComponents";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import About from "./pages/About";
import Players from "./pages/Players";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Pagenotfound from "./components/Pagenotfound";
import "./App.css";

function App() {
  const location = useLocation();

  // Don't show NavBar and Footer for login and admin pages
  const showLayout =
    !location.pathname.includes("login") &&
    !location.pathname.includes("admin");

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      {showLayout && <NavBar />}
      <div className="md:pb-0 pb-16">
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950">
                <main>
                  <HeroSection />
                  <FeaturedPlayers />
                  <StatsSection />
                </main>
              </div>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/players" element={<Players />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
        {showLayout && <Footer />}
      </div>
    </div>
  );
}

export default App;
