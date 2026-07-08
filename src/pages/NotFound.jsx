import { Link } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";

export function NotFound() {
  useSEO({ title: "Page introuvable — PsychaPro", description: "", indexable: false });
  return (
    <section style={{ padding: "140px 2rem 100px", textAlign: "center", minHeight: "60vh" }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: COLORS.deepBrown, marginBottom: 16 }}>
        Page introuvable
      </h1>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.warmGray, marginBottom: 24 }}>
        Cette page n'existe pas ou plus.
      </p>
      <Link to="/" style={{
        display: "inline-block", background: COLORS.terracotta, color: "white",
        borderRadius: 21, padding: "14px 30px", textDecoration: "none",
        fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
      }}>
        ← Retour à l'accueil
      </Link>
    </section>
  );
}
