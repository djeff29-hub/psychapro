import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS, CATEGORIES } from "../data/tests.js";
import { useSEO } from "../lib/seo.js";

export function TestCatalog() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const filtered = category === "all" ? TESTS : TESTS.filter(t => t.category === category);

  return (
    <section style={{
      padding: "84px clamp(1rem, 4vw, 3rem) 56px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})`,

    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 31 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 40, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 12,
          }}>Nos tests psychologiques</h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.warmGray,
            maxWidth: 520, margin: "0 auto",
          }}>
            Chaque test est scientifiquement validé, gratuit, et accompagné d'un rapport personnalisé détaillé.
          </p>
        </div>

        {/* Category filters */}
        <div style={{
          display: "flex", gap: 8, justifyContent: "center", marginBottom: 31,
          flexWrap: "wrap",
        }}>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button key={key} onClick={() => setCategory(key)} style={{
              background: category === key ? COLORS.terracotta : "white",
              color: category === key ? "white" : COLORS.deepBrown,
              border: `1px solid ${category === key ? COLORS.terracotta : COLORS.sand}`,
              borderRadius: 20, padding: "8px 20px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              transition: "all 0.3s",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Test cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340, 1fr))",
          gap: 20,
        }}>
          {filtered.map((test, i) => (
            <div key={test.id} style={{
              background: "white", borderRadius: 20, overflow: "hidden",
              boxShadow: "0 2px 16px rgba(61,43,31,0.06)",
              border: `1px solid ${COLORS.sand}40`,
              transition: "all 0.4s", cursor: "pointer",
              animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
            }}
              onClick={() => navigate(`/tests/${test.id}`)}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(61,43,31,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(61,43,31,0.06)"; }}
            >
              <div style={{
                height: 6,
                background: `linear-gradient(90deg, ${test.color}, ${test.color}88)`,
              }} />
              <div style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{test.icon}</span>
                    <h3 style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700,
                      color: COLORS.deepBrown, margin: 0, lineHeight: 1.25,
                    }}>{test.name}</h3>
                  </div>
                  <span style={{
                    background: `${test.color}18`, color: test.color,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "4px 10px", borderRadius: 12, letterSpacing: "0.3px",
                    flexShrink: 0, marginLeft: 8,
                  }}>{test.badge}</span>
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: COLORS.warmGray, lineHeight: 1.6, marginBottom: 16,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>{test.description}</p>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  paddingTop: 16, borderTop: `1px solid ${COLORS.sand}40`,
                }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.warmGray }}>
                      ⏱ {test.duration}
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.warmGray }}>
                      📝 {test.questions} questions
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 700, color: COLORS.sage,
                    background: `${COLORS.sage}15`, padding: "4px 12px", borderRadius: 10,
                  }}>Gratuit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export function TestCatalogPage() {
  useSEO({
    title: "Nos tests psychologiques gratuits — PsychaPro",
    description: "Personnalité, 16 profils, compétences émotionnelles, dépistage dépression et anxiété, épuisement professionnel, estime de soi… Tests gratuits.",
  });
  return <TestCatalog />;
}
