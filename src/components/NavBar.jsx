import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { Logo } from "./Logo.jsx";

export function NavBar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { to: "/", label: "Accueil" },
    { to: "/tests", label: "Nos tests" },
  ];

  return (
    <nav role="navigation" aria-label="Navigation principale" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled || mobileOpen ? "rgba(255,248,240,0.97)" : "transparent",
      backdropFilter: scrolled || mobileOpen ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.sand}` : "none",
      transition: "all 0.4s ease",
      padding: "0 clamp(1rem, 4vw, 3rem)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 72,
      }}>
        <Link to="/" style={{ textDecoration: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={40} />
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, letterSpacing: "-0.5px",
          }}>PsychaPro</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display: "flex", gap: 27, alignItems: "center" }}>
          {navItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} aria-current={location.pathname === item.to ? "page" : undefined} style={{
              background: "none", border: "none", cursor: "pointer", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              color: location.pathname === item.to ? COLORS.terracotta : COLORS.warmGray,
              borderBottom: location.pathname === item.to ? `2px solid ${COLORS.terracotta}` : "2px solid transparent",
              paddingBottom: 4, transition: "all 0.3s",
            }}>
              {item.label}
            </Link>
          ))}
          <Link to="/tests" onClick={() => setMobileOpen(false)} style={{
            background: COLORS.terracotta, color: "white", border: "none",
            borderRadius: 18, padding: "10px 24px", cursor: "pointer", textDecoration: "none", display: "inline-block",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            transition: "all 0.3s", boxShadow: "0 2px 12px rgba(196,112,75,0.3)",
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >
            Commencer un test
          </Link>
          <Link to="/consultations" onClick={() => setMobileOpen(false)} style={{
            background: "white", color: COLORS.terracotta, border: `1.5px solid ${COLORS.terracotta}`,
            borderRadius: 18, padding: "9px 22px", cursor: "pointer", textDecoration: "none", display: "inline-block",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            transition: "all 0.3s",
          }}
            onMouseEnter={e => { e.target.style.background = `${COLORS.terracotta}10`; }}
            onMouseLeave={e => { e.target.style.background = "white"; }}
          >
            Prendre RDV
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          flexDirection: "column", gap: 5, padding: 8,
        }}>
          <span style={{ width: 24, height: 2, background: COLORS.deepBrown, borderRadius: 1, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ width: 24, height: 2, background: COLORS.deepBrown, borderRadius: 1, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: COLORS.deepBrown, borderRadius: 1, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div style={{
          padding: "8px 0 20px", borderTop: `1px solid ${COLORS.sand}`,
          animation: "fadeUp 0.3s ease",
        }}>
          {navItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} aria-current={location.pathname === item.to ? "page" : undefined} style={{
              display: "block", width: "100%", textAlign: "left", textDecoration: "none",
              background: location.pathname === item.to ? `${COLORS.terracotta}08` : "none",
              border: "none", cursor: "pointer", padding: "14px 16px", borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500,
              color: location.pathname === item.to ? COLORS.terracotta : COLORS.deepBrown,
            }}>
              {item.label}
            </Link>
          ))}
          <Link to="/tests" onClick={() => setMobileOpen(false)} style={{
            width: "100%", marginTop: 8, textDecoration: "none", display: "inline-block",
            background: COLORS.terracotta, color: "white", border: "none",
            borderRadius: 14, padding: "14px 24px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
          }}>
            Commencer un test
          </Link>
          <Link to="/consultations" onClick={() => setMobileOpen(false)} style={{
            display: "block", width: "100%", marginTop: 8, textAlign: "center", textDecoration: "none",
            background: "white", color: COLORS.terracotta, border: `1.5px solid ${COLORS.terracotta}`,
            borderRadius: 14, padding: "13px 24px", cursor: "pointer", boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
          }}>
            Prendre RDV →
          </Link>
        </div>
      )}
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </nav>
  );
}
