import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { COLORS } from "./lib/colors.js";
import { JsonLd } from "./lib/seo.js";
import { NavBar } from "./components/NavBar.jsx";
import { Footer } from "./components/Footer.jsx";
import { CookieBanner } from "./components/CookieBanner.jsx";
import { Home } from "./pages/Home.jsx";
import { TestCatalogPage } from "./pages/TestCatalog.jsx";
import { TestDetail } from "./pages/TestDetail.jsx";
import { TakeTest } from "./pages/TakeTest.jsx";
import { Results } from "./pages/Results.jsx";
import { Consultations } from "./pages/Consultations.jsx";
import { Legal } from "./pages/Legal.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [location.pathname]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLORS.cream }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <JsonLd />

      <a href="#main-content" style={{
        position: "absolute", top: -60, left: 8, zIndex: 999,
        background: COLORS.terracotta, color: "white", padding: "10px 20px",
        borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
        textDecoration: "none", transition: "top 0.2s",
      }}
        onFocus={e => e.target.style.top = "8px"}
        onBlur={e => e.target.style.top = "-45px"}
      >Aller au contenu principal</a>

      {/* Global responsive + a11y styles */}
      <style>{`
        /* Responsive breakpoints */
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .how-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          .pro-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .detail-info-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
          .legal-content { padding: 24px 20px !important; }
        }
        @media (max-width: 600px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .hero-stats { flex-direction: column !important; gap: 16px !important; }
          .confirm-bar { flex-direction: column !important; text-align: center !important; }
          .cookie-actions { flex-direction: column !important; width: 100% !important; }
          .cookie-actions button { width: 100% !important; }
          .result-actions { grid-template-columns: 1fr !important; }
        }
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        /* Focus visible for keyboard navigation */
        *:focus-visible { outline: 3px solid ${COLORS.terracotta}; outline-offset: 2px; border-radius: 4px; }
        /* Smooth scroll preference */
        html { scroll-behavior: smooth; }
        /* Print styles */
        @media print {
          nav, footer, .cookie-banner { display: none !important; }
          main { padding-top: 0 !important; }
        }
      `}</style>

      <NavBar />

      <main role="main" id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<TestCatalogPage />} />
          <Route path="/tests/:slug" element={<TestDetail />} />
          <Route path="/tests/:slug/passer" element={<TakeTest />} />
          <Route path="/tests/:slug/resultats" element={<Results />} />
          <Route path="/consultations" element={<Consultations />} />
          <Route path="/legal/:section" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
