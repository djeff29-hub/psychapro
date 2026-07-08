import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { TESTS } from "../data/tests.js";
import { computeResults } from "../lib/scoring.js";
import { useSEO } from "../lib/seo.js";

function sanitizeInput(value) {
  if (typeof value !== "string") return "";
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

export function Results() {
  const { slug } = useParams();
  const test = TESTS.find(t => t.id === slug);
  const navigate = useNavigate();

  useSEO({
    title: test ? `Résultats — ${test.name} — PsychaPro` : "Résultats introuvables — PsychaPro",
    description: "Profil psychologique détaillé et rapport PDF.",
    indexable: false,
  });

  const storedAnswers = test ? sessionStorage.getItem(`psychapro_answers_${test.id}`) : null;
  const testAnswers = storedAnswers ? JSON.parse(storedAnswers) : null;

  // --- every hook, called unconditionally, before any early return ---
  const [visible, setVisible] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  // Charger jsPDF dynamiquement depuis un CDN (une seule fois)
  useEffect(() => {
    if (window.jspdf) { setPdfReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    script.onload = () => setPdfReady(true);
    script.onerror = () => console.error("Impossible de charger jsPDF");
    document.head.appendChild(script);
  }, []);

  // Calcul des résultats à partir des réponses réelles (algorithme déterministe)
  // guarded internally: returns null when there's nothing to compute yet, instead of skipping the hook call
  const results = useMemo(() => (test && testAnswers) ? computeResults(test.id, testAnswers) : null, [test, testAnswers]);

  // --- only now, after every hook has been called, is it safe to branch on what to render ---
  if (!test) return <Navigate to="/tests" replace />;
  if (!testAnswers) return <Navigate to={`/tests/${test.id}/passer`} replace />;

  if (!results) {
    return (
      <section style={{ padding: "84px 2rem", textAlign: "center", minHeight: "100vh" }}>
        <p>Impossible de calculer les résultats. Veuillez refaire le test.</p>
        <button onClick={() => navigate("/tests")} style={{ marginTop: 16, padding: "10px 20px", background: COLORS.terracotta, color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>Retour aux tests</button>
      </section>
    );
  }

  const levelColor = { sage: COLORS.sage, softGold: COLORS.softGold, terracotta: COLORS.terracotta }[results.level?.color] || COLORS.terracotta;

  // ===== Génération PDF côté navigateur =====
  const exportPDF = () => {
    if (!pdfReady || !window.jspdf) {
      alert("La bibliothèque PDF n'est pas encore chargée. Veuillez patienter quelques secondes et réessayer.");
      return;
    }
    setPdfLoading(true);
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = 210;
      const margin = 18;
      const contentW = pageW - 2 * margin;
      let y = 20;

      const hexToRgb = hex => { const h = hex.replace("#", ""); return [parseInt(h.slice(0,2), 16), parseInt(h.slice(2,4), 16), parseInt(h.slice(4,6), 16)]; };
      const terra = hexToRgb(COLORS.terracotta);
      const sage = hexToRgb(COLORS.sage);
      const dark = hexToRgb(COLORS.deepBrown);
      const gray = hexToRgb(COLORS.warmGray);
      const sand = hexToRgb(COLORS.sand);

      const checkPage = (needed = 20) => {
        if (y + needed > 280) { doc.addPage(); y = 20; }
      };

      const addWrappedText = (text, fontSize, color, style = "normal", lineHeight = 5) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        doc.setFont("helvetica", style);
        const lines = doc.splitTextToSize(text, contentW);
        lines.forEach(line => {
          checkPage(lineHeight);
          doc.text(line, margin, y);
          y += lineHeight;
        });
      };

      // ===== EN-TÊTE =====
      doc.setFillColor(...terra);
      doc.rect(0, 0, pageW, 35, "F");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Ψ  PsychaPro", margin, 18);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Rapport de résultats personnalisés", margin, 26);

      y = 50;

      // ===== TITRE DU TEST =====
      addWrappedText(test.name, 18, dark, "bold", 7);
      y += 2;
      const now = new Date();
      const dateStr = now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      addWrappedText(`Test complété le ${dateStr}`, 10, gray, "normal", 5);
      y += 4;

      // ===== BADGE DE NIVEAU =====
      if (results.level) {
        const badgeColor = { sage, softGold: hexToRgb(COLORS.softGold), terracotta: terra }[results.level.color] || terra;
        doc.setFillColor(...badgeColor);
        const label = results.level.label;
        doc.setFontSize(10);
        const textWidth = doc.getTextWidth(label);
        doc.roundedRect(margin, y, textWidth + 10, 8, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(label, margin + 5, y + 5.5);
        y += 14;
      }

      // ===== AVERTISSEMENT CRITIQUE =====
      if (results.critical) {
        doc.setFillColor(255, 244, 240);
        doc.setDrawColor(...terra);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, y, contentW, 25, 3, 3, "FD");
        y += 7;
        doc.setFontSize(11);
        doc.setTextColor(...terra);
        doc.setFont("helvetica", "bold");
        doc.text("⚠  Attention particulière", margin + 4, y);
        y += 5;
        doc.setFontSize(9);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        const critLines = doc.splitTextToSize("Vos réponses suggèrent une souffrance qui mérite une attention immédiate. Appelez le 3114 (prévention du suicide, gratuit, 24h/24) ou consultez un professionnel rapidement.", contentW - 8);
        critLines.forEach(line => { doc.text(line, margin + 4, y); y += 4; });
        y += 6;
      }

      // ===== PROFIL DÉTAILLÉ =====
      checkPage(15);
      doc.setFontSize(14);
      doc.setTextColor(...dark);
      doc.setFont("helvetica", "bold");
      doc.text("Profil détaillé", margin, y);
      y += 2;
      doc.setDrawColor(...terra);
      doc.setLineWidth(0.8);
      doc.line(margin, y, margin + 20, y);
      y += 8;

      results.dimensions.forEach((dim, i) => {
        checkPage(28);
        // Nom + score
        doc.setFontSize(11);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "bold");
        doc.text(dim.name, margin, y);
        doc.setTextColor(...terra);
        doc.text(`${dim.score}%`, pageW - margin, y, { align: "right" });
        y += 3;

        // Barre de progression
        doc.setFillColor(...sand);
        doc.roundedRect(margin, y, contentW, 2.5, 1, 1, "F");
        const fillW = Math.max(1, (contentW * dim.score) / 100);
        doc.setFillColor(...terra);
        doc.roundedRect(margin, y, fillW, 2.5, 1, 1, "F");
        y += 6;

        // Description
        doc.setFontSize(9.5);
        doc.setTextColor(...gray);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(dim.desc, contentW);
        descLines.forEach(line => {
          checkPage(5);
          doc.text(line, margin, y);
          y += 4.5;
        });
        y += 4;
      });

      // ===== POINTS FORTS & AXES =====
      if ((results.strong?.length > 0 || results.weak?.length > 0) && !results.critical) {
        checkPage(40);
        y += 2;
        doc.setFontSize(14);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "bold");
        doc.text("Points forts et axes de développement", margin, y);
        y += 2;
        doc.setDrawColor(...terra);
        doc.line(margin, y, margin + 20, y);
        y += 8;

        if (results.strong?.length > 0) {
          checkPage(8);
          doc.setFontSize(11);
          doc.setTextColor(...sage);
          doc.setFont("helvetica", "bold");
          doc.text("✓ Vos points forts", margin, y);
          y += 6;
          doc.setFontSize(10);
          doc.setTextColor(...dark);
          doc.setFont("helvetica", "normal");
          results.strong.slice(0, 4).forEach(d => {
            checkPage(5);
            doc.text(`•  ${d.name}`, margin + 2, y);
            doc.setTextColor(...sage);
            doc.setFont("helvetica", "bold");
            doc.text(`${d.score}%`, pageW - margin, y, { align: "right" });
            doc.setTextColor(...dark);
            doc.setFont("helvetica", "normal");
            y += 5;
          });
          y += 4;
        }

        if (results.weak?.length > 0) {
          checkPage(8);
          doc.setFontSize(11);
          doc.setTextColor(...terra);
          doc.setFont("helvetica", "bold");
          doc.text("→ Axes de développement", margin, y);
          y += 6;
          doc.setFontSize(10);
          doc.setTextColor(...dark);
          doc.setFont("helvetica", "normal");
          results.weak.slice(0, 4).forEach(d => {
            checkPage(5);
            doc.text(`•  ${d.name}`, margin + 2, y);
            doc.setTextColor(...terra);
            doc.setFont("helvetica", "bold");
            doc.text(`${d.score}%`, pageW - margin, y, { align: "right" });
            doc.setTextColor(...dark);
            doc.setFont("helvetica", "normal");
            y += 5;
          });
          y += 4;
        }
      }

      // ===== SYNTHÈSE =====
      checkPage(20);
      y += 2;
      doc.setFontSize(14);
      doc.setTextColor(...dark);
      doc.setFont("helvetica", "bold");
      doc.text("Synthèse détaillée", margin, y);
      y += 2;
      doc.setDrawColor(...terra);
      doc.line(margin, y, margin + 20, y);
      y += 8;

      const paragraphs = results.summary.split("\n\n");
      paragraphs.forEach(p => {
        addWrappedText(p, 10, dark, "normal", 5);
        y += 3;
      });

      // ===== CONSEILS =====
      if (results.advice && results.advice.length > 0) {
        checkPage(20);
        y += 4;
        doc.setFontSize(14);
        doc.setTextColor(...dark);
        doc.setFont("helvetica", "bold");
        doc.text("Pistes pour aller plus loin", margin, y);
        y += 2;
        doc.setDrawColor(...terra);
        doc.line(margin, y, margin + 20, y);
        y += 8;

        results.advice.forEach(a => {
          checkPage(18);
          doc.setFillColor(250, 246, 241);
          doc.roundedRect(margin, y - 2, contentW, 16, 2, 2, "F");
          doc.setFontSize(11);
          doc.setTextColor(...terra);
          doc.setFont("helvetica", "bold");
          doc.text(a.title, margin + 4, y + 3);
          y += 7;
          doc.setFontSize(9);
          doc.setTextColor(...gray);
          doc.setFont("helvetica", "normal");
          const adviceLines = doc.splitTextToSize(a.text, contentW - 8);
          adviceLines.forEach(line => { doc.text(line, margin + 4, y); y += 4; });
          y += 4;
        });
      }

      // ===== PIED DE PAGE SUR TOUTES LES PAGES =====
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(...sand);
        doc.setLineWidth(0.2);
        doc.line(margin, 285, pageW - margin, 285);
        doc.setFontSize(8);
        doc.setTextColor(...gray);
        doc.setFont("helvetica", "normal");
        doc.text("PsychaPro — Ces résultats sont informatifs et ne constituent pas un diagnostic médical.", margin, 290);
        doc.text(`Page ${i}/${pageCount}`, pageW - margin, 290, { align: "right" });
        doc.text("monpsy.click", margin, 294);
        if (results.critical || test.id === "phq9" || test.id === "gad7") {
          doc.setTextColor(...terra);
          doc.setFont("helvetica", "bold");
          doc.text("En cas de détresse : 3114 (24h/24, gratuit)", pageW / 2, 294, { align: "center" });
        }
      }

      // Téléchargement
      const filename = `PsychaPro_${test.id}_${now.toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      setPdfLoading(false);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
      setPdfLoading(false);
    }
  };

  return (
    <section style={{
      padding: "84px clamp(1rem, 4vw, 3rem) 56px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})`,

    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: 26,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{results.critical ? "⚠️" : "🎉"}</div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 36, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 8,
          }}>Vos résultats</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.warmGray }}>
            {test.name} — Test complété
          </p>
          {results.level && (
            <div style={{
              display: "inline-block", marginTop: 16, padding: "8px 20px",
              background: `${levelColor}15`, color: levelColor,
              borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, fontWeight: 600,
            }}>
              {results.level.label}
            </div>
          )}
        </div>

        {/* Alerte critique (PHQ-9 item 9) */}
        {results.critical && (
          <div style={{
            background: "#FFF4F0", border: `2px solid ${COLORS.terracotta}`,
            borderRadius: 16, padding: 19, marginBottom: 19,
            display: "flex", alignItems: "flex-start", gap: 16,
          }}>
            <span style={{ fontSize: 28 }}>🆘</span>
            <div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.terracotta, marginBottom: 8 }}>
                Votre bien-être compte
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.deepBrown, lineHeight: 1.7, marginBottom: 12 }}>
                Vos réponses indiquent des pensées qui nécessitent une attention. Vous n'êtes pas seul(e), et de l'aide existe.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="tel:3114" style={{ background: COLORS.terracotta, color: "white", textDecoration: "none", padding: "10px 20px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                  📞 3114 (gratuit, 24h/24)
                </a>
                <button onClick={() => navigate("/consultations")} style={{ background: "white", color: COLORS.deepBrown, border: `1px solid ${COLORS.sand}`, padding: "10px 20px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Consulter un pro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Score bars */}
        <div style={{
          background: "white", borderRadius: 18, padding: "30px 33px",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)", marginBottom: 19,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 25,
          }}>Profil détaillé</h2>

          {results.dimensions.map((dim, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
                  color: COLORS.deepBrown,
                }}>{dim.name}</span>
                <span style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18, fontWeight: 700, color: COLORS.terracotta,
                }}>{dim.score}%</span>
              </div>
              <div style={{
                height: 10, borderRadius: 5, background: COLORS.offWhite,
                overflow: "hidden", marginBottom: 6,
              }}>
                <div style={{
                  height: "100%", borderRadius: 5,
                  background: `linear-gradient(90deg, ${COLORS.sage}, ${COLORS.terracotta})`,
                  width: visible ? `${dim.score}%` : "0%",
                  transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.15}s`,
                }} />
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                color: COLORS.warmGray, lineHeight: 1.5,
              }}>{dim.desc}</p>
            </div>
          ))}
        </div>

        {/* Strong points & development axes */}
        {(results.strong?.length > 0 || results.weak?.length > 0) && !results.critical && (
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 19,
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.8s ease 0.3s",
          }} className="result-actions">
            {results.strong?.length > 0 && (
              <div style={{
                background: "white", borderRadius: 20, padding: "28px 32px",
                boxShadow: "0 4px 24px rgba(61,43,31,0.06)",
                borderTop: `4px solid ${COLORS.sage}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 22 }}>✨</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.deepBrown, margin: 0 }}>
                    Vos points forts
                  </h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {results.strong.slice(0, 4).map((d, i) => (
                    <li key={i} style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      color: COLORS.deepBrown, padding: "10px 0",
                      borderBottom: i < results.strong.slice(0, 4).length - 1 ? `1px solid ${COLORS.sand}40` : "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span>{d.name}</span>
                      <span style={{ color: COLORS.sage, fontWeight: 700 }}>{d.score}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.weak?.length > 0 && (
              <div style={{
                background: "white", borderRadius: 20, padding: "28px 32px",
                boxShadow: "0 4px 24px rgba(61,43,31,0.06)",
                borderTop: `4px solid ${COLORS.terracotta}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 22 }}>🌱</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.deepBrown, margin: 0 }}>
                    Axes de développement
                  </h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {results.weak.slice(0, 4).map((d, i) => (
                    <li key={i} style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      color: COLORS.deepBrown, padding: "10px 0",
                      borderBottom: i < results.weak.slice(0, 4).length - 1 ? `1px solid ${COLORS.sand}40` : "none",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span>{d.name}</span>
                      <span style={{ color: COLORS.terracotta, fontWeight: 700 }}>{d.score}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Summary — multi-paragraph */}
        <div style={{
          background: "white", borderRadius: 18, padding: "30px 33px",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)", marginBottom: 19,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
          transition: "all 0.8s ease 0.4s",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 16,
          }}>Synthèse détaillée</h2>
          {results.summary.split("\n\n").map((paragraph, i) => (
            <p key={i} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              color: COLORS.deepBrown, lineHeight: 1.8, marginBottom: 16,
            }}>{paragraph}</p>
          ))}
          <div style={{
            marginTop: 16, padding: 14, background: COLORS.offWhite, borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.warmGray,
            lineHeight: 1.6,
          }}>
            ℹ️ <strong>Avertissement</strong> : ces résultats sont à visée informative et ne constituent pas un diagnostic médical. Ils ne remplacent pas l'avis d'un professionnel de santé.
          </div>
        </div>

        {/* Advice cards */}
        {results.advice && results.advice.length > 0 && (
          <div style={{
            background: "white", borderRadius: 18, padding: "30px 33px",
            boxShadow: "0 4px 32px rgba(61,43,31,0.08)", marginBottom: 19,
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.8s ease 0.5s",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 8,
            }}>Pistes pour aller plus loin</h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              color: COLORS.warmGray, marginBottom: 19, lineHeight: 1.6,
            }}>Quelques suggestions adaptées à votre profil — à prendre comme des invitations, non comme des prescriptions.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(154px, 1fr))", gap: 14 }}>
              {results.advice.map((a, i) => (
                <div key={i} style={{
                  background: COLORS.offWhite, borderRadius: 14, padding: "18px 20px",
                  border: `1px solid ${COLORS.sand}60`,
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                  <h4 style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
                    color: COLORS.deepBrown, marginBottom: 6,
                  }}>{a.title}</h4>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    color: COLORS.warmGray, lineHeight: 1.5, margin: 0,
                  }}>{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
          opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.6s",
        }} className="result-actions">
          <button onClick={exportPDF} disabled={pdfLoading}
            style={{
              background: "white", border: `2px solid ${COLORS.sage}`,
              borderRadius: 16, padding: "20px 24px",
              cursor: pdfLoading ? "wait" : "pointer",
              opacity: pdfLoading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { if (!pdfLoading) { e.currentTarget.style.background = `${COLORS.sage}10`; e.currentTarget.style.transform = "translateY(-2px)"; } }}
            onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: 24 }}>{pdfLoading ? "⏳" : "📄"}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: COLORS.deepBrown }}>
                {pdfLoading ? "Génération en cours..." : "Exporter en PDF"}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.warmGray }}>
                {pdfLoading ? "Veuillez patienter" : "Rapport complet à télécharger"}
              </div>
            </div>
          </button>

          <button onClick={() => navigate("/consultations")} style={{
            background: COLORS.terracotta, border: "none",
            borderRadius: 16, padding: "20px 24px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            transition: "all 0.3s",
            boxShadow: "0 4px 24px rgba(196,112,75,0.3)",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <span style={{ fontSize: 24 }}>🎥</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: "white" }}>
                Consulter un pro
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                Approfondir vos résultats avec une professionnelle
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
