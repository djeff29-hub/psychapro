import { useState } from "react";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";

export function Consultations() {
  useSEO({
    title: "Consulter une professionnelle — PsychaPro",
    description: "Prenez rendez-vous avec une psychothérapeute ou une professionnelle de l'écoute.",
  });

  const [revealedPhones, setRevealedPhones] = useState({});
  const revealPhone = (id) => setRevealedPhones(prev => ({ ...prev, [id]: true }));

  const professionnelles = [
    {
      id: "astrid",
      nom: "Astrid Quémener",
      titre: "Psychanalyste & Psychothérapeute",
      photo: "/Astrid_QUEMENER.jpg",
      texte: "Une chose en premier lieu est de vous souhaiter « la bienvenue ». L'accueil pour moi est une « joie », qui que vous soyez et là où vous en êtes dans votre problématique.\n\nCette bienveillance dans un non-jugement porte en elle-même une sécurisation active qui permet de vivre un nouveau départ. Mon but en travaillant avec chacun est de fournir un environnement sûr et calme afin d'explorer en profondeur les questions actuelles ou anciennes.\n\nJe pratique la psychanalyse et la psychothérapie. En tant que psychanalyste diplômée de la Fédération Freudienne de psychanalyse, je travaillerai avec vous pour découvrir les processus inconscients et les blocages sources des maux présents.",
      rdvUrl: "https://rdv.itiaki.com/astrid-quemener",
      telephone: "06 58 73 76 17",
      siteWeb: "https://psycha.fr",
      accent: COLORS.terracotta,
    },
    {
      id: "clarisse",
      nom: "Clarisse des Longchamps",
      titre: "Psychanalyste",
      photo: "/Clarisse_des_Longchamps.jpg",
      texte: "Si la vie est en douleur qui ne passe pas, si des émotions ne sont saisis et réglés, et si l'angoisse aux mille questions restent sans réponse, soyez le bienvenu·e.\n\nJe suis là pour vous offrir un espace calme, sécurisant, afin de cheminer ensemble dans l'écoute attentive de votre histoire, dans le dire de ce qui est aujourd'hui, à votre rythme et à votre façon, sans jugement.\n\nEn confiance, nous prendrons le temps, avec douceur, de repérer ce qui se joue à travers les tensions et douleurs : les conflits intérieurs, les schémas qui se répètent, les contradictions... Dans une rencontre de ce qui fait sens et vérité pour vous.\n\nComprendre, savoir, c'est l'ouverture vers une meilleure façon de vivre.",
      rdvUrl: null,
      telephone: "07 66 98 83 51",
      accent: COLORS.sage,
    },
  ];

  return (
    <section style={{
      padding: "84px clamp(1rem, 4vw, 3rem) 56px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 31 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 32, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 10,
          }}>Consulter une professionnelle</h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.warmGray,
            maxWidth: 560, margin: "0 auto", lineHeight: 1.6,
          }}>
            Pour aller plus loin que les questionnaires, deux professionnelles vous accueillent dans un cadre bienveillant et confidentiel. Les consultations se déroulent <strong style={{ color: COLORS.deepBrown }}>en visioconférence ou par téléphone</strong>, selon votre préférence.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {professionnelles.map((p) => (
            <article key={p.id} style={{
              background: "white",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(61,43,31,0.07)",
              border: `1px solid ${COLORS.sand}40`,
              borderTop: `4px solid ${p.accent}`,
            }}>
              <div className="pro-card-grid" style={{
                display: "grid",
                gridTemplateColumns: "260px 1fr",
                gap: 0,
              }}>
                {/* Photo */}
                <div style={{
                  background: COLORS.offWhite,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  minHeight: 260,
                  overflow: "hidden",
                }}>
                  <img
                    src={p.photo}
                    alt={`Portrait de ${p.nom}`}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Contenu */}
                <div style={{ padding: "26px 28px" }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 24, fontWeight: 700, color: COLORS.deepBrown,
                    margin: 0, marginBottom: 4,
                  }}>{p.nom}</h2>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                    color: p.accent, marginBottom: 12, letterSpacing: "0.3px",
                  }}>{p.titre}</p>

                  {/* Formats de consultation */}
                  <div style={{
                    display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16,
                  }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: `${p.accent}12`, color: p.accent,
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                      padding: "4px 10px", borderRadius: 8,
                    }}>🎥 Visio</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      background: `${p.accent}12`, color: p.accent,
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                      padding: "4px 10px", borderRadius: 8,
                    }}>📞 Téléphone</span>
                  </div>

                  <div style={{ marginBottom: 19 }}>
                    {p.texte.split("\n\n").map((paragraph, i) => (
                      <p key={i} style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                        color: COLORS.deepBrown, lineHeight: 1.7, marginBottom: 10,
                      }}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Actions de contact */}
                  <div style={{
                    display: "flex", gap: 10, flexWrap: "wrap",
                    paddingTop: 16, borderTop: `1px solid ${COLORS.sand}50`,
                  }}>
                    {p.rdvUrl && (
                      <a
                        href={p.rdvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: p.accent,
                          color: "white",
                          border: "none",
                          borderRadius: 12,
                          padding: "11px 20px",
                          cursor: "pointer",
                          textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14, fontWeight: 600,
                          display: "inline-flex", alignItems: "center", gap: 8,
                          boxShadow: `0 4px 14px ${p.accent}40`,
                          transition: "all 0.25s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        📅 Prendre rendez-vous en ligne
                      </a>
                    )}
                    {revealedPhones[p.id] ? (
                      <a
                        href={`tel:${p.telephone.replace(/\s/g, "")}`}
                        style={{
                          background: "white",
                          color: COLORS.deepBrown,
                          border: `1.5px solid ${p.accent}`,
                          borderRadius: 12,
                          padding: "9.5px 20px",
                          cursor: "pointer",
                          textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14, fontWeight: 600,
                          display: "inline-flex", alignItems: "center", gap: 8,
                          transition: "all 0.25s",
                          animation: "fadeIn 0.3s ease",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${p.accent}10`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "white"; }}
                      >
                        📞 {p.telephone}
                      </a>
                    ) : (
                      <button
                        onClick={() => revealPhone(p.id)}
                        aria-label={`Afficher le numéro de téléphone de ${p.nom}`}
                        style={{
                          background: "white",
                          color: p.accent,
                          border: `1.5px dashed ${p.accent}`,
                          borderRadius: 12,
                          padding: "9.5px 20px",
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14, fontWeight: 600,
                          display: "inline-flex", alignItems: "center", gap: 8,
                          transition: "all 0.25s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${p.accent}10`; e.currentTarget.style.borderStyle = "solid"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderStyle = "dashed"; }}
                      >
                        📞 Afficher le numéro
                      </button>
                    )}
                    {p.siteWeb && (
                      <a
                        href={p.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "white",
                          color: p.accent,
                          border: `1.5px solid ${p.accent}40`,
                          borderRadius: 12,
                          padding: "9.5px 20px",
                          textDecoration: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 14, fontWeight: 600,
                          display: "inline-flex", alignItems: "center", gap: 8,
                          transition: "all 0.25s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${p.accent}10`; e.currentTarget.style.borderColor = p.accent; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = `${p.accent}40`; }}
                      >
                        🌐 {p.siteWeb.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Info en bas */}
        <div style={{
          marginTop: 25, padding: 16, background: `${COLORS.sage}10`,
          borderRadius: 12, border: `1px solid ${COLORS.sage}30`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            color: COLORS.deepBrown, lineHeight: 1.5, margin: 0,
          }}>
            Les consultations se déroulent en visioconférence ou par téléphone, dans un cadre strictement confidentiel. Les modalités, tarifs et conditions sont précisés directement avec chaque professionnelle lors de la prise de contact.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 768px) {
          .pro-card-grid {
            grid-template-columns: 1fr !important;
          }
          .pro-card-grid > div:first-child {
            min-height: 280px !important;
            max-height: 320px !important;
          }
        }
      `}</style>
    </section>
  );
}
