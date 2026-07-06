import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS } from "../data/tests.js";
import { QUESTION_BANKS, getAnswerOptions } from "../data/questionBanks.js";
import { useSEO } from "../lib/seo.js";

export function TakeTest() {
  const { slug } = useParams();
  const test = TESTS.find(t => t.id === slug);
  const navigate = useNavigate();

  useSEO({
    title: test ? `Passation — ${test.name} — PsychaPro` : "Test introuvable — PsychaPro",
    description: "Répondez aux questions en toute confidentialité.",
    indexable: false,
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  if (!test) return <Navigate to="/tests" replace />;

  const questionBank = QUESTION_BANKS[test.id] || [];
  const options = getAnswerOptions(test.id);
  const total = questionBank.length;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [current]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      sessionStorage.setItem(`psychapro_answers_${test.id}`, JSON.stringify(newAnswers));
      navigate(`/tests/${test.id}/resultats`);
    }
  };

  if (total === 0) {
    return (
      <section style={{ padding: "84px 2rem", textAlign: "center", minHeight: "100vh" }}>
        <p>Ce test n'est pas encore disponible.</p>
        <button onClick={() => navigate("/tests")} style={{ marginTop: 16, padding: "10px 20px", background: COLORS.terracotta, color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>Retour aux tests</button>
      </section>
    );
  }

  const q = questionBank[current];
  const progress = ((current + 1) / total) * 100;

  return (
    <section style={{
      padding: "84px clamp(1rem, 4vw, 3rem) 56px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.blush}30)`,

    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.warmGray }}>
              {test.name}
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: COLORS.deepBrown }}>
              {current + 1} / {total}
            </span>
          </div>
          <div style={{
            height: 6, borderRadius: 3, background: COLORS.sand,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: `linear-gradient(90deg, ${COLORS.terracotta}, ${COLORS.terracottaLight})`,
              width: `${progress}%`, transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Question card */}
        <div key={current} style={{
          background: "white", borderRadius: 18, padding: "28px 26px",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)",
          animation: "fadeUp 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 25 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${test.color}20, ${test.color}08)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17,
              fontWeight: 700, color: test.color,
            }}>
              {current + 1}
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 21, fontWeight: 700, color: COLORS.deepBrown,
              margin: 0, lineHeight: 1.35, flex: 1,
            }}>
              {q.q}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {options.map((opt, i) => (
              <button key={i} onClick={() => setSelected(i)} style={{
                background: selected === i ? `${COLORS.terracotta}10` : COLORS.offWhite,
                border: `2px solid ${selected === i ? COLORS.terracotta : "transparent"}`,
                borderRadius: 14, padding: "16px 20px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
                color: selected === i ? COLORS.terracotta : COLORS.deepBrown,
                textAlign: "left", transition: "all 0.25s",
              }}
                onMouseEnter={e => { if (selected !== i) e.target.style.background = `${COLORS.sand}40`; }}
                onMouseLeave={e => { if (selected !== i) e.target.style.background = COLORS.offWhite; }}
              >
                <span style={{
                  display: "inline-block", width: 24, height: 24, borderRadius: "50%",
                  border: `2px solid ${selected === i ? COLORS.terracotta : COLORS.sand}`,
                  background: selected === i ? COLORS.terracotta : "white",
                  marginRight: 12, verticalAlign: "middle",
                  transition: "all 0.25s", position: "relative",
                }}>
                  {selected === i && (
                    <span style={{
                      position: "absolute", top: "50%", left: "50%",
                      transform: "translate(-50%, -50%)", color: "white", fontSize: 12,
                    }}>✓</span>
                  )}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => { if (current > 0) { setCurrent(current - 1); setSelected(answers[current - 1] ?? null); } }}
              disabled={current === 0}
              style={{
                background: "none", border: `1px solid ${COLORS.sand}`,
                borderRadius: 12, padding: "12px 24px", cursor: current === 0 ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                color: current === 0 ? COLORS.sand : COLORS.warmGray,
              }}>
              ← Précédent
            </button>
            <button onClick={handleNext} disabled={selected === null} style={{
              background: selected !== null ? COLORS.terracotta : COLORS.sand,
              color: "white", border: "none", borderRadius: 12,
              padding: "12px 32px", cursor: selected !== null ? "pointer" : "default",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
              transition: "all 0.3s",
            }}>
              {current < total - 1 ? "Suivant →" : "Voir mes résultats →"}
            </button>
          </div>
        </div>

        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </section>
  );
}
