import { Link } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { Logo } from "./Logo.jsx";

export function Footer() {
  return (
    <footer role="contentinfo" style={{
      background: COLORS.deepBrown, padding: "45px clamp(1rem, 4vw, 3rem) 30px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 33,
      }} className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Logo size={36} />
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 20, fontWeight: 700, color: "white",
            }}>PsychaPro</span>
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 300,
          }}>
            Des tests psychologiques validés scientifiquement pour mieux vous connaître,
            accompagnés par des professionnels qualifiés.
          </p>
        </div>

        {[
          { title: "Tests", links: [
            { label: "Personnalité", to: "/tests" },
            { label: "Santé mentale", to: "/tests" },
            { label: "Bien-être", to: "/tests" },
            { label: "Relations", to: "/tests" },
          ]},
          { title: "Services", links: [
            { label: "Prendre rendez-vous", to: "/consultations" },
            { label: "Rapport PDF", to: "/tests" },
            { label: "Nos tests", to: "/tests" },
          ]},
          { title: "Légal", links: [
            { label: "Mentions légales", to: "/legal/mentions-legales" },
            { label: "Confidentialité (RGPD)", to: "/legal/confidentialite" },
            { label: "Conditions d'utilisation", to: "/legal/cgu" },
            { label: "Contact", to: "#" },
          ]},
        ].map((col, i) => (
          <div key={i}>
            <h4 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
              color: "white", marginBottom: 16, textTransform: "uppercase",
              letterSpacing: "1px",
            }}>{col.title}</h4>
            {col.links.map((link, j) => (
              <Link key={j} to={link.to} style={{
                display: "block",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: "rgba(255,255,255,0.45)", marginBottom: 10,
                cursor: "pointer", transition: "color 0.3s",
                textDecoration: "none",
              }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >{link.label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: 1200, margin: "30px auto 0", paddingTop: 19,
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex", justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>© 2026 PsychaPro — Tous droits réservés</span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          color: "rgba(255,255,255,0.3)",
        }}>Prototype — Maquette interactive</span>
      </div>
    </footer>
  );
}
