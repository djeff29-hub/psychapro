import { useNavigate, useParams, Navigate } from "react-router-dom";
import { COLORS } from "../lib/colors.js";
import { useSEO } from "../lib/seo.js";

const SECTION_TO_TAB = { "mentions-legales": "mentions", "confidentialite": "rgpd", "cgu": "cgv" };
const TAB_TO_SECTION = { mentions: "mentions-legales", rgpd: "confidentialite", cgv: "cgu" };
const SEO_BY_SECTION = {
  "mentions-legales": { title: "Mentions légales — PsychaPro", description: "Informations légales du site monpsy.click." },
  "confidentialite": { title: "Confidentialité (RGPD) — PsychaPro", description: "Politique de confidentialité et RGPD de PsychaPro." },
  "cgu": { title: "Conditions Générales d'Utilisation — PsychaPro", description: "Conditions d'utilisation du site monpsy.click." },
};

export function Legal() {
  const { section } = useParams();
  const navigate = useNavigate();
  const tab = SECTION_TO_TAB[section];

  useSEO(SEO_BY_SECTION[section] || { title: "Mentions légales — PsychaPro", description: "", indexable: false });

  if (!tab) return <Navigate to="/legal/mentions-legales" replace />;

  const P = ({ children, small }) => <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: small ? 12 : 14, color: small ? COLORS.warmGray : COLORS.deepBrown, lineHeight: 1.8, marginBottom: 12 }}>{children}</p>;
  const H3 = ({ children }) => <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.deepBrown, marginTop: 22, marginBottom: 10 }}>{children}</h3>;

  return (
  <section style={{ padding: "84px clamp(1rem, 4vw, 3rem) 56px", background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})` }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => navigate("/")} aria-label="Retour à l'accueil" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.warmGray, marginBottom: 19 }}>← Retour à l'accueil</button>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 19 }}>Informations légales</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 25, flexWrap: "wrap" }}>
          {[{ key: "mentions", label: "Mentions légales" }, { key: "rgpd", label: "Politique de confidentialité" }, { key: "cgv", label: "Conditions d'utilisation" }].map(t => (
            <button key={t.key} onClick={() => navigate(`/legal/${TAB_TO_SECTION[t.key]}`)} style={{
              background: tab === t.key ? COLORS.terracotta : "white", color: tab === t.key ? "white" : COLORS.deepBrown,
              border: `1px solid ${tab === t.key ? COLORS.terracotta : COLORS.sand}`, borderRadius: 12, padding: "10px 20px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: "30px 33px", boxShadow: "0 2px 16px rgba(61,43,31,0.06)" }} className="legal-content">

          {tab === "mentions" && (<article>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 16 }}>Mentions légales</h2>
            <P small>Conformément à la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (LCEN), articles 6-III et 19.</P>

            <H3>1. Éditeur du site</H3>
            <P>
              Le site <strong>monpsy.click</strong> est édité par :<br />
              <strong>Astrid Quémener</strong> — Entrepreneure individuelle<br />
              Adresse professionnelle : [à compléter]<br />
              SIRET : [numéro à compléter après immatriculation]<br />
              Directrice de la publication : Astrid Quémener<br />
              Contact : psychafrance@outlook.fr
            </P>

            <H3>2. Hébergeur du site</H3>
            <P>
              [Nom de l'hébergeur à compléter une fois choisi]<br />
              Adresse : [à compléter]<br />
              Contact : [à compléter]
            </P>
            <P small>Hébergeurs conformes RGPD fréquemment utilisés en France : OVHcloud (Roubaix), O2Switch (Clermont-Ferrand), Infomaniak (Genève), Scaleway (Paris).</P>

            <H3>3. Nature du service</H3>
            <P>
              PsychaPro est un site d'information et de sensibilisation proposant gratuitement des questionnaires psychologiques inspirés de modèles scientifiques reconnus. Les résultats sont fournis à titre purement indicatif dans une démarche de développement personnel et de mieux-être.
            </P>
            <P>
              <strong>Ces questionnaires ne constituent pas un acte médical, ni un diagnostic, ni un traitement psychothérapeutique.</strong> Ils ne se substituent en aucun cas à la consultation d'un professionnel de santé qualifié.
            </P>

            <H3>4. Prise de rendez-vous</H3>
            <P>
              Le bouton « Prendre RDV » redirige vers un service tiers de prise de rendez-vous en ligne (<a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.terracotta }}>rdv.itiaki.com/astrid-quemener</a>). La réservation, le paiement éventuel, la réalisation de la consultation et toutes les obligations qui en découlent relèvent exclusivement de la relation directe entre vous et Astrid Quémener en tant que professionnelle, régie par les conditions de cette plateforme tierce et le cadre légal applicable à son activité.
            </P>

            <H3>5. Propriété intellectuelle</H3>
            <P>
              L'ensemble des éléments du site (textes, graphismes, logo, charte visuelle, code, questionnaires reformulés, algorithmes de scoring) est la propriété exclusive d'Astrid Quémener. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </P>
            <P>
              Les questionnaires proposés sont des adaptations originales s'inspirant de modèles scientifiques relevant du domaine public ou d'approches théoriques librement accessibles. Les dénominations commerciales protégées (ex. MBTI®, Big Five®, MBI®, EQ-i®, Rosenberg Self-Esteem Scale®) ne sont pas utilisées sur ce site.
            </P>

            <H3>6. Responsabilité</H3>
            <P>
              L'éditrice s'efforce de fournir des informations fiables, mais ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées. L'utilisateur est seul responsable de l'usage qu'il fait des informations et résultats obtenus.
            </P>
            <P>
              <strong>En cas de détresse psychologique ou d'idées suicidaires</strong>, appelez immédiatement le <strong>3114</strong> (numéro national de prévention du suicide, gratuit, confidentiel, 24h/24) ou le <strong>15</strong> (SAMU) en cas d'urgence vitale.
            </P>

            <H3>7. Liens hypertextes</H3>
            <P>
              Le site contient un lien sortant vers la plateforme tierce Itiaki. L'éditrice n'exerce aucun contrôle sur les contenus et pratiques de ce service tiers et décline toute responsabilité à cet égard.
            </P>

            <H3>8. Droit applicable</H3>
            <P>Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.</P>
          </article>)}

          {tab === "rgpd" && (<article>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 16 }}>Politique de confidentialité</h2>
            <P small>Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la Loi Informatique et Libertés du 6 janvier 1978 modifiée.</P>

            <H3>1. Responsable du traitement</H3>
            <P>
              Le responsable du traitement des données est <strong>Astrid Quémener</strong>, entrepreneure individuelle, éditrice du site monpsy.click.<br />
              Pour toute question relative à vos données : <strong>psychafrance@outlook.fr</strong>
            </P>

            <H3>2. Principe fondateur : minimisation des données</H3>
            <P>
              PsychaPro est conçu pour respecter au maximum votre vie privée. <strong>Le site ne dispose d'aucune base de données.</strong> Vous n'avez pas besoin de créer de compte ni de fournir d'informations personnelles pour utiliser les questionnaires.
            </P>

            <H3>3. Données collectées</H3>
            <P>
              <strong>Réponses aux questionnaires</strong> : vos réponses et résultats sont traités <u>exclusivement dans votre navigateur</u>, en mémoire temporaire, le temps de votre session. Ils ne sont ni transmis à un serveur, ni stockés, ni partagés. Dès que vous fermez l'onglet, toutes ces informations disparaissent.
            </P>
            <P>
              <strong>Données techniques de navigation</strong> : à des fins de mesure d'audience strictement anonymisée et de sécurité, le site peut collecter de façon agrégée l'adresse IP tronquée, le type de navigateur et la langue. Aucune donnée nominative n'est associée.
            </P>
            <P>
              <strong>Cookies</strong> : voir section 8 ci-dessous.
            </P>
            <P>
              <strong>Aucune donnée collectée par PsychaPro</strong> lors du clic sur « Prendre RDV ». Vous quittez alors ce site pour la plateforme tierce Itiaki, qui applique sa propre politique de confidentialité (à consulter sur rdv.itiaki.com).
            </P>

            <H3>4. Finalités et bases légales</H3>
            <P>
              <strong>Mesure d'audience anonymisée</strong> — base légale : consentement (bandeau cookies).<br />
              <strong>Sécurité du site</strong> — base légale : intérêt légitime.<br />
              Aucune donnée n'est utilisée à des fins de prospection, de profilage ou de publicité ciblée.
            </P>

            <H3>5. Durée de conservation</H3>
            <P>
              Les réponses aux tests ne sont conservées que le temps de votre session de navigation (mémoire vive du navigateur).<br />
              Les données anonymisées de mesure d'audience : 13 mois maximum.<br />
              Les cookies : durée de vie maximale de 13 mois conformément aux recommandations de la CNIL.
            </P>

            <H3>6. Destinataires des données</H3>
            <P>
              Aucune donnée personnelle n'est partagée avec des tiers. Les données techniques agrégées peuvent transiter par :<br />
              — l'hébergeur du site (sous-traitant technique, lié par contrat conforme RGPD) ;<br />
              — l'éventuel outil de mesure d'audience respectueux de la vie privée (Plausible, Matomo ou équivalent).<br />
              Aucune donnée n'est vendue, louée ni transmise à des fins publicitaires.
            </P>

            <H3>7. Vos droits</H3>
            <P>
              Même si nous collectons très peu de données, vous disposez en vertu du RGPD des droits suivants : accès, rectification, effacement, limitation, opposition, portabilité et retrait du consentement.
            </P>
            <P>
              Pour exercer ces droits, écrivez à <strong>psychafrance@outlook.fr</strong>. Une réponse vous sera apportée dans un délai maximum de 30 jours.
            </P>
            <P>
              En cas de désaccord, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> : 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.terracotta }}>www.cnil.fr</a>
            </P>

            <H3>8. Cookies</H3>
            <P>
              <strong>Cookies strictement nécessaires</strong> (exemptés de consentement) : ils assurent le bon fonctionnement du site (préférences d'affichage, sécurité).<br />
              <strong>Cookies de mesure d'audience anonymisée</strong> (nécessitent votre consentement) : ils permettent de comprendre l'utilisation générale du site sans jamais vous identifier. Vous pouvez accepter, refuser ou personnaliser vos choix via le bandeau qui s'affiche à votre première visite.
            </P>
            <P>
              Aucun cookie publicitaire, aucun cookie de traçage tiers n'est déposé par PsychaPro.
            </P>

            <H3>9. Sécurité</H3>
            <P>
              Le site est accessible exclusivement en HTTPS (chiffrement TLS). L'hébergeur retenu respectera les obligations techniques et organisationnelles du RGPD. Aucune donnée sensible n'étant stockée côté serveur, le risque de fuite est réduit à sa plus simple expression.
            </P>

            <H3>10. Données de santé</H3>
            <P>
              Bien que les résultats des questionnaires puissent être considérés comme des informations à caractère sensible, <strong>aucune donnée de santé n'est enregistrée par le site</strong>. Si vous souhaitez conserver vos résultats, utilisez la fonction d'export PDF : le fichier est généré dans votre navigateur et reste sous votre seul contrôle.
            </P>

            <H3>11. Modifications</H3>
            <P>
              La présente politique peut être mise à jour. La date de dernière modification est indiquée ci-dessous. En cas de modification substantielle, les utilisateurs en seront informés par un bandeau sur la page d'accueil.
            </P>
            <P small>Dernière mise à jour : [date à compléter lors de la mise en ligne].</P>
          </article>)}

          {tab === "cgv" && (<article>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 16 }}>Conditions Générales d'Utilisation</h2>
            <P small>En vigueur à compter du [date à compléter]. Le site monpsy.click ne vendant aucun bien ni service payant, il n'y a pas de CGV (Conditions Générales de Vente) à proprement parler — les présentes CGU régissent l'accès et l'usage gratuit du site.</P>

            <H3>1. Objet</H3>
            <P>
              Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès au site <strong>monpsy.click</strong> et l'utilisation des questionnaires psychologiques gratuits qui y sont proposés. En naviguant sur le site, vous acceptez ces conditions sans réserve.
            </P>

            <H3>2. Accès au service</H3>
            <P>
              Le site est accessible gratuitement, 24h/24 et 7j/7, depuis tout terminal connecté à Internet. L'éditrice se réserve le droit d'interrompre momentanément l'accès pour maintenance, sans préavis ni indemnité. Aucune création de compte n'est requise.
            </P>

            <H3>3. Gratuité totale</H3>
            <P>
              L'intégralité des questionnaires, résultats, synthèses et exports PDF proposés sur PsychaPro sont <strong>entièrement gratuits et sans engagement</strong>. Aucun paiement n'est demandé à aucune étape. Aucune carte bancaire, aucun moyen de paiement n'est requis pour l'accès aux tests.
            </P>

            <H3>4. Nature des questionnaires</H3>
            <P>
              Les questionnaires proposés sont des outils d'auto-évaluation à visée informative et pédagogique, inspirés de modèles psychologiques relevant de la littérature scientifique publique. Ils sont destinés à éveiller votre curiosité sur votre fonctionnement personnel, dans une démarche de développement personnel.
            </P>
            <P>
              <strong>Les résultats obtenus :</strong>
            </P>
            <P>
              — ne constituent <strong>pas un diagnostic médical</strong> ;<br />
              — ne remplacent <strong>en aucun cas</strong> l'avis d'un psychologue, psychiatre, médecin ou tout autre professionnel de santé qualifié ;<br />
              — sont fournis à titre strictement indicatif ;<br />
              — peuvent varier en fonction de votre état du moment et ne sauraient caractériser définitivement votre personnalité ou votre santé mentale.
            </P>

            <H3>5. Engagement de l'utilisateur</H3>
            <P>
              En utilisant le site, vous vous engagez à :<br />
              — fournir des réponses sincères si vous souhaitez obtenir des résultats pertinents ;<br />
              — ne pas utiliser le site dans un but contraire à sa vocation (automatisation, scraping, détournement) ;<br />
              — ne pas tenter de compromettre la sécurité ou la disponibilité du service ;<br />
              — respecter les droits de propriété intellectuelle de l'éditrice.
            </P>
            <P>
              <strong>Le service est déconseillé aux personnes mineures sans accord parental</strong>, ainsi qu'aux personnes en état de crise psychologique aiguë. En cas de détresse, contactez le <strong>3114</strong> (prévention du suicide, gratuit, 24h/24) ou le <strong>15</strong> (SAMU).
            </P>

            <H3>6. Prise de rendez-vous avec un professionnel</H3>
            <P>
              Le bouton « Prendre RDV » vous redirige vers un service tiers de prise de rendez-vous en ligne (<a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.terracotta }}>rdv.itiaki.com/astrid-quemener</a>). À partir de ce clic, vous quittez monpsy.click et acceptez les conditions propres à cette plateforme.
            </P>
            <P>
              Les consultations proposées via cette plateforme tierce font l'objet d'un contrat direct entre vous et Astrid Quémener en tant que professionnelle indépendante. Les modalités, tarifs, conditions d'annulation, obligations déontologiques et législation applicable à ces consultations ne relèvent pas des présentes CGU et sont régies par les conditions d'Itiaki et le cadre légal de l'activité professionnelle exercée.
            </P>

            <H3>7. Limitation de responsabilité</H3>
            <P>
              L'éditrice met en œuvre des moyens raisonnables pour assurer l'exactitude des informations, mais ne saurait être tenue responsable :<br />
              — des erreurs, omissions ou interprétations des résultats par les utilisateurs ;<br />
              — des décisions prises sur la base des résultats obtenus ;<br />
              — des dysfonctionnements techniques, interruptions de service ou indisponibilités ;<br />
              — des contenus, pratiques ou défaillances des sites tiers vers lesquels des liens pointent.
            </P>

            <H3>8. Propriété intellectuelle</H3>
            <P>
              Tous les éléments du site (contenus, questionnaires, algorithmes, graphismes, logo) sont protégés par le droit d'auteur et demeurent la propriété exclusive d'Astrid Quémener. Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.
            </P>

            <H3>9. Données personnelles</H3>
            <P>
              Le traitement des données personnelles est régi par la <strong>Politique de confidentialité</strong> accessible dans l'onglet dédié. En utilisant le site, vous reconnaissez en avoir pris connaissance.
            </P>

            <H3>10. Modification des CGU</H3>
            <P>
              L'éditrice se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont invités à les consulter régulièrement. La version applicable est celle en vigueur au moment de la connexion.
            </P>

            <H3>11. Droit applicable et litiges</H3>
            <P>
              Les présentes CGU sont soumises au droit français. En cas de litige, une résolution amiable sera recherchée en priorité. À défaut, les tribunaux français seront compétents.
            </P>
            <P>
              Conformément à l'article L.612-1 du Code de la consommation, vous pouvez recourir gratuitement à un médiateur de la consommation. Les coordonnées d'un médiateur seront indiquées ici dès désignation : [à compléter].
            </P>

            <H3>12. Contact</H3>
            <P>
              Pour toute question relative aux présentes CGU : <strong>psychafrance@outlook.fr</strong>
            </P>
          </article>)}
        </div>

        <div style={{ marginTop: 25, padding: 19, background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(61,43,31,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 24 }}>📞</span>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: COLORS.deepBrown }}>Une question juridique ou une demande RGPD ?</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.warmGray }}>psychafrance@outlook.fr · Réponse sous 30 jours</div>
          </div>
        </div>
      </div>
    </section>
  );
}
