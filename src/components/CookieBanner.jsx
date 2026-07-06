import { useState, useEffect } from "react";
import { COLORS } from "../lib/colors.js";

export function CookieBanner() {
  // Clé de stockage et durée de validité (6 mois recommandés par la CNIL)
  const STORAGE_KEY = "psychapro_cookie_consent";
  const VALIDITY_DAYS = 180;

  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Au montage : on regarde si un choix a déjà été enregistré et s'il est encore valide
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { setVisible(true); return; }
      const stored = JSON.parse(raw);
      const ageMs = Date.now() - stored.timestamp;
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      if (ageDays > VALIDITY_DAYS) {
        // Consentement expiré, on redemande
        localStorage.removeItem(STORAGE_KEY);
        setVisible(true);
      }
      // Sinon : choix valide, on n'affiche rien
    } catch (e) {
      // Si localStorage est indisponible (mode privé strict, etc.), on affiche le bandeau
      setVisible(true);
    }
  }, []);

  const saveChoice = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        choice,            // "refuse" | "necessary" | "all"
        timestamp: Date.now(),
        version: 1,
      }));
    } catch (e) {
      // Mode privé sans stockage : on masque quand même le bandeau pour la session
      console.warn("Impossible d'enregistrer le choix cookies (mode privé ?)");
    }
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Consentement cookies" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(61,43,31,0.97)", backdropFilter: "blur(12px)",
      padding: "20px clamp(1rem, 4vw, 3rem)", borderTop: `2px solid ${COLORS.terracotta}`,
      animation: "slideUp 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0 }}>
              🍪 PsychaPro utilise des cookies strictement nécessaires et, avec votre accord, des cookies d'analyse anonymisée. Vos données sont traitées conformément au RGPD.{" "}
              <button onClick={() => setShowDetails(!showDetails)} style={{ background: "none", border: "none", color: COLORS.terracottaLight, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: "underline", padding: 0 }}>En savoir plus</button>
            </p>
            {showDetails && (
              <div style={{ marginTop: 12, padding: 16, background: "rgba(255,255,255,0.06)", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                <strong style={{ color: "white" }}>Cookies nécessaires</strong> : session, préférences, sécurité CSRF (toujours actifs).<br />
                <strong style={{ color: "white" }}>Cookies analytiques</strong> : audience anonymisée (requièrent consentement).<br />
                Aucune donnée vendue ou partagée à des fins publicitaires.<br />
                <em style={{ color: "rgba(255,255,255,0.5)" }}>Votre choix est conservé localement dans votre navigateur pendant 6 mois.</em>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button onClick={() => saveChoice("refuse")} style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>Refuser</button>
            <button onClick={() => saveChoice("necessary")} style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>Nécessaires uniquement</button>
            <button onClick={() => saveChoice("all")} style={{ background: COLORS.terracotta, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>Tout accepter</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}
