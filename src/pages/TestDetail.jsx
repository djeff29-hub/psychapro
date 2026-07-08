import { useParams, useNavigate, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS } from "../data/tests.js";
import { useSEO } from "../lib/seo.js";

export function TestDetail() {
  const { slug } = useParams();
  const test = TESTS.find(t => t.id === slug);
  const navigate = useNavigate();

  useSEO(test ? {
    title: `${test.name} — Test gratuit — PsychaPro`,
    description: test.description,
  } : { title: "Test introuvable — PsychaPro", description: "", indexable: false });

  if (!test) return <Navigate to="/tests" replace />;

  return (
    <section style={{
      padding: "84px clamp(1rem, 4vw, 3rem) 56px",
   background: COLORS.cream,
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => navigate("/tests")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.warmGray,
          marginBottom: 25, display: "flex", alignItems: "center", gap: 8,
        }}>
          ← Retour aux tests
        </button>

        <div style={{
          background: "white", borderRadius: 18, overflow: "hidden",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)",
          borderTop: `5px solid ${test.color}`,
        }}>
          <div style={{ padding: "30px 36px" }}>
            <span style={{
              background: `${test.color}18`, color: test.color,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
              padding: "4px 14px", borderRadius: 12,
            }}>{test.badge}</span>

            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, marginBottom: 16 }}>
              <span style={{ fontSize: 44, flexShrink: 0 }}>{test.icon}</span>
              <h1 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 30, fontWeight: 700, color: COLORS.deepBrown,
                margin: 0, lineHeight: 1.2,
              }}>{test.name}</h1>
            </div>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 16,
              color: COLORS.warmGray, lineHeight: 1.8, marginBottom: 25,
            }}>{test.description}</p>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
              marginBottom: 25,
            }}>
              {[
                { label: "Durée", value: test.duration, icon: "⏱" },
                { label: "Questions", value: test.questions, icon: "📝" },
                { label: "Rapport", value: "PDF inclus", icon: "📄" },
              ].map((info, i) => (
                <div key={i} style={{
                  background: COLORS.offWhite, borderRadius: 16, padding: 16,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{info.icon}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700,
                    color: COLORS.deepBrown,
                  }}>{info.value}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.warmGray,
                  }}>{info.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${COLORS.sage}10, ${COLORS.sageLight}20)`,
              borderRadius: 16, padding: 19, marginBottom: 25,
              border: `1px solid ${COLORS.sageLight}40`,
            }}>
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                color: COLORS.sageDark, marginBottom: 12,
              }}>✓ Ce que vous obtiendrez</h3>
              <ul style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.deepBrown,
                lineHeight: 2, paddingLeft: 16, margin: 0,
              }}>
                <li>Rapport détaillé de vos résultats avec scores par dimension</li>
                <li>Analyse personnalisée et pistes de réflexion</li>
                <li>Export PDF haute qualité à conserver</li>
                <li>Possibilité de consultation avec un professionnel</li>
              </ul>
            </div>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingTop: 19, borderTop: `1px solid ${COLORS.sand}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                  color: COLORS.sage, background: `${COLORS.sage}15`,
                  padding: "6px 16px", borderRadius: 12,
                }}>✓ Accès gratuit</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: COLORS.warmGray,
                }}>résultats immédiats</span>
              </div>
              <button onClick={() => navigate(`/tests/${test.id}/passer`)} style={{
                background: COLORS.terracotta, color: "white", border: "none",
                borderRadius: 21, padding: "16px 30px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
                boxShadow: "0 4px 24px rgba(196,112,75,0.35)",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}
              >
                Commencer le test →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
