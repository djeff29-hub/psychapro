import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";
import { TestCatalog } from "./TestCatalog.jsx";

function Hero() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.blush} 40%, ${COLORS.sand} 100%)`,
      position: "relative", overflow: "hidden",
      padding: "70px clamp(1rem, 4vw, 3rem) 45px",
    }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute", top: "10%", right: "5%", width: 400, height: 400,
        borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.sageLight}22, transparent)`,
        filter: "blur(30px)", animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", left: "10%", width: 300, height: 300,
        borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.lavender}33, transparent)`,
        filter: "blur(37px)", animation: "float 10s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "15%", width: 200, height: 200,
        borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.terracotta}15, transparent)`,
        filter: "blur(30px)", animation: "float 6s ease-in-out infinite",
      }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center",
      }} className="hero-grid">
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(143,166,138,0.15)", borderRadius: 20,
            padding: "6px 16px", marginBottom: 19,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.sage }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.sageDark, fontWeight: 500 }}>
              Tests validés scientifiquement — 100% gratuits
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 700,
            color: COLORS.deepBrown, lineHeight: 1.15, marginBottom: 19,
            letterSpacing: "-1px",
          }}>
            Explorez les<br />
            <span style={{
              background: `linear-gradient(135deg, ${COLORS.terracotta}, ${COLORS.terracottaLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>profondeurs</span> de<br />
            votre personnalité
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.7,
            color: COLORS.warmGray, maxWidth: 480, marginBottom: 26,
          }}>
            Des tests psychologiques reconnus et entièrement gratuits, des résultats détaillés et personnalisés,
            et la possibilité de consulter un professionnel pour aller plus loin.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => navigate("/tests")} style={{
              background: COLORS.terracotta, color: "white", border: "none",
              borderRadius: 21, padding: "16px 36px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
              boxShadow: "0 4px 24px rgba(196,112,75,0.35)",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(196,112,75,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(196,112,75,0.35)"; }}
            >
              Découvrir les tests →
            </button>
            <button onClick={() => navigate("/consultations")} style={{
              background: COLORS.terracotta, color: "white",
              border: "none", borderRadius: 21,
              padding: "16px 36px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
              boxShadow: "0 4px 24px rgba(196,112,75,0.35)",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(196,112,75,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(196,112,75,0.35)"; }}
            >
              Consulter un pro →
            </button>
          </div>
        </div>

        {/* Right side - decorative cards */}
        <div style={{
          position: "relative", height: 420,
          opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(30px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        }} className="hero-right">
          {[
            { icon: "🧬", label: "Big Five", x: 20, y: 40, rot: -3, bg: COLORS.blush },
            { icon: "💡", label: "Intelligence Émotionnelle", x: 180, y: 10, rot: 2, bg: COLORS.lavender },
            { icon: "🌱", label: "Résilience", x: 60, y: 220, rot: -1, bg: COLORS.sageLight },
            { icon: "🔥", label: "Burnout", x: 240, y: 180, rot: 3, bg: COLORS.sand },
            { icon: "🤝", label: "Attachement", x: 140, y: 360, rot: -2, bg: COLORS.blush },
          ].map((card, i) => (
            <div key={i} style={{
              position: "absolute", left: card.x, top: card.y,
              background: "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)",
              borderRadius: 16, padding: "20px 24px",
              boxShadow: "0 4px 24px rgba(61,43,31,0.08)",
              transform: `rotate(${card.rot}deg)`,
              border: `1px solid ${card.bg}`,
              animation: `float ${6 + i}s ease-in-out infinite ${i * 0.5}s`,
              cursor: "default",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                color: COLORS.deepBrown,
              }}>{card.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </section>
  );
}

function HowItWorks() {
  return (
    <section style={{
      padding: "100px clamp(1rem, 4vw, 3rem)",
      background: COLORS.warmWhite,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 36, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 16,
        }}>Comment ça fonctionne</h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.warmGray,
          maxWidth: 500, margin: "0 auto 45px",
        }}>
          Un parcours simple et bienveillant, de la découverte de soi à l'accompagnement professionnel.
        </p>

        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {[
            { step: "01", icon: "📋", title: "Choisissez", desc: "Sélectionnez le test adapté à votre besoin — tous nos tests sont gratuits." },
            { step: "02", icon: "✍️", title: "Passez le test", desc: "Répondez aux questions dans un environnement calme et bienveillant." },
            { step: "03", icon: "📊", title: "Vos résultats", desc: "Consultez votre profil détaillé et téléchargez votre rapport PDF." },
            { step: "04", icon: "🎥", title: "Consultez", desc: "Prenez rendez-vous en ligne avec une professionnelle pour approfondir vos résultats." },
          ].map((item, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 20, padding: 25,
              boxShadow: "0 2px 16px rgba(61,43,31,0.05)",
              border: `1px solid ${COLORS.sand}40`,
              transition: "all 0.4s",
              cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(61,43,31,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(61,43,31,0.05)"; }}
            >
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 14, color: COLORS.terracotta, fontWeight: 700, marginBottom: 12,
              }}>{item.step}</div>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700,
                color: COLORS.deepBrown, marginBottom: 8,
              }}>{item.title}</h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: COLORS.warmGray, lineHeight: 1.6,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Home() {
  useSEO({
    title: "PsychaPro — Tests psychologiques gratuits et consultations en ligne",
    description: "Passez des tests psychologiques validés scientifiquement, obtenez vos résultats et consultez un professionnel en visio.",
  });
  return (
    <>
      <Hero />
      <HowItWorks />
      <TestCatalog />
    </>
  );
}
