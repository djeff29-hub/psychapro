import { useState, useEffect, useRef, useMemo } from "react";

const COLORS = {
  cream: "#FFF8F0",
  warmWhite: "#FFFDF9",
  sand: "#F5E6D3",
  terracotta: "#C4704B",
  terracottaLight: "#E8956D",
  sage: "#8FA68A",
  sageDark: "#6B8B65",
  sageLight: "#B8D4B2",
  deepBrown: "#3D2B1F",
  warmGray: "#8C7B6B",
  blush: "#F2D4C4",
  lavender: "#D4C5E2",
  softGold: "#D4A853",
  offWhite: "#FAF6F1",
};

function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="url(#logoGrad)" />
      <text
        x="20" y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="26"
        fontWeight="700"
      >Ψ</text>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor={COLORS.sage} />
          <stop offset="100%" stopColor={COLORS.terracotta} />
        </linearGradient>
      </defs>
    </svg>
  );
}

const TESTS = [
  {
    id: "profile5",
    name: "Profil des 5 dimensions",
    category: "personality",
    duration: "15 min",
    questions: 25,
    badge: "Analyse complète",
    description: "Explorez votre personnalité à travers 5 dimensions fondamentales : Ouverture à l'expérience, Organisation, Extraversion, Bienveillance et Équilibre émotionnel. Une vision complète de qui vous êtes.",
    icon: "🧬",
    color: COLORS.terracotta,
  },
  {
    id: "types16",
    name: "16 Profils de personnalité",
    category: "personality",
    duration: "20 min",
    questions: 30,
    badge: "Le plus populaire",
    description: "Découvrez votre profil parmi 16 types définis selon 4 axes : énergie (introverti/extraverti), perception (concret/intuitif), décision (logique/émotionnel), organisation (planifié/spontané).",
    icon: "🎭",
    color: COLORS.lavender,
  },
  {
    id: "emotions",
    name: "Compétences émotionnelles",
    category: "personality",
    duration: "12 min",
    questions: 20,
    badge: "Entreprises",
    description: "Évaluez votre capacité à percevoir, comprendre et gérer vos émotions et celles des autres. Essentiel pour le leadership et les relations interpersonnelles.",
    icon: "💡",
    color: COLORS.softGold,
  },
  {
    id: "phq9",
    name: "PHQ-9 — Dépistage Dépression",
    category: "mental",
    duration: "5 min",
    questions: 9,
    badge: "Validé cliniquement",
    description: "Questionnaire de référence (domaine public) utilisé par les professionnels de santé pour évaluer la présence et la sévérité de symptômes dépressifs.",
    icon: "🌧️",
    color: COLORS.sage,
  },
  {
    id: "gad7",
    name: "GAD-7 — Dépistage Anxiété",
    category: "mental",
    duration: "5 min",
    questions: 7,
    badge: "Validé cliniquement",
    description: "Outil clinique reconnu (domaine public) pour évaluer les troubles anxieux généralisés. Utilisé dans le monde entier par les médecins et psychologues.",
    icon: "🌀",
    color: COLORS.sageLight,
  },
  {
    id: "epuisement",
    name: "Épuisement professionnel",
    category: "mental",
    duration: "10 min",
    questions: 22,
    badge: "Entreprises",
    description: "Mesurez votre niveau d'épuisement professionnel à travers trois dimensions : fatigue émotionnelle, distance relationnelle au travail et sentiment d'efficacité personnelle.",
    icon: "🔥",
    color: COLORS.terracottaLight,
  },
  {
    id: "stress",
    name: "Stress perçu",
    category: "wellbeing",
    duration: "5 min",
    questions: 10,
    badge: "Rapide",
    description: "Mesurez votre niveau de stress perçu au cours du dernier mois. Un indicateur fiable pour prendre conscience de votre état et agir en conséquence.",
    icon: "🍃",
    color: COLORS.sage,
  },
  {
    id: "attachment",
    name: "Style d'attachement",
    category: "relations",
    duration: "12 min",
    questions: 18,
    badge: "Relations",
    description: "Identifiez votre style d'attachement (sécure, anxieux, évitant, désorganisé) et comprenez comment il influence vos relations intimes et professionnelles.",
    icon: "🤝",
    color: COLORS.blush,
  },
  {
    id: "estime",
    name: "Estime de soi",
    category: "wellbeing",
    duration: "5 min",
    questions: 10,
    badge: "Fondamental",
    description: "Évaluez votre niveau d'estime de soi globale à travers votre rapport à vous-même, votre valeur personnelle et votre confiance. Simple et rapide.",
    icon: "🌟",
    color: COLORS.softGold,
  },
  {
    id: "resilience",
    name: "Capacité de résilience",
    category: "wellbeing",
    duration: "8 min",
    questions: 14,
    badge: "Développement",
    description: "Évaluez votre capacité à rebondir face à l'adversité. Identifiez vos ressources internes et les axes de développement de votre résilience psychologique.",
    icon: "🌱",
    color: COLORS.sageDark,
  },
];

const CATEGORIES = {
  all: "Tous les tests",
  personality: "Personnalité",
  mental: "Santé Mentale",
  wellbeing: "Bien-être",
  relations: "Relations",
};

// ============================================================
// QUESTION BANKS — Questions reformulées (pas de noms copyrightés)
// Chaque question est associée à une dimension (dim) et peut être inversée (rev)
// ============================================================
const QUESTION_BANKS = {
  // Profil des 5 dimensions — inspiré du modèle OCEAN (domaine scientifique public)
  profile5: [
    { q: "J'aime explorer de nouvelles idées et découvrir des concepts originaux.", dim: "ouverture" },
    { q: "Je m'intéresse aux formes d'art, aux voyages et aux cultures différentes.", dim: "ouverture" },
    { q: "Je préfère les routines établies aux situations nouvelles.", dim: "ouverture", rev: true },
    { q: "J'aime réfléchir à des questions abstraites ou philosophiques.", dim: "ouverture" },
    { q: "Je termine toujours ce que je commence.", dim: "organisation" },
    { q: "Je suis attentif(ve) aux détails dans mon travail.", dim: "organisation" },
    { q: "J'ai tendance à remettre les choses à plus tard.", dim: "organisation", rev: true },
    { q: "Mon espace de travail et mes affaires sont bien organisés.", dim: "organisation" },
    { q: "Je me sens à l'aise dans les groupes nombreux.", dim: "extraversion" },
    { q: "J'aime être au centre de l'attention.", dim: "extraversion" },
    { q: "Je préfère passer du temps seul(e) plutôt qu'entouré(e).", dim: "extraversion", rev: true },
    { q: "Je prends facilement la parole en public.", dim: "extraversion" },
    { q: "Je m'intéresse sincèrement aux problèmes des autres.", dim: "bienveillance" },
    { q: "Je prends le temps d'aider mes proches quand ils en ont besoin.", dim: "bienveillance" },
    { q: "Je suis parfois critique et peu patient(e) avec les autres.", dim: "bienveillance", rev: true },
    { q: "Je fais confiance aux intentions des gens que je rencontre.", dim: "bienveillance" },
    { q: "J'ai tendance à m'inquiéter facilement.", dim: "equilibre", rev: true },
    { q: "Je reste calme même dans les situations tendues.", dim: "equilibre" },
    { q: "Je me sens souvent triste ou découragé(e).", dim: "equilibre", rev: true },
    { q: "Mes émotions sont généralement stables au cours de la journée.", dim: "equilibre" },
    { q: "J'aime imaginer comment les choses pourraient être différentes.", dim: "ouverture" },
    { q: "Je respecte mes engagements, même quand c'est difficile.", dim: "organisation" },
    { q: "L'énergie du groupe me stimule et me donne envie d'agir.", dim: "extraversion" },
    { q: "Je cherche à comprendre le point de vue de l'autre, même en désaccord.", dim: "bienveillance" },
    { q: "Les revers de la vie me touchent profondément et longtemps.", dim: "equilibre", rev: true },
  ],

  // 16 profils — inspiré de la typologie à 4 axes (modèle libre d'usage)
  types16: [
    { q: "Dans une soirée, je recharge mon énergie au contact des autres.", dim: "E", pair: "EI" },
    { q: "J'ai besoin de moments seul(e) pour me ressourcer après une journée sociale.", dim: "I", pair: "EI" },
    { q: "Je parle facilement de mes idées avec des inconnus.", dim: "E", pair: "EI" },
    { q: "Je réfléchis longuement avant d'exprimer mes pensées.", dim: "I", pair: "EI" },
    { q: "Je m'anime dans les groupes et les discussions animées.", dim: "E", pair: "EI" },
    { q: "Je préfère les échanges en petit comité ou en tête-à-tête.", dim: "I", pair: "EI" },
    { q: "Je fais confiance à ce que je peux observer et mesurer concrètement.", dim: "S", pair: "SN" },
    { q: "Je suis attiré(e) par les concepts abstraits et les théories.", dim: "N", pair: "SN" },
    { q: "Je préfère suivre des méthodes éprouvées qui ont fait leurs preuves.", dim: "S", pair: "SN" },
    { q: "J'aime imaginer des solutions nouvelles et inédites.", dim: "N", pair: "SN" },
    { q: "Je me fie aux faits et aux détails plutôt qu'aux impressions.", dim: "S", pair: "SN" },
    { q: "J'ai souvent des intuitions justes sur ce qui va se passer.", dim: "N", pair: "SN" },
    { q: "Quand je prends une décision, la logique prime sur les sentiments.", dim: "T", pair: "TF" },
    { q: "Je prends mes décisions en tenant compte de l'impact sur les personnes.", dim: "F", pair: "TF" },
    { q: "Dans un conflit, je cherche la solution la plus rationnelle.", dim: "T", pair: "TF" },
    { q: "Dans un conflit, je cherche à préserver l'harmonie du groupe.", dim: "F", pair: "TF" },
    { q: "On me reproche parfois d'être trop direct(e) ou froid(e).", dim: "T", pair: "TF" },
    { q: "On me reproche parfois d'être trop sensible ou empathique.", dim: "F", pair: "TF" },
    { q: "J'aime planifier à l'avance et avoir un calendrier précis.", dim: "J", pair: "JP" },
    { q: "Je préfère garder mes options ouvertes et improviser.", dim: "P", pair: "JP" },
    { q: "Je me sens mal à l'aise quand les choses ne sont pas décidées.", dim: "J", pair: "JP" },
    { q: "Je m'adapte facilement aux changements de dernière minute.", dim: "P", pair: "JP" },
    { q: "J'aime terminer une tâche avant d'en commencer une autre.", dim: "J", pair: "JP" },
    { q: "Je travaille mieux sous la pression d'une deadline proche.", dim: "P", pair: "JP" },
    { q: "Les listes et les échéances me rassurent.", dim: "J", pair: "JP" },
    { q: "Les listes et les échéances m'étouffent.", dim: "P", pair: "JP" },
    { q: "Je trouve de l'énergie dans les échanges dynamiques.", dim: "E", pair: "EI" },
    { q: "Mon monde intérieur est riche et bien plus vaste que ce que je montre.", dim: "I", pair: "EI" },
    { q: "Je suis plus à l'aise avec le concret qu'avec les spéculations.", dim: "S", pair: "SN" },
    { q: "Je préfère explorer plusieurs possibilités avant de trancher.", dim: "P", pair: "JP" },
  ],

  // Compétences émotionnelles (modèle de Goleman — libre d'usage)
  emotions: [
    { q: "Je reconnais mes émotions au moment où je les ressens.", dim: "conscience" },
    { q: "Je comprends pourquoi je me sens d'une certaine manière.", dim: "conscience" },
    { q: "Je confonds parfois tristesse, colère et fatigue.", dim: "conscience", rev: true },
    { q: "Je sais identifier ce qui déclenche mes émotions.", dim: "conscience" },
    { q: "Je garde mon calme quand une situation m'irrite.", dim: "gestion" },
    { q: "Je mets du temps à me calmer après une contrariété.", dim: "gestion", rev: true },
    { q: "Je sais apaiser mon stress quand il monte.", dim: "gestion" },
    { q: "Mes émotions fortes guident souvent mes décisions sans que je le veuille.", dim: "gestion", rev: true },
    { q: "Je perçois l'état émotionnel des autres sans qu'ils parlent.", dim: "empathie" },
    { q: "Je prends en compte les sentiments d'autrui dans mes échanges.", dim: "empathie" },
    { q: "J'ai parfois du mal à comprendre pourquoi les autres réagissent comme ils le font.", dim: "empathie", rev: true },
    { q: "Je m'adapte à l'humeur de la personne en face de moi.", dim: "empathie" },
    { q: "Je sais désamorcer les tensions dans un groupe.", dim: "social" },
    { q: "Je parle avec aisance devant des personnes que je connais peu.", dim: "social" },
    { q: "Je sais donner un feedback difficile sans blesser.", dim: "social" },
    { q: "Je me sens démuni(e) face aux conflits interpersonnels.", dim: "social", rev: true },
    { q: "Je persiste dans mes objectifs même après un échec.", dim: "motivation" },
    { q: "J'abandonne facilement quand je rencontre un obstacle.", dim: "motivation", rev: true },
    { q: "Je trouve du sens dans ce que je fais au quotidien.", dim: "motivation" },
    { q: "Je me fixe des objectifs personnels ambitieux.", dim: "motivation" },
  ],

  // PHQ-9 — domaine public, traduction française standard
  phq9: [
    { q: "Peu d'intérêt ou de plaisir à faire les choses.", dim: "depression" },
    { q: "Sentiment de tristesse, de dépression ou de désespoir.", dim: "depression" },
    { q: "Difficultés d'endormissement, sommeil interrompu ou sommeil excessif.", dim: "depression" },
    { q: "Fatigue ou manque d'énergie.", dim: "depression" },
    { q: "Manque d'appétit ou tendance à trop manger.", dim: "depression" },
    { q: "Sentiment négatif vis-à-vis de soi-même, impression d'être un(e) raté(e).", dim: "depression" },
    { q: "Difficultés à se concentrer (lire, regarder la télévision).", dim: "depression" },
    { q: "Lenteur ou agitation visible par les autres.", dim: "depression" },
    { q: "Pensées que la vie ne vaut pas la peine d'être vécue ou de se faire du mal.", dim: "depression", critical: true },
  ],

  // GAD-7 — domaine public
  gad7: [
    { q: "Se sentir nerveux(se), anxieux(se) ou tendu(e).", dim: "anxiete" },
    { q: "Ne pas pouvoir arrêter ou contrôler ses inquiétudes.", dim: "anxiete" },
    { q: "S'inquiéter trop à propos de choses différentes.", dim: "anxiete" },
    { q: "Avoir du mal à se détendre.", dim: "anxiete" },
    { q: "Être si agité(e) qu'il est difficile de rester tranquille.", dim: "anxiete" },
    { q: "Devenir facilement contrarié(e) ou irritable.", dim: "anxiete" },
    { q: "Avoir peur que quelque chose d'horrible puisse arriver.", dim: "anxiete" },
  ],

  // Épuisement professionnel — 3 dimensions (modèle libre de référence)
  epuisement: [
    { q: "Je me sens émotionnellement vidé(e) par mon travail.", dim: "fatigue" },
    { q: "Je me sens épuisé(e) dès le matin à l'idée d'une journée de travail.", dim: "fatigue" },
    { q: "Travailler toute la journée demande un effort considérable.", dim: "fatigue" },
    { q: "Je me sens à bout à la fin de ma journée.", dim: "fatigue" },
    { q: "Le travail m'épuise, je n'en peux plus.", dim: "fatigue" },
    { q: "Mon travail me frustre et me rend irritable.", dim: "fatigue" },
    { q: "Je me sens trop impliqué(e) affectivement par mon travail.", dim: "fatigue" },
    { q: "Je me sens dépassé(e) par mon travail.", dim: "fatigue" },
    { q: "Je suis devenu(e) plus distant(e) avec les personnes de mon travail.", dim: "distance" },
    { q: "Je traite certaines personnes comme des objets impersonnels.", dim: "distance" },
    { q: "J'ai le sentiment de ne plus vraiment m'impliquer dans mon travail.", dim: "distance" },
    { q: "Je doute de l'utilité de mon travail.", dim: "distance" },
    { q: "Je me moque de ce qui peut arriver à certaines personnes de mon travail.", dim: "distance" },
    { q: "J'ai l'impression que les autres me rendent responsable de leurs problèmes.", dim: "distance" },
    { q: "J'arrive à comprendre facilement ce que ressentent mes collègues/clients.", dim: "efficacite" },
    { q: "Je m'occupe très efficacement des problèmes de mes collègues/clients.", dim: "efficacite" },
    { q: "J'ai le sentiment d'influencer positivement la vie des autres.", dim: "efficacite" },
    { q: "Je me sens plein(e) d'énergie au travail.", dim: "efficacite" },
    { q: "Je crée facilement une ambiance détendue au travail.", dim: "efficacite" },
    { q: "Je me sens ragaillardi(e) après avoir travaillé avec mes collègues.", dim: "efficacite" },
    { q: "J'ai accompli beaucoup de choses qui en valent la peine.", dim: "efficacite" },
    { q: "Dans mon travail, je reste calme face aux problèmes émotionnels.", dim: "efficacite" },
  ],

  // Stress perçu — modèle de Cohen (usage académique libre)
  stress: [
    { q: "Au cours du dernier mois, combien de fois avez-vous été dérangé(e) par un événement inattendu ?", dim: "stress" },
    { q: "Vous êtes-vous senti(e) incapable de contrôler les choses importantes de votre vie ?", dim: "stress" },
    { q: "Vous êtes-vous senti(e) nerveux(se) ou stressé(e) ?", dim: "stress" },
    { q: "Avez-vous géré avec succès les petits problèmes du quotidien ?", dim: "stress", rev: true },
    { q: "Avez-vous senti que vous faisiez face efficacement aux changements importants de votre vie ?", dim: "stress", rev: true },
    { q: "Vous êtes-vous senti(e) confiant(e) dans votre capacité à régler vos problèmes personnels ?", dim: "stress", rev: true },
    { q: "Avez-vous senti que les choses allaient comme vous le vouliez ?", dim: "stress", rev: true },
    { q: "Avez-vous trouvé que vous ne pouviez pas faire face à tout ce que vous aviez à faire ?", dim: "stress" },
    { q: "Avez-vous été capable de maîtriser votre énervement ?", dim: "stress", rev: true },
    { q: "Avez-vous senti que les difficultés s'accumulaient au point de ne plus pouvoir les contrôler ?", dim: "stress" },
  ],

  // Style d'attachement — 4 styles (théorie libre de Bowlby/Ainsworth)
  attachment: [
    { q: "Je me sens à l'aise dans les relations proches et intimes.", dim: "secure" },
    { q: "J'ai confiance que mes proches seront là pour moi si j'en ai besoin.", dim: "secure" },
    { q: "Je trouve facile de m'attacher aux autres.", dim: "secure" },
    { q: "Je ne m'inquiète pas d'être abandonné(e) ou trop proche.", dim: "secure" },
    { q: "Je m'inquiète souvent que mon/ma partenaire ne m'aime pas vraiment.", dim: "anxieux" },
    { q: "J'ai besoin de beaucoup de réassurance de la part de mes proches.", dim: "anxieux" },
    { q: "Je crains que les gens ne veuillent pas être aussi proches que moi.", dim: "anxieux" },
    { q: "Je pense souvent aux relations et j'y réfléchis beaucoup.", dim: "anxieux" },
    { q: "Je préfère garder une certaine distance émotionnelle dans mes relations.", dim: "evitant" },
    { q: "Je me sens mal à l'aise quand quelqu'un devient trop proche.", dim: "evitant" },
    { q: "Je trouve difficile de faire entièrement confiance aux autres.", dim: "evitant" },
    { q: "Je préfère ne pas dépendre de quelqu'un pour mes besoins émotionnels.", dim: "evitant" },
    { q: "Mes sentiments dans les relations sont confus et contradictoires.", dim: "desorganise" },
    { q: "Je veux être proche mais j'ai peur d'être blessé(e).", dim: "desorganise" },
    { q: "Je passe de moments très proches à un besoin de distance sans comprendre pourquoi.", dim: "desorganise" },
    { q: "Les relations intimes me font à la fois envie et peur.", dim: "desorganise" },
    { q: "Je sais exprimer mes besoins affectifs de façon claire.", dim: "secure" },
    { q: "J'arrive à me rassurer moi-même sans dépendre des autres.", dim: "secure" },
  ],

  // Estime de soi — questions reformulées d'après un modèle général (domaine public)
  estime: [
    { q: "Globalement, je suis satisfait(e) de moi-même.", dim: "estime" },
    { q: "Parfois, je pense que je ne vaux pas grand-chose.", dim: "estime", rev: true },
    { q: "Je pense avoir un certain nombre de qualités.", dim: "estime" },
    { q: "Je suis capable de faire les choses aussi bien que la plupart des gens.", dim: "estime" },
    { q: "Je sens qu'il n'y a pas grand-chose dont je puisse être fier(e).", dim: "estime", rev: true },
    { q: "Je me sens parfois inutile.", dim: "estime", rev: true },
    { q: "Je pense avoir autant de valeur que n'importe qui d'autre.", dim: "estime" },
    { q: "J'aimerais avoir plus de respect pour moi-même.", dim: "estime", rev: true },
    { q: "Tout bien considéré, j'ai tendance à me sentir raté(e).", dim: "estime", rev: true },
    { q: "J'ai une attitude positive envers moi-même.", dim: "estime" },
  ],

  // Résilience — modèle général de capacité d'adaptation
  resilience: [
    { q: "Je parviens à m'adapter quand les choses changent.", dim: "adaptation" },
    { q: "Je rebondis rapidement après une difficulté.", dim: "adaptation" },
    { q: "Je trouve en moi les ressources pour faire face aux épreuves.", dim: "ressources" },
    { q: "Dans les moments difficiles, je vois des opportunités d'apprendre.", dim: "adaptation" },
    { q: "Je me décourage vite face à un échec.", dim: "ressources", rev: true },
    { q: "Je peux compter sur mes proches en cas de besoin.", dim: "soutien" },
    { q: "Je sais demander de l'aide quand j'en ai besoin.", dim: "soutien" },
    { q: "J'ai tendance à ruminer longtemps mes problèmes.", dim: "ressources", rev: true },
    { q: "J'arrive à donner du sens aux événements difficiles de ma vie.", dim: "sens" },
    { q: "Je garde espoir même dans les situations compliquées.", dim: "sens" },
    { q: "Je prends soin de moi physiquement et mentalement.", dim: "ressources" },
    { q: "Je crois en ma capacité à surmonter les épreuves.", dim: "ressources" },
    { q: "Les échecs me poussent à recommencer différemment.", dim: "adaptation" },
    { q: "Je me sens dépassé(e) par les situations nouvelles.", dim: "adaptation", rev: true },
  ],
};

const ANSWER_OPTIONS = ["Pas du tout", "Un peu", "Modérément", "Beaucoup", "Tout à fait"];
const ANSWER_OPTIONS_FREQ = ["Jamais", "Plusieurs jours", "Plus de la moitié du temps", "Presque tous les jours"];
const ANSWER_OPTIONS_FREQ5 = ["Jamais", "Presque jamais", "Parfois", "Assez souvent", "Très souvent"];

// Retourne les options selon le type de test
function getAnswerOptions(testId) {
  if (testId === "phq9" || testId === "gad7") return ANSWER_OPTIONS_FREQ;
  if (testId === "stress") return ANSWER_OPTIONS_FREQ5;
  return ANSWER_OPTIONS;
}

// ============================================================
// SCORING ENGINE — Algorithme déterministe sans IA
// ============================================================
function computeResults(testId, answers) {
  const questions = QUESTION_BANKS[testId];
  if (!questions) return null;

  // Normalise : si l'échelle a 4 options (0-3), convertir sur 5 options (0-4) pour homogénéité
  const maxOption = getAnswerOptions(testId).length - 1;
  const toScore = (rawAnswer, reversed) => {
    const v = reversed ? maxOption - rawAnswer : rawAnswer;
    return v;
  };

  // Regroupe les scores par dimension
  const dimScores = {};
  const dimCounts = {};
  let criticalFlag = false;

  questions.forEach((q, i) => {
    const raw = answers[i];
    if (raw === undefined) return;
    const score = toScore(raw, q.rev);
    dimScores[q.dim] = (dimScores[q.dim] || 0) + score;
    dimCounts[q.dim] = (dimCounts[q.dim] || 0) + 1;
    if (q.critical && raw > 0) criticalFlag = true;
  });

  // Pour chaque dimension, calcule le % (score moyen / max * 100)
  const dimensions = Object.keys(dimScores).map(dim => {
    const total = dimScores[dim];
    const count = dimCounts[dim];
    const maxPossible = count * maxOption;
    const pct = Math.round((total / maxPossible) * 100);
    return { dim, name: DIMENSION_LABELS[dim] || dim, score: pct, raw: total, count };
  });

  // Génère une interprétation par règles conditionnelles
  return {
    dimensions: dimensions.map(d => ({
      name: d.name,
      score: d.score,
      desc: getDimensionDescription(testId, d.dim, d.score),
    })),
    summary: generateSummary(testId, dimensions, criticalFlag),
    advice: generateAdvice(testId, dimensions, criticalFlag),
    level: getGlobalLevel(testId, dimensions),
    critical: criticalFlag,
    raw: dimensions,
    strong: dimensions.filter(d => d.score >= 65).sort((a, b) => b.score - a.score),
    weak: dimensions.filter(d => d.score < 40).sort((a, b) => a.score - b.score),
  };
}

// Libellés humains pour chaque dimension
const DIMENSION_LABELS = {
  ouverture: "Ouverture à l'expérience",
  organisation: "Organisation et rigueur",
  extraversion: "Extraversion",
  bienveillance: "Bienveillance",
  equilibre: "Équilibre émotionnel",
  conscience: "Conscience émotionnelle",
  gestion: "Gestion des émotions",
  empathie: "Empathie",
  social: "Aisance sociale",
  motivation: "Motivation",
  depression: "Symptômes dépressifs",
  anxiete: "Symptômes anxieux",
  fatigue: "Fatigue émotionnelle",
  distance: "Distance relationnelle",
  efficacite: "Sentiment d'efficacité",
  stress: "Niveau de stress perçu",
  secure: "Attachement sécure",
  anxieux: "Attachement anxieux",
  evitant: "Attachement évitant",
  desorganise: "Attachement désorganisé",
  estime: "Estime de soi globale",
  adaptation: "Capacité d'adaptation",
  ressources: "Ressources internes",
  soutien: "Soutien social perçu",
  sens: "Recherche de sens",
  E: "Énergie — Extraversion", I: "Énergie — Introversion",
  S: "Perception — Concrète", N: "Perception — Intuitive",
  T: "Décision — Logique", F: "Décision — Humaine",
  J: "Organisation — Planifiée", P: "Organisation — Flexible",
};

// Descriptions détaillées par dimension selon le score (niveau bas / moyen / élevé)
// Chaque description comporte 2-3 phrases développées
function getDimensionDescription(testId, dim, score) {
  // ===== TESTS CLINIQUES =====
  if (testId === "phq9") {
    if (score < 20) return "Vos réponses ne révèlent pas de symptômes dépressifs significatifs. Votre humeur semble globalement stable et vous gardez intérêt et énergie pour les activités de votre quotidien.";
    if (score < 40) return "Vous présentez quelques signes légers, comme une baisse ponctuelle d'énergie ou de motivation. Ces symptômes sont fréquents et souvent passagers, mais méritent votre attention si ils persistent plusieurs semaines.";
    if (score < 60) return "Vos réponses indiquent des symptômes dépressifs modérés qui commencent probablement à impacter votre vie quotidienne, votre travail ou vos relations. Il est temps d'en parler à un professionnel qui pourra vous accompagner.";
    if (score < 80) return "Les symptômes que vous décrivez sont significatifs et affectent vraisemblablement plusieurs aspects de votre vie. Un accompagnement psychologique, éventuellement combiné à un suivi médical, est fortement recommandé.";
    return "Vos réponses révèlent une souffrance psychologique importante qui nécessite une prise en charge rapide. N'hésitez pas à consulter votre médecin traitant ou un psychiatre dans les prochains jours — vous n'êtes pas seul(e).";
  }
  if (testId === "gad7") {
    if (score < 25) return "Votre niveau d'anxiété apparaît bien régulé. Vous semblez disposer de ressources adaptées pour faire face aux inquiétudes du quotidien sans qu'elles prennent trop de place.";
    if (score < 45) return "Vous ressentez des inquiétudes mais elles restent d'intensité modérée. Des techniques comme la respiration consciente, la méditation ou l'activité physique régulière peuvent vous aider à les apaiser durablement.";
    if (score < 70) return "Votre anxiété est significative et pèse probablement sur votre quotidien — sommeil, concentration, relations peuvent en être affectés. Un accompagnement thérapeutique, notamment en TCC, a fait ses preuves sur ce type de difficultés.";
    return "Le niveau d'anxiété que vous décrivez suggère un trouble anxieux qui mérite une prise en charge professionnelle. De nombreuses approches existent et donnent d'excellents résultats — il est important d'agir maintenant.";
  }
  if (testId === "stress") {
    if (score < 30) return "Votre stress perçu est faible, ce qui traduit une bonne capacité à faire face aux événements du quotidien. Vous semblez avoir identifié ce qui vous permet de rester serein(e) — continuez à cultiver ces habitudes.";
    if (score < 55) return "Vous ressentez un stress modéré, ce qui est courant dans la vie active moderne. Identifier les principales sources de tension et mettre en place des rituels de récupération (sommeil, sport, moments de déconnexion) fera une vraie différence.";
    return "Votre niveau de stress est élevé et pourrait, s'il persiste, affecter votre santé physique et mentale. Il est important de ralentir, d'identifier ce qui est sous votre contrôle et ce qui ne l'est pas, et éventuellement de solliciter un accompagnement.";
  }
  if (testId === "estime") {
    if (score < 40) return "Vous avez tendance à être dur(e) avec vous-même et à sous-estimer votre valeur. Cette fragilité peut impacter vos relations et vos choix de vie. Un accompagnement permettrait de reconstruire progressivement un rapport plus bienveillant à vous-même.";
    if (score < 70) return "Votre estime de soi est globalement positive, avec des zones de fragilité. Vous reconnaissez vos qualités mais pouvez douter dans certains contextes. Travailler ces points permet souvent de gagner en sérénité et en affirmation.";
    return "Vous avez une estime de vous-même solide et équilibrée. Vous reconnaissez votre valeur tout en restant humble et conscient(e) de vos limites. Cette base vous aide probablement dans vos projets et vos relations.";
  }

  // ===== BURNOUT — 3 dimensions =====
  if (testId === "epuisement") {
    if (dim === "fatigue") {
      if (score < 30) return "Vous semblez disposer d'une énergie préservée au travail. Vous arrivez à retrouver votre vitalité en dehors des heures professionnelles, ce qui est un excellent indicateur d'équilibre.";
      if (score < 55) return "Vous ressentez une fatigue émotionnelle modérée qui peut s'installer dans le temps. C'est un signal à ne pas négliger — des aménagements (charge, récupération, soutien) peuvent prévenir une évolution défavorable.";
      return "L'épuisement émotionnel que vous décrivez est un signe d'alerte majeur du burnout. Il est urgent de réagir : évoquer la situation avec votre médecin, envisager un arrêt de travail si nécessaire, et entamer un accompagnement psychologique.";
    }
    if (dim === "distance") {
      if (score < 30) return "Vous maintenez un lien authentique et bienveillant avec les personnes de votre environnement professionnel. Cet investissement relationnel est une ressource importante.";
      if (score < 55) return "Vous commencez à prendre une certaine distance émotionnelle au travail, parfois comme un mécanisme de protection. Il est utile d'en comprendre les causes avant que cette distance ne s'installe durablement.";
      return "La distance relationnelle forte que vous décrivez (cynisme, détachement) est caractéristique d'un processus de burnout avancé. Cette dépersonnalisation est protectrice à court terme mais usante à long terme — un accompagnement est indispensable.";
    }
    if (dim === "efficacite") {
      if (score < 40) return "Vous doutez fortement de l'utilité et de l'impact de votre travail. Ce sentiment d'inefficacité, combiné à de la fatigue, est un marqueur central du burnout et nécessite une prise de recul professionnelle et personnelle.";
      if (score < 70) return "Vous reconnaissez vos compétences mais votre sentiment d'efficacité est fluctuant. Renouer avec le sens de votre travail et vos réussites concrètes peut renforcer cette dimension essentielle.";
      return "Vous avez un solide sentiment d'efficacité et d'utilité dans votre travail. Cette dimension positive est une ressource précieuse qui peut contrebalancer d'éventuelles difficultés par ailleurs.";
    }
  }

  // ===== STYLES D'ATTACHEMENT — interprétations spécifiques =====
  if (testId === "attachment") {
    if (dim === "secure") {
      if (score >= 60) return "Vous avez développé un attachement sécure — vous êtes à l'aise avec l'intimité comme avec l'autonomie, et vous faites globalement confiance aux autres. Cette base saine facilite des relations équilibrées et épanouissantes.";
      if (score >= 40) return "Votre style sécure est présent par moments, mais peut vaciller selon les contextes ou les partenaires. Identifier ce qui le renforce ou l'ébranle peut vous aider à cultiver des relations plus sereines.";
      return "Les caractéristiques de l'attachement sécure sont peu présentes chez vous actuellement. Cela ne signifie pas que vous ne pouvez pas les développer — le travail thérapeutique sur l'attachement donne d'excellents résultats.";
    }
    if (dim === "anxieux") {
      if (score >= 60) return "Vous présentez une forte sensibilité à l'abandon et un besoin marqué de réassurance dans vos relations. Cette intensité peut être usante, pour vous comme pour vos proches — la comprendre est la première étape pour l'apaiser.";
      if (score >= 40) return "Des éléments d'attachement anxieux sont présents, particulièrement dans les contextes où vous tenez à la personne. C'est une tendance courante qui peut s'atténuer avec conscience et travail relationnel.";
      return "L'anxiété relationnelle n'est pas un trait dominant chez vous. Vous arrivez généralement à rester serein(e) dans l'attente ou l'incertitude au sein de vos relations.";
    }
    if (dim === "evitant") {
      if (score >= 60) return "Vous privilégiez fortement l'indépendance émotionnelle et pouvez vous sentir oppressé(e) par une trop grande proximité. Cette autonomie a ses avantages mais peut parfois éloigner des connexions qui seraient nourrissantes.";
      if (score >= 40) return "Vous avez un besoin modéré d'espace dans les relations. Savoir alterner proximité et autonomie est une force — à condition que la distance ne devienne pas un mécanisme de protection systématique.";
      return "Vous êtes à l'aise avec la proximité émotionnelle et ne ressentez pas le besoin de vous protéger par la distance. C'est une qualité précieuse pour des relations profondes.";
    }
    if (dim === "desorganise") {
      if (score >= 60) return "Vous ressentez une ambivalence forte dans vos relations — désir de proximité et peur simultanée. Ce pattern peut trouver son origine dans des expériences précoces et un accompagnement thérapeutique peut vraiment aider à y mettre du sens.";
      if (score >= 40) return "Vous avez parfois des sentiments contradictoires dans vos relations proches. Explorer ces ambivalences avec un professionnel peut éclairer des dynamiques importantes.";
      return "Vos relations sont globalement cohérentes, sans ambivalences majeures entre désir de proximité et mise à distance.";
    }
  }

  // ===== TYPES 16 — pôles opposés =====
  if (testId === "types16") {
    const map = {
      E: ["Vous puisez votre énergie au contact des autres. Les échanges dynamiques, les groupes et les activités sociales vous stimulent et vous rechargent.", "Vous alternez entre besoin social et besoin de retrait, selon les contextes.", "Vous préférez garder une distance sociale — c'est dans la solitude que vous retrouvez votre énergie."],
      I: ["Vous avez besoin de moments de solitude pour vous ressourcer. Votre vie intérieure est riche et la stimulation sociale peut vous épuiser si elle est excessive.", "Vous savez profiter de la solitude sans pour autant éviter le social.", "Vous êtes à l'aise dans les interactions et la solitude prolongée ne vous convient pas."],
      S: ["Vous vous fiez au concret, aux faits, aux détails observables. Vous êtes ancré(e) dans la réalité et préférez les méthodes éprouvées aux spéculations.", "Vous combinez observation concrète et ouverture aux intuitions selon les situations.", "Vous êtes moins porté(e) sur les détails concrets et préférez les vues d'ensemble."],
      N: ["Vous êtes attiré(e) par les concepts abstraits, les possibilités et les liens invisibles. Votre intuition guide souvent vos perceptions.", "Vous utilisez intuition et observation de façon équilibrée.", "L'intuition n'est pas votre mode dominant de perception."],
      T: ["Vous prenez vos décisions avec logique et cohérence. Vous privilégiez l'analyse objective, parfois au détriment de l'impact émotionnel.", "Vous combinez raison et sensibilité dans vos choix.", "L'analyse logique froide n'est pas votre premier réflexe — vous êtes d'abord sensible à l'humain."],
      F: ["Vous décidez en tenant compte des personnes et de l'harmonie relationnelle. L'humain est au centre de votre jugement.", "Vous équilibrez logique et sensibilité dans vos décisions.", "Les considérations relationnelles passent au second plan — la cohérence logique prime."],
      J: ["Vous appréciez la structure, les plans et les décisions prises. Vivre avec un cadre clair vous rassure et vous permet d'avancer efficacement.", "Vous savez structurer quand il le faut et improviser quand c'est nécessaire.", "Le cadre strict vous oppresse plus qu'il ne vous aide."],
      P: ["Vous aimez garder vos options ouvertes et vous adapter selon les circonstances. La flexibilité est votre mode de fonctionnement privilégié.", "Vous alternez flexibilité et décision selon le contexte.", "L'ouverture permanente et le manque de décision vous mettent mal à l'aise."],
    };
    const texts = map[dim];
    if (!texts) return "";
    if (score >= 60) return texts[0];
    if (score >= 40) return texts[1];
    return texts[2];
  }

  // ===== PROFIL 5 DIMENSIONS (OCEAN) =====
  const detailed = {
    ouverture: {
      high: "Vous êtes naturellement curieux(se) et attiré(e) par la nouveauté. Les idées nouvelles, les expériences inhabituelles, les formes d'art ou les voyages vous stimulent. Vous aimez explorer et questionner les choses plutôt que suivre les conventions établies.",
      mid: "Vous appréciez la nouveauté dans certains domaines tout en aimant des repères stables dans d'autres. Cette flexibilité vous permet d'évoluer sans vous déstabiliser, en choisissant vos moments d'exploration.",
      low: "Vous valorisez la stabilité, les traditions et ce qui a fait ses preuves. Cette préférence pour le familier vous offre des bases solides mais peut parfois freiner l'exploration de nouvelles opportunités.",
    },
    organisation: {
      high: "Vous êtes méthodique, fiable et consciencieux(se). Vous tenez vos engagements, planifiez à l'avance et faites attention aux détails. Cette rigueur est un atout professionnel majeur, à condition de ne pas devenir trop exigeant(e) avec vous-même.",
      mid: "Vous alternez entre organisation et flexibilité selon les enjeux. Vous savez structurer quand c'est important et lâcher prise quand ça ne l'est pas — un équilibre souvent plus durable que la rigueur absolue.",
      low: "Vous fonctionnez de manière spontanée et flexible, en suivant votre élan plutôt qu'un plan préétabli. Cette spontanéité a ses atouts mais peut générer du stress face aux échéances — créer des structures minimales peut aider.",
    },
    extraversion: {
      high: "Vous puisez votre énergie dans les interactions sociales. Vous êtes à l'aise en groupe, prenez volontiers la parole et aimez être entouré(e). Cette sociabilité est un atout relationnel, à équilibrer avec des moments de recentrage.",
      mid: "Vous alternez confortablement entre moments sociaux et moments de solitude. Cet équilibre ambivert vous permet de vous adapter à différents contextes sans vous épuiser.",
      low: "Vous préférez les interactions calmes et en petit comité, et vous vous ressourcez dans la solitude. Cette introversion est une force — vie intérieure riche, écoute attentive — que la société valorise parfois peu mais qui compte beaucoup.",
    },
    bienveillance: {
      high: "Vous êtes empathique, chaleureux(se) et attentif(ve) aux besoins des autres. Cette générosité relationnelle vous vaut souvent la confiance de votre entourage. Attention toutefois à préserver vos propres limites pour ne pas vous oublier.",
      mid: "Vous êtes attentionné(e) tout en préservant votre esprit critique. Ce juste milieu entre ouverture et discernement est une force dans les relations comme dans la vie professionnelle.",
      low: "Vous êtes direct(e) et affirmé(e), avec un fort esprit critique. Cette franchise peut être appréciée dans certains contextes (leadership, expertise) mais gagnerait parfois à s'adoucir pour préserver les relations.",
    },
    equilibre: {
      high: "Vous êtes stable émotionnellement et gérez bien les tensions. Vous restez généralement calme face au stress et aux imprévus. Cette solidité émotionnelle est une ressource précieuse dans la vie personnelle comme professionnelle.",
      mid: "Vos émotions varient avec les événements mais vous les régulez globalement bien. Cette sensibilité est une richesse — elle vous rend probablement plus empathique — à condition de cultiver des stratégies d'apaisement.",
      low: "Vous êtes émotionnellement sensible et les tensions peuvent vous toucher profondément. Cette sensibilité est souvent associée à une grande finesse de perception. Des outils de régulation émotionnelle (méditation, thérapie) peuvent vous apporter plus de sérénité.",
    },
    conscience: {
      high: "Vous avez une conscience fine de vos émotions — vous les identifiez, les nommez, comprenez leurs déclencheurs. Cette conscience est la base de l'intelligence émotionnelle et vous aide à faire des choix alignés.",
      mid: "Vous avez une conscience émotionnelle développée sur certains aspects, moins sur d'autres. Prendre l'habitude de verbaliser vos ressentis (journal, conversations) peut affiner cette capacité.",
      low: "Identifier et comprendre vos émotions vous demande un effort. Cela peut conduire à des réactions disproportionnées ou à de la confusion intérieure. La pratique régulière de l'auto-observation peut vraiment transformer ce rapport aux émotions.",
    },
    gestion: {
      high: "Vous régulez efficacement vos émotions, même dans les situations tendues. Cette maîtrise vous permet de garder la tête froide et de prendre des décisions éclairées plutôt que réactives.",
      mid: "Vous gérez vos émotions correctement dans la plupart des situations, avec parfois des débordements lors de stress important. C'est une base saine qui peut être renforcée par des techniques spécifiques.",
      low: "Vos émotions peuvent parfois vous déborder et guider vos actions sans filtre. Développer des outils concrets (respiration, pause, reformulation) peut transformer votre rapport aux situations difficiles.",
    },
    empathie: {
      high: "Vous percevez finement les émotions et les besoins des autres, souvent avant qu'ils ne s'expriment. Cette empathie est un atout relationnel majeur — veillez à ne pas vous charger des émotions d'autrui au détriment des vôtres.",
      mid: "Vous êtes sensible aux émotions des autres dans de nombreuses situations, moins dans d'autres. Cultiver l'écoute active dans vos relations proches peut approfondir cette capacité.",
      low: "Vous accordez plus d'attention à vos propres perceptions qu'à celles des autres. Cette centration peut être travaillée par des exercices d'écoute active et de prise de perspective — compétences très utiles en contexte relationnel ou professionnel.",
    },
    social: {
      high: "Vous naviguez avec aisance dans les situations sociales, savez désamorcer les tensions et communiquer efficacement. Ces compétences sont très recherchées professionnellement comme personnellement.",
      mid: "Vous êtes à l'aise dans la plupart des contextes sociaux familiers, avec plus de réserve dans les situations nouvelles ou conflictuelles. Cette progressivité est saine.",
      low: "Les situations sociales, notamment conflictuelles, peuvent vous demander de l'énergie. Travailler la communication assertive (dire non, exprimer un désaccord) peut transformer votre confort relationnel.",
    },
    motivation: {
      high: "Vous êtes persévérant(e) et orienté(e) vers vos objectifs. Les échecs ne vous arrêtent pas et vous trouvez du sens dans ce que vous entreprenez. Cette motivation interne est un moteur puissant.",
      mid: "Votre motivation est présente mais peut fluctuer selon les contextes. Identifier ce qui vous anime profondément peut rendre cette énergie plus constante.",
      low: "Votre motivation est fragilisée actuellement — cela peut traduire une phase de transition, une perte de sens, ou une fatigue. Explorer ce qui vous donne envie d'agir (en thérapie ou en coaching) peut relancer cette énergie.",
    },
    adaptation: {
      high: "Vous vous adaptez rapidement aux changements et trouvez des ressources face à l'imprévu. Cette souplesse mentale est un atout majeur dans un monde en mouvement constant.",
      mid: "Vous vous adaptez aux changements avec un temps d'ajustement raisonnable. Cette réactivité modérée est saine — ni rigide ni dispersée.",
      low: "Les changements vous demandent du temps et de l'énergie pour être intégrés. Travailler sur la flexibilité psychologique (ACT, mindfulness) peut rendre ces transitions moins coûteuses.",
    },
    ressources: {
      high: "Vous avez accès à de solides ressources internes — confiance, lucidité, capacité à prendre soin de vous. Ces ressources sont votre socle face aux défis de la vie.",
      mid: "Vos ressources internes sont présentes mais variables selon les contextes. Les identifier précisément (ce qui vous aide, ce qui vous nourrit) peut les consolider.",
      low: "Vos ressources internes méritent d'être renforcées. Cela peut passer par un accompagnement qui vous aide à redécouvrir vos forces et à développer de nouvelles stratégies.",
    },
    soutien: {
      high: "Vous avez un réseau de soutien solide et vous savez y faire appel quand c'est nécessaire. Cette capacité à demander de l'aide est un vrai signe de maturité relationnelle.",
      mid: "Vous disposez de soutien dans votre entourage mais ne le mobilisez pas toujours pleinement. Oser demander est parfois la plus grande des forces.",
      low: "Vous comptez principalement sur vous-même, par choix ou par défaut. Explorer les relations de soutien possibles autour de vous — famille, amis, groupes, thérapeute — peut élargir vos ressources.",
    },
    sens: {
      high: "Vous donnez du sens à ce que vous vivez, y compris aux épreuves. Cette capacité à transformer l'expérience en apprentissage est une ressource majeure face à l'adversité.",
      mid: "Vous cherchez du sens aux événements, même si certaines épreuves restent difficiles à intégrer. C'est une démarche saine qui se nourrit avec le temps.",
      low: "Donner du sens aux événements difficiles vous demande beaucoup d'effort. C'est un travail à part entière qui peut être accompagné — certaines approches (logothérapie, narrative) y aident particulièrement.",
    },
  };

  const d = detailed[dim];
  if (d) {
    if (score >= 60) return d.high;
    if (score >= 40) return d.mid;
    return d.low;
  }

  // Fallback générique
  if (score >= 60) return "Score élevé sur cette dimension, qui apparaît comme une zone de ressources importante pour vous.";
  if (score >= 40) return "Score modéré — cette dimension est équilibrée et peut être développée si vous le souhaitez.";
  return "Score faible sur cette dimension — c'est un axe potentiel de développement si elle est importante pour vous.";
}

// Niveau global selon le test
function getGlobalLevel(testId, dimensions) {
  if (testId === "phq9") {
    const s = dimensions[0]?.score || 0;
    if (s < 20) return { label: "Symptômes minimes", color: "sage" };
    if (s < 40) return { label: "Symptômes légers", color: "softGold" };
    if (s < 60) return { label: "Symptômes modérés", color: "softGold" };
    if (s < 80) return { label: "Symptômes modérément sévères", color: "terracotta" };
    return { label: "Symptômes sévères", color: "terracotta" };
  }
  if (testId === "gad7") {
    const s = dimensions[0]?.score || 0;
    if (s < 25) return { label: "Anxiété minime", color: "sage" };
    if (s < 45) return { label: "Anxiété légère", color: "softGold" };
    if (s < 70) return { label: "Anxiété modérée", color: "softGold" };
    return { label: "Anxiété sévère", color: "terracotta" };
  }
  if (testId === "stress") {
    const s = dimensions[0]?.score || 0;
    if (s < 30) return { label: "Stress faible", color: "sage" };
    if (s < 55) return { label: "Stress modéré", color: "softGold" };
    return { label: "Stress élevé", color: "terracotta" };
  }
  if (testId === "types16") {
    const pairs = { EI: "", SN: "", TF: "", JP: "" };
    dimensions.forEach(d => {
      // Trouver la paire
      Object.entries(QUESTION_BANKS.types16.reduce((acc, q) => {
        acc[q.dim] = q.pair; return acc;
      }, {})).forEach(([letter, pair]) => {
        if (d.name.includes(letter) || d.dim === letter) {
          // Si ce pôle est dominant (>50%), prendre cette lettre
          if (!pairs[pair] || d.score > 50) pairs[pair] = letter;
        }
      });
    });
    // Fallback déterministe basé sur les dimensions
    const result = ["E","S","T","J"].map(l => {
      const d = dimensions.find(x => x.name && x.name.includes(l));
      return d && d.score >= 50 ? l : ({ E:"I", S:"N", T:"F", J:"P" })[l];
    }).join("");
    return { label: `Profil ${result}`, color: "terracotta" };
  }
  // Tests positifs : moyenne générale
  const avg = dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length;
  if (avg >= 70) return { label: "Profil très positif", color: "sage" };
  if (avg >= 50) return { label: "Profil équilibré", color: "softGold" };
  return { label: "Axes de développement identifiés", color: "terracotta" };
}

// Génère une synthèse détaillée en plusieurs paragraphes
function generateSummary(testId, dimensions, critical) {
  if (critical) {
    return "⚠️ Vos réponses indiquent la présence de pensées qui nécessitent une attention immédiate. Nous vous encourageons vivement à contacter un professionnel dès aujourd'hui ou à appeler le 3114 (numéro national de prévention du suicide, gratuit, confidentiel, 24h/24). Vous n'êtes pas seul(e) et une aide existe — parler est le premier pas.";
  }

  // ===== TESTS CLINIQUES =====
  if (testId === "phq9") {
    const s = dimensions[0]?.score || 0;
    if (s < 20) return "Vos réponses suggèrent un niveau de symptômes dépressifs minime. Votre humeur semble globalement stable et vous maintenez de l'intérêt pour vos activités et vos proches.\n\nCe résultat positif mérite d'être cultivé : les habitudes qui soutiennent votre santé mentale (sommeil régulier, activité physique, relations nourrissantes, moments de plaisir) valent la peine d'être préservées consciemment.\n\nSi des baisses ponctuelles de moral surviennent, cela reste normal et passager. En cas de doute futur, ce test peut être repassé pour suivre l'évolution de votre état.";
    if (s < 40) return "Vos réponses révèlent quelques symptômes dépressifs légers : baisse d'énergie, moments de tristesse, diminution d'intérêt pour certaines activités. Ces signes sont fréquents dans la population générale et souvent liés à des périodes de fatigue, de stress ou de transition.\n\nPlusieurs leviers peuvent vous aider dès maintenant : rétablir un sommeil régulier, pratiquer une activité physique même modérée (30 minutes de marche quotidienne suffit), maintenir des liens sociaux, réintroduire des activités qui vous plaisent.\n\nSi ces symptômes persistent au-delà de deux à trois semaines, ou s'ils s'intensifient, prenez contact avec un professionnel pour en parler — mieux vaut agir tôt que laisser s'installer la difficulté.";
    if (s < 60) return "Les symptômes dépressifs que vous décrivez sont d'intensité modérée et commencent probablement à impacter votre vie quotidienne — travail, relations, sommeil, appétit, énergie. C'est un signal important que votre état mérite une attention professionnelle.\n\nLa dépression modérée répond très bien à un accompagnement psychologique, notamment par les Thérapies Cognitives et Comportementales (TCC) qui ont fait leurs preuves. Dans certains cas, un suivi médical peut compléter utilement cette approche. N'attendez pas que la situation s'aggrave.\n\nEn parallèle : préservez autant que possible votre sommeil, bougez chaque jour même un peu, et osez parler de ce que vous traversez à une personne de confiance. Vous n'êtes pas seul(e).";
    return "Vos réponses révèlent une souffrance psychologique significative qui affecte probablement plusieurs domaines de votre vie. Il est important de prendre ce signal au sérieux et d'engager une démarche de soin rapidement — la dépression est une vraie maladie, qui se soigne bien avec un accompagnement adapté.\n\nNous vous encourageons à consulter votre médecin traitant dans les prochains jours, ou directement un psychiatre. Ils pourront évaluer votre situation globalement et vous orienter vers le traitement le plus adapté (psychothérapie seule, ou associée à un traitement médicamenteux si nécessaire).\n\nEn attendant cette consultation : prenez soin de vous au jour le jour, évitez l'isolement, ne culpabilisez pas de ce que vous vivez. La souffrance que vous ressentez n'est pas un signe de faiblesse — c'est un signal que votre corps et votre esprit ont besoin d'être entendus.";
  }
  if (testId === "gad7") {
    const s = dimensions[0]?.score || 0;
    if (s < 25) return "Votre niveau d'anxiété apparaît faible, ce qui traduit une bonne régulation face aux incertitudes et aux préoccupations du quotidien. Vous semblez disposer de ressources efficaces pour ne pas laisser les inquiétudes envahir votre espace mental.\n\nContinuez à entretenir ce qui vous permet de rester serein(e) : habitudes de vie équilibrées, relations soutenantes, capacité à prendre du recul. Ces ressources sont précieuses et peuvent être consciemment cultivées.";
    if (s < 45) return "Vous présentez des symptômes d'anxiété légère — inquiétudes ponctuelles, tension, difficulté à se détendre. C'est fréquent dans le rythme moderne et ne traduit pas un trouble anxieux à proprement parler.\n\nDes techniques simples peuvent significativement apaiser ces ressentis : pratique régulière de la respiration en cohérence cardiaque (5 minutes, plusieurs fois par jour), activité physique, limitation de la caféine et des écrans en soirée, méditation guidée via des applications comme Petit Bambou ou Calm.\n\nSi ces symptômes persistent ou s'intensifient, une consultation avec un psychologue peut vous aider à identifier les schémas anxieux et à développer des outils durables.";
    if (s < 70) return "Votre anxiété est d'un niveau significatif qui impacte probablement votre quotidien — sommeil perturbé, concentration difficile, tensions corporelles, inquiétudes envahissantes. Il est important d'en parler à un professionnel.\n\nLes troubles anxieux se soignent très bien. Les Thérapies Cognitives et Comportementales (TCC) et la thérapie d'acceptation et d'engagement (ACT) ont démontré leur efficacité. Un accompagnement structuré de quelques mois peut transformer votre rapport aux inquiétudes.\n\nEn attendant, quelques gestes utiles : respiration profonde lors des pics d'anxiété, écriture de vos pensées anxieuses pour les mettre à distance, activité physique régulière, réduction progressive des stimulants (café, alcool).";
    return "Le niveau d'anxiété que vous décrivez est élevé et suggère un trouble anxieux qui nécessite une prise en charge professionnelle. La bonne nouvelle : ces troubles, aussi intenses soient-ils, se traitent efficacement aujourd'hui.\n\nNous vous recommandons vivement de consulter un psychologue ou un psychiatre dans les prochaines semaines. Selon votre situation, un traitement combiné (thérapie + médication anxiolytique temporaire) peut être proposé. N'hésitez pas à en parler également à votre médecin traitant qui pourra vous orienter.\n\nDans l'immédiat : évitez de vous isoler, limitez les déclencheurs évidents quand c'est possible, et rappelez-vous que l'anxiété, même forte, est un signal que votre système de protection est hyperactivé — cela peut se rééquilibrer.";
  }
  if (testId === "stress") {
    const s = dimensions[0]?.score || 0;
    if (s < 30) return "Votre niveau de stress perçu est faible — vous disposez visiblement de ressources efficaces pour faire face aux défis du quotidien sans vous sentir dépassé(e). C'est un excellent indicateur de votre équilibre global.\n\nCe résultat reflète probablement un bon sens des priorités, une capacité à relativiser, et peut-être un contexte de vie actuellement porteur. Continuez à entretenir ce qui vous permet de traverser les tempêtes : relations, hygiène de vie, activités ressourçantes.";
    if (s < 55) return "Vous ressentez un stress modéré, qui est courant dans la vie active moderne mais mérite attention avant qu'il ne s'installe durablement. Ce niveau traduit une charge mentale ou émotionnelle que vous gérez encore, mais au prix de certains efforts.\n\nIdentifier les principales sources de stress (travail, relations, finances, charge familiale) est la première étape. Ensuite, distinguer ce qui est sous votre contrôle de ce qui ne l'est pas aide à canaliser votre énergie sur ce qui peut vraiment changer.\n\nEn parallèle : introduisez dans votre semaine des rituels de récupération non-négociables (sport, marche, méditation, temps créatif), soignez votre sommeil, et apprenez à dire non quand c'est nécessaire.";
    return "Votre niveau de stress est élevé et peut, s'il persiste, affecter votre santé physique (tensions, troubles digestifs, sommeil) et psychologique (irritabilité, fatigue, anxiété). Il est temps de ralentir et de prendre soin de vous activement.\n\nCommencez par identifier ce qui dans votre vie actuelle génère le plus de tension, et ce qui peut être allégé (charge de travail, engagements, relations toxiques). Parfois, quelques décisions fortes permettent un vrai soulagement.\n\nUn accompagnement psychologique peut être très utile pour identifier des schémas de fonctionnement qui vous maintiennent en tension (perfectionnisme, hyperresponsabilité, difficultés à déléguer) et pour développer des outils adaptés. Consultez également votre médecin si le stress impacte votre santé physique.";
  }

  // ===== TESTS DE PROFIL — synthèse en paragraphes =====
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const strong = sorted.filter(d => d.score >= 65);
  const weak = sorted.filter(d => d.score < 40);
  const mid = sorted.filter(d => d.score >= 40 && d.score < 65);

  const parts = [];

  // Paragraphe 1 : vue d'ensemble
  if (strong.length >= 2) {
    parts.push(`Votre profil se distingue par plusieurs caractéristiques marquées, notamment sur les dimensions de ${strong.slice(0, 3).map(d => d.name).join(", ")}. Ces traits constituent vos zones de force naturelle et méritent d'être consciemment cultivés dans votre vie personnelle et professionnelle.`);
  } else if (strong.length === 1) {
    parts.push(`Votre profil se distingue particulièrement par votre ${strong[0].name.toLowerCase()}. C'est une zone de force qui colore probablement de nombreuses facettes de votre vie et qui mérite d'être reconnue comme une vraie ressource.`);
  } else if (mid.length >= 3) {
    parts.push(`Votre profil révèle un équilibre général sur l'ensemble des dimensions évaluées, sans trait dominant marqué. Cette polyvalence est une forme de ressource : vous pouvez vous adapter à différents contextes sans être prisonnier(ère) d'un schéma unique.`);
  } else {
    parts.push(`Votre profil présente des scores globalement nuancés. Chaque dimension évaluée ouvre une piste de réflexion sur votre fonctionnement actuel.`);
  }

  // Paragraphe 2 : axes de développement
  if (weak.length >= 2) {
    parts.push(`Plusieurs dimensions apparaissent comme des axes de développement potentiels : ${weak.slice(0, 3).map(d => d.name).join(", ")}. Ce ne sont ni des défauts ni des faiblesses, mais des zones où un travail conscient pourrait vous apporter plus de confort, d'efficacité ou d'épanouissement selon ce qui compte pour vous.`);
  } else if (weak.length === 1) {
    parts.push(`Un axe de développement se dessine autour de la dimension ${weak[0].name.toLowerCase()}. Selon son importance dans votre vie actuelle, elle peut mériter une attention particulière — seul(e) ou avec un accompagnement professionnel.`);
  } else {
    parts.push(`Aucune dimension n'apparaît en difficulté majeure, ce qui est un signe positif d'équilibre. Vous disposez probablement de ressources variées pour faire face aux différents défis de la vie.`);
  }

  // Paragraphe 3 : invitation
  parts.push(`Ces résultats sont une photographie à un instant donné : votre personnalité évolue avec les expériences, les relations et le travail sur soi. Si vous souhaitez approfondir certaines dimensions, échanger avec une professionnelle peut vous aider à mettre ces observations en perspective et à définir des pistes concrètes adaptées à votre situation.`);

  return parts.join("\n\n");
}

// Génère des conseils pratiques selon le profil
function generateAdvice(testId, dimensions, critical) {
  if (critical) {
    return [
      { icon: "📞", title: "Appelez le 3114", text: "Numéro national de prévention du suicide — gratuit, confidentiel, 24h/24. Une écoute bienveillante est à votre disposition." },
      { icon: "👨‍⚕️", title: "Consultez rapidement", text: "Prenez rendez-vous dès cette semaine avec votre médecin traitant ou un psychiatre." },
      { icon: "🤝", title: "Ne restez pas seul(e)", text: "Parlez à une personne de confiance aujourd'hui. L'isolement aggrave la souffrance." },
    ];
  }

  // Conseils spécifiques aux tests cliniques
  if (testId === "phq9" || testId === "gad7") {
    const s = dimensions[0]?.score || 0;
    const advice = [];
    if (s < 25) {
      advice.push({ icon: "🌱", title: "Préservez ce qui fonctionne", text: "Identifiez 3 habitudes qui soutiennent votre bien-être et entretenez-les consciemment." });
      advice.push({ icon: "💤", title: "Sommeil régulier", text: "Un sommeil de qualité reste le pilier le plus sous-estimé de la santé mentale." });
      advice.push({ icon: "🏃", title: "Activité physique", text: "30 minutes par jour, même la marche suffit — efficace sur l'humeur et l'anxiété." });
    } else if (s < 60) {
      advice.push({ icon: "📝", title: "Tenez un journal", text: "Noter ce qui va et ce qui pèse aide à clarifier et à prendre du recul." });
      advice.push({ icon: "🧘", title: "Pratique de respiration", text: "Cohérence cardiaque : 5 min, 3 fois par jour — effet prouvé sur l'anxiété." });
      advice.push({ icon: "👥", title: "Parlez-en", text: "Un(e) proche, un groupe, ou un professionnel. Ne portez pas seul(e)." });
      advice.push({ icon: "📅", title: "Consultez un psychologue", text: "Ne pas attendre que ça empire — les premières séances apportent souvent un soulagement." });
    } else {
      advice.push({ icon: "👨‍⚕️", title: "Consultez rapidement", text: "Médecin traitant ou psychiatre dans les prochains jours." });
      advice.push({ icon: "🧠", title: "Thérapie recommandée", text: "Les TCC ont d'excellents résultats sur la dépression et les troubles anxieux." });
      advice.push({ icon: "🚫", title: "Réduisez les stimulants", text: "Café, alcool, écrans tardifs aggravent les symptômes." });
      advice.push({ icon: "🤝", title: "Entourage de soutien", text: "Évitez l'isolement, même quand l'envie n'est pas là." });
    }
    return advice;
  }

  if (testId === "stress") {
    const s = dimensions[0]?.score || 0;
    const advice = [];
    if (s < 30) {
      advice.push({ icon: "🌿", title: "Continuez ainsi", text: "Vos stratégies fonctionnent — reconnaissez-les consciemment." });
      advice.push({ icon: "💪", title: "Préservez votre équilibre", text: "Le stress faible aujourd'hui ne garantit pas demain : entretenez vos ressources." });
    } else if (s < 55) {
      advice.push({ icon: "📋", title: "Cartographiez vos stresseurs", text: "Identifiez les 3 principales sources de tension dans votre vie actuelle." });
      advice.push({ icon: "🧘", title: "Rituels de récupération", text: "Bloquez des moments non négociables : sport, nature, créativité, sommeil." });
      advice.push({ icon: "❌", title: "Apprenez à dire non", text: "Préserver son énergie est un acte de lucidité, pas d'égoïsme." });
      advice.push({ icon: "📱", title: "Limitez les écrans", text: "30 minutes avant le coucher et au réveil — impact direct sur le stress perçu." });
    } else {
      advice.push({ icon: "🛑", title: "Ralentissez maintenant", text: "Identifiez ce qui peut être reporté, délégué ou abandonné." });
      advice.push({ icon: "👨‍⚕️", title: "Médecin généraliste", text: "Pour évaluer l'impact physique du stress (sommeil, tensions, digestion)." });
      advice.push({ icon: "🧠", title: "Psychologue ou coach", text: "Pour identifier les schémas qui vous maintiennent en hypertension." });
      advice.push({ icon: "🌳", title: "Nature et mouvement", text: "Prouvés pour abaisser le cortisol — priorité absolue." });
    }
    return advice;
  }

  if (testId === "epuisement") {
    const fatigue = dimensions.find(d => d.name.includes("Fatigue"))?.score || 0;
    const efficacite = dimensions.find(d => d.name.includes("efficacité"))?.score || 50;
    const advice = [];
    if (fatigue > 55 || efficacite < 40) {
      advice.push({ icon: "🚨", title: "Signal d'alerte", text: "Parlez-en à votre médecin — un arrêt peut être nécessaire pour rompre le cycle." });
      advice.push({ icon: "🧠", title: "Accompagnement psychologique", text: "Le burnout se soigne, mais nécessite un travail en profondeur." });
    }
    advice.push({ icon: "⏸️", title: "Récupérer avant tout", text: "Weekends, congés, vraies pauses — sans culpabilité." });
    advice.push({ icon: "💬", title: "En parler au travail", text: "RH, médecin du travail, manager — des solutions existent souvent." });
    advice.push({ icon: "🎯", title: "Retrouver du sens", text: "Identifier ce qui vous nourrissait au travail peut rouvrir une perspective." });
    return advice;
  }

  // Conseils génériques pour les tests de profil
  const advice = [
    { icon: "📚", title: "Explorez plus loin", text: "Ces résultats sont une porte d'entrée — la connaissance de soi se construit dans le temps." },
    { icon: "🤔", title: "Observez votre quotidien", text: "Voyez dans quelles situations ces dimensions s'expriment le plus." },
    { icon: "🎯", title: "Choisissez un axe", text: "Plutôt que tout travailler, identifiez une dimension qui compte vraiment pour vous." },
    { icon: "💬", title: "Échangez avec un professionnel", text: "Un entretien permet de mettre ces résultats en perspective avec votre histoire." },
  ];
  return advice;
}

function NavBar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { key: "home", label: "Accueil" },
    { key: "tests", label: "Nos tests" },
  ];

  const navigate = (key) => { setPage(key); setMobileOpen(false); };

  return (
    <nav role="navigation" aria-label="Navigation principale" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled || mobileOpen ? "rgba(255,248,240,0.97)" : "transparent",
      backdropFilter: scrolled || mobileOpen ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.sand}` : "none",
      transition: "all 0.4s ease",
      padding: "0 clamp(1rem, 4vw, 3rem)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: 72,
      }}>
        <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={40} />
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, letterSpacing: "-0.5px",
          }}>PsychaPro</span>
        </div>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => navigate(item.key)} aria-current={page === item.key ? "page" : undefined} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
              color: page === item.key ? COLORS.terracotta : COLORS.warmGray,
              borderBottom: page === item.key ? `2px solid ${COLORS.terracotta}` : "2px solid transparent",
              paddingBottom: 4, transition: "all 0.3s",
            }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => navigate("tests")} style={{
            background: COLORS.terracotta, color: "white", border: "none",
            borderRadius: 24, padding: "10px 24px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            transition: "all 0.3s", boxShadow: "0 2px 12px rgba(196,112,75,0.3)",
          }}
            onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.target.style.transform = "translateY(0)"}
          >
            Commencer un test
          </button>
          <a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{
            background: "white", color: COLORS.terracotta, border: `1.5px solid ${COLORS.terracotta}`,
            borderRadius: 24, padding: "9px 22px", textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            transition: "all 0.3s",
          }}
            onMouseEnter={e => { e.target.style.background = `${COLORS.terracotta}10`; }}
            onMouseLeave={e => { e.target.style.background = "white"; }}
          >
            Prendre RDV
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"} style={{
          display: "none", background: "none", border: "none", cursor: "pointer",
          flexDirection: "column", gap: 5, padding: 8,
        }}>
          <span style={{ width: 24, height: 2, background: COLORS.deepBrown, borderRadius: 1, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ width: 24, height: 2, background: COLORS.deepBrown, borderRadius: 1, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: COLORS.deepBrown, borderRadius: 1, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div style={{
          padding: "8px 0 20px", borderTop: `1px solid ${COLORS.sand}`,
          animation: "fadeUp 0.3s ease",
        }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => navigate(item.key)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: page === item.key ? `${COLORS.terracotta}08` : "none",
              border: "none", cursor: "pointer", padding: "14px 16px", borderRadius: 10,
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500,
              color: page === item.key ? COLORS.terracotta : COLORS.deepBrown,
            }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => navigate("tests")} style={{
            width: "100%", marginTop: 8,
            background: COLORS.terracotta, color: "white", border: "none",
            borderRadius: 14, padding: "14px 24px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
          }}>
            Commencer un test
          </button>
          <a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{
            display: "block", width: "100%", marginTop: 8, textAlign: "center",
            background: "white", color: COLORS.terracotta, border: `1.5px solid ${COLORS.terracotta}`,
            borderRadius: 14, padding: "13px 24px", textDecoration: "none", boxSizing: "border-box",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
          }}>
            Prendre RDV →
          </a>
        </div>
      )}
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </nav>
  );
}

function Hero({ setPage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `linear-gradient(160deg, ${COLORS.cream} 0%, ${COLORS.blush} 40%, ${COLORS.sand} 100%)`,
      position: "relative", overflow: "hidden",
      padding: "100px clamp(1rem, 4vw, 3rem) 60px",
    }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute", top: "10%", right: "5%", width: 400, height: 400,
        borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.sageLight}22, transparent)`,
        filter: "blur(40px)", animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", left: "10%", width: 300, height: 300,
        borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.lavender}33, transparent)`,
        filter: "blur(50px)", animation: "float 10s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "15%", width: 200, height: 200,
        borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.terracotta}15, transparent)`,
        filter: "blur(30px)", animation: "float 6s ease-in-out infinite",
      }} />

      <div style={{
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center",
      }} className="hero-grid">
        <div style={{
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(143,166,138,0.15)", borderRadius: 20,
            padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.sage }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.sageDark, fontWeight: 500 }}>
              Tests validés scientifiquement — 100% gratuits
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 700,
            color: COLORS.deepBrown, lineHeight: 1.15, marginBottom: 24,
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
            color: COLORS.warmGray, maxWidth: 480, marginBottom: 40,
          }}>
            Des tests psychologiques reconnus et entièrement gratuits, des résultats détaillés et personnalisés,
            et la possibilité de consulter un professionnel pour aller plus loin.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => setPage("tests")} style={{
              background: COLORS.terracotta, color: "white", border: "none",
              borderRadius: 28, padding: "16px 36px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
              boxShadow: "0 4px 24px rgba(196,112,75,0.35)",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(196,112,75,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(196,112,75,0.35)"; }}
            >
              Découvrir les tests →
            </button>
            <a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{
              background: COLORS.terracotta, color: "white",
              border: "none", borderRadius: 28,
              padding: "16px 36px", cursor: "pointer", textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600,
              boxShadow: "0 4px 24px rgba(196,112,75,0.35)",
              transition: "all 0.3s", display: "inline-block",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(196,112,75,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(196,112,75,0.35)"; }}
            >
              Consulter un pro →
            </a>
          </div>
        </div>

        {/* Right side - decorative cards */}
        <div style={{
          position: "relative", height: 500,
          opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)",
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

function HowItWorks({ setPage }) {
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
          maxWidth: 500, margin: "0 auto 60px",
        }}>
          Un parcours simple et bienveillant, de la découverte de soi à l'accompagnement professionnel.
        </p>

        <div className="how-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { step: "01", icon: "📋", title: "Choisissez", desc: "Sélectionnez le test adapté à votre besoin — tous nos tests sont gratuits." },
            { step: "02", icon: "✍️", title: "Passez le test", desc: "Répondez aux questions dans un environnement calme et bienveillant." },
            { step: "03", icon: "📊", title: "Vos résultats", desc: "Consultez votre profil détaillé et téléchargez votre rapport PDF." },
            { step: "04", icon: "🎥", title: "Consultez", desc: "Prenez rendez-vous en ligne avec une professionnelle pour approfondir vos résultats." },
          ].map((item, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 20, padding: 32,
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

function TestCatalog({ setPage, setSelectedTest }) {
  const [category, setCategory] = useState("all");
  const filtered = category === "all" ? TESTS : TESTS.filter(t => t.category === category);

  return (
    <section style={{
      padding: "120px clamp(1rem, 4vw, 3rem) 80px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})`,
      minHeight: "100vh",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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
          display: "flex", gap: 8, justifyContent: "center", marginBottom: 48,
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
          gap: 24,
        }}>
          {filtered.map((test, i) => (
            <div key={test.id} style={{
              background: "white", borderRadius: 20, overflow: "hidden",
              boxShadow: "0 2px 16px rgba(61,43,31,0.06)",
              border: `1px solid ${COLORS.sand}40`,
              transition: "all 0.4s", cursor: "pointer",
              animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
            }}
              onClick={() => { setSelectedTest(test); setPage("test-detail"); }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(61,43,31,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(61,43,31,0.06)"; }}
            >
              <div style={{
                height: 6,
                background: `linear-gradient(90deg, ${test.color}, ${test.color}88)`,
              }} />
              <div style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontSize: 40 }}>{test.icon}</div>
                  <span style={{
                    background: `${test.color}18`, color: test.color,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "4px 12px", borderRadius: 12, letterSpacing: "0.3px",
                  }}>{test.badge}</span>
                </div>
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700,
                  color: COLORS.deepBrown, marginBottom: 8,
                }}>{test.name}</h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: COLORS.warmGray, lineHeight: 1.6, marginBottom: 20,
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

function TestDetail({ test, setPage }) {
  if (!test) return null;
  return (
    <section style={{
      padding: "120px clamp(1rem, 4vw, 3rem) 80px",
      background: COLORS.cream, minHeight: "100vh",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setPage("tests")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.warmGray,
          marginBottom: 32, display: "flex", alignItems: "center", gap: 8,
        }}>
          ← Retour aux tests
        </button>

        <div style={{
          background: "white", borderRadius: 24, overflow: "hidden",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)",
        }}>
          <div style={{
            height: 160,
            background: `linear-gradient(135deg, ${test.color}30, ${test.color}10)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 72,
          }}>
            {test.icon}
          </div>

          <div style={{ padding: "40px 48px" }}>
            <span style={{
              background: `${test.color}18`, color: test.color,
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
              padding: "4px 14px", borderRadius: 12,
            }}>{test.badge}</span>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 32, fontWeight: 700, color: COLORS.deepBrown,
              marginTop: 16, marginBottom: 16,
            }}>{test.name}</h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 16,
              color: COLORS.warmGray, lineHeight: 1.8, marginBottom: 32,
            }}>{test.description}</p>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
              marginBottom: 32,
            }}>
              {[
                { label: "Durée", value: test.duration, icon: "⏱" },
                { label: "Questions", value: test.questions, icon: "📝" },
                { label: "Rapport", value: "PDF inclus", icon: "📄" },
              ].map((info, i) => (
                <div key={i} style={{
                  background: COLORS.offWhite, borderRadius: 16, padding: 20,
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
              borderRadius: 16, padding: 24, marginBottom: 32,
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
              paddingTop: 24, borderTop: `1px solid ${COLORS.sand}`,
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
              <button onClick={() => setPage("take-test")} style={{
                background: COLORS.terracotta, color: "white", border: "none",
                borderRadius: 28, padding: "16px 40px", cursor: "pointer",
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


function TakeTest({ test, setPage, setTestAnswers }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  if (!test) return null;

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
      // Transmettre les réponses à la page Results
      if (setTestAnswers) setTestAnswers(newAnswers);
      setPage("results");
    }
  };

  if (total === 0) {
    return (
      <section style={{ padding: "120px 2rem", textAlign: "center", minHeight: "100vh" }}>
        <p>Ce test n'est pas encore disponible.</p>
        <button onClick={() => setPage("tests")} style={{ marginTop: 20, padding: "10px 20px", background: COLORS.terracotta, color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>Retour aux tests</button>
      </section>
    );
  }

  const q = questionBank[current];
  const progress = ((current + 1) / total) * 100;

  return (
    <section style={{
      padding: "120px clamp(1rem, 4vw, 3rem) 80px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.blush}30)`,
      minHeight: "100vh",
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ marginBottom: 40 }}>
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
          background: "white", borderRadius: 24, padding: "48px 40px",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)",
          animation: "fadeUp 0.4s ease",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", marginBottom: 24,
            background: `linear-gradient(135deg, ${test.color}20, ${test.color}08)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18,
            fontWeight: 700, color: test.color,
          }}>
            {current + 1}
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 24, fontWeight: 700, color: COLORS.deepBrown,
            marginBottom: 32, lineHeight: 1.4,
          }}>
            {q.q}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
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

function Results({ test, setPage, testAnswers }) {
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

  if (!test) return null;

  // Calcul des résultats à partir des réponses réelles (algorithme déterministe)
  const results = useMemo(() => computeResults(test.id, testAnswers || {}), [test.id, testAnswers]);

  if (!results) {
    return (
      <section style={{ padding: "120px 2rem", textAlign: "center", minHeight: "100vh" }}>
        <p>Impossible de calculer les résultats. Veuillez refaire le test.</p>
        <button onClick={() => setPage("tests")} style={{ marginTop: 20, padding: "10px 20px", background: COLORS.terracotta, color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>Retour aux tests</button>
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
        doc.text("psychapro.fr", margin, 294);
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
      padding: "120px clamp(1rem, 4vw, 3rem) 80px",
      background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})`,
      minHeight: "100vh",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: 40,
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
            borderRadius: 16, padding: 24, marginBottom: 24,
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
                <a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{ background: "white", color: COLORS.deepBrown, border: `1px solid ${COLORS.sand}`, padding: "10px 20px", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  Consulter un pro
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Score bars */}
        <div style={{
          background: "white", borderRadius: 24, padding: "40px 44px",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)", marginBottom: 24,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
          transition: "all 0.8s ease 0.2s",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 32,
          }}>Profil détaillé</h2>

          {results.dimensions.map((dim, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
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
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
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
          background: "white", borderRadius: 24, padding: "40px 44px",
          boxShadow: "0 4px 32px rgba(61,43,31,0.08)", marginBottom: 24,
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
          transition: "all 0.8s ease 0.4s",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 20,
          }}>Synthèse détaillée</h2>
          {results.summary.split("\n\n").map((paragraph, i) => (
            <p key={i} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              color: COLORS.deepBrown, lineHeight: 1.8, marginBottom: 16,
            }}>{paragraph}</p>
          ))}
          <div style={{
            marginTop: 20, padding: 14, background: COLORS.offWhite, borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.warmGray,
            lineHeight: 1.6,
          }}>
            ℹ️ <strong>Avertissement</strong> : ces résultats sont à visée informative et ne constituent pas un diagnostic médical. Ils ne remplacent pas l'avis d'un professionnel de santé.
          </div>
        </div>

        {/* Advice cards */}
        {results.advice && results.advice.length > 0 && (
          <div style={{
            background: "white", borderRadius: 24, padding: "40px 44px",
            boxShadow: "0 4px 32px rgba(61,43,31,0.08)", marginBottom: 24,
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.8s ease 0.5s",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 8,
            }}>Pistes pour aller plus loin</h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              color: COLORS.warmGray, marginBottom: 24, lineHeight: 1.6,
            }}>Quelques suggestions adaptées à votre profil — à prendre comme des invitations, non comme des prescriptions.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
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

          <a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{
            background: COLORS.terracotta, border: "none",
            borderRadius: 16, padding: "20px 24px", textDecoration: "none",
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
                Approfondir vos résultats en visio
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function sanitizeInput(value) {
  if (typeof value !== "string") return "";
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

// ============================================================
// SEO — Document title + JSON-LD
// ============================================================
const SEO_DATA = {
  home: { title: "PsychaPro — Tests psychologiques gratuits et consultations en ligne", desc: "Passez des tests psychologiques validés scientifiquement, obtenez vos résultats et consultez un professionnel en visio." },
  tests: { title: "Nos tests psychologiques gratuits — PsychaPro", desc: "Personnalité, 16 profils, compétences émotionnelles, dépistage dépression et anxiété, épuisement professionnel, estime de soi… Tests gratuits." },
  "test-detail": { title: "Détail du test — PsychaPro", desc: "Contenu et dimensions du test psychologique." },
  "take-test": { title: "Passation du test — PsychaPro", desc: "Répondez aux questions en toute confidentialité." },
  results: { title: "Vos résultats — PsychaPro", desc: "Profil psychologique détaillé et rapport PDF." },
  legal: { title: "Mentions légales — PsychaPro", desc: "Informations légales, politique de confidentialité RGPD et conditions d'utilisation de PsychaPro." },
};
function useSEO(page) {
  useEffect(() => {
    const seo = SEO_DATA[page] || SEO_DATA.home;
    document.title = seo.title;

    // Helper to set/create meta tags
    const setMeta = (attr, attrVal, content) => {
      let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, attrVal); document.head.appendChild(el); }
      el.content = content;
    };

    // Standard SEO
    setMeta("name", "description", seo.desc);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "author", "PsychaPro SAS");
    setMeta("name", "viewport", "width=device-width, initial-scale=1.0");

    // Open Graph (Facebook, LinkedIn, WhatsApp)
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.desc);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", "https://www.psychapro.fr");
    setMeta("property", "og:image", "https://www.psychapro.fr/og-image.jpg");
    setMeta("property", "og:locale", "fr_FR");
    setMeta("property", "og:site_name", "PsychaPro");

    // Twitter Cards
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.desc);
    setMeta("name", "twitter:image", "https://www.psychapro.fr/og-image.jpg");

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://www.psychapro.fr" + (page === "home" ? "" : "/" + page);

    // Language
    document.documentElement.lang = "fr";
  }, [page]);
}
function JsonLd() {
  useEffect(() => {
    const data = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "PsychaPro", "url": "https://www.psychapro.fr",
      "description": "Tests psychologiques gratuits et consultations en visioconférence avec des psychologues qualifiés.",
      "address": { "@type": "PostalAddress", "addressLocality": "Lyon", "postalCode": "69002", "addressCountry": "FR" },
      "priceRange": "Gratuit — €€", "medicalSpecialty": "Psychiatric",
      "availableService": [
        { "@type": "MedicalTest", "name": "Big Five (OCEAN)", "description": "Test de personnalité validé scientifiquement" },
        { "@type": "MedicalTest", "name": "PHQ-9", "description": "Dépistage dépression validé cliniquement" },
        { "@type": "MedicalTest", "name": "GAD-7", "description": "Dépistage anxiété validé cliniquement" },
      ],
    };
    let s = document.getElementById("jsonld-pp");
    if (!s) { s = document.createElement("script"); s.id = "jsonld-pp"; s.type = "application/ld+json"; document.head.appendChild(s); }
    s.textContent = JSON.stringify(data);
  }, []);
  return null;
}

// ============================================================
// RGPD COOKIE BANNER
// ============================================================
function CookieBanner() {
  const [visible, setVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Consentement cookies" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "rgba(61,43,31,0.97)", backdropFilter: "blur(12px)",
      padding: "20px clamp(1rem, 4vw, 3rem)", borderTop: `2px solid ${COLORS.terracotta}`,
      animation: "slideUp 0.4s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0 }}>
              🍪 PsychaPro utilise des cookies strictement nécessaires et, avec votre accord, des cookies d'analyse anonymisée. Vos données sont traitées conformément au RGPD.{" "}
              <button onClick={() => setShowDetails(!showDetails)} style={{ background: "none", border: "none", color: COLORS.terracottaLight, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: "underline", padding: 0 }}>En savoir plus</button>
            </p>
            {showDetails && (
              <div style={{ marginTop: 12, padding: 16, background: "rgba(255,255,255,0.06)", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                <strong style={{ color: "white" }}>Cookies nécessaires</strong> : session, préférences, sécurité CSRF (toujours actifs).<br />
                <strong style={{ color: "white" }}>Cookies analytiques</strong> : audience anonymisée (requièrent consentement).<br />
                Aucune donnée vendue ou partagée à des fins publicitaires.
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button onClick={() => setVisible(false)} style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>Refuser</button>
            <button onClick={() => setVisible(false)} style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>Nécessaires uniquement</button>
            <button onClick={() => setVisible(false)} style={{ background: COLORS.terracotta, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>Tout accepter</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ============================================================
// MENTIONS LÉGALES — Conformité loi française
// ============================================================
function MentionsLegales({ setPage, activeLegal }) {
  const [tab, setTab] = useState(activeLegal || "mentions");
  const P = ({ children, small }) => <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: small ? 12 : 14, color: small ? COLORS.warmGray : COLORS.deepBrown, lineHeight: 1.8, marginBottom: 12 }}>{children}</p>;
  const H3 = ({ children }) => <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.deepBrown, marginTop: 28, marginBottom: 10 }}>{children}</h3>;

  return (
    <section style={{ padding: "120px clamp(1rem, 4vw, 3rem) 80px", background: `linear-gradient(180deg, ${COLORS.cream}, ${COLORS.warmWhite})`, minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setPage("home")} aria-label="Retour à l'accueil" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.warmGray, marginBottom: 24 }}>← Retour à l'accueil</button>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 24 }}>Informations légales</h1>

        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {[{ key: "mentions", label: "Mentions légales" }, { key: "rgpd", label: "Politique de confidentialité" }, { key: "cgv", label: "Conditions d'utilisation" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? COLORS.terracotta : "white", color: tab === t.key ? "white" : COLORS.deepBrown,
              border: `1px solid ${tab === t.key ? COLORS.terracotta : COLORS.sand}`, borderRadius: 12, padding: "10px 20px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: "40px 44px", boxShadow: "0 2px 16px rgba(61,43,31,0.06)" }} className="legal-content">

          {tab === "mentions" && (<article>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 20 }}>Mentions légales</h2>
            <P small>Conformément à la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (LCEN), articles 6-III et 19.</P>

            <H3>1. Éditeur du site</H3>
            <P>
              Le site <strong>psychapro.fr</strong> est édité par :<br />
              <strong>Astrid Quémener</strong> — Entrepreneure individuelle<br />
              Adresse professionnelle : [à compléter]<br />
              SIRET : [numéro à compléter après immatriculation]<br />
              Directrice de la publication : Astrid Quémener<br />
              Contact : contact@psychapro.fr
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
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 20 }}>Politique de confidentialité</h2>
            <P small>Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la Loi Informatique et Libertés du 6 janvier 1978 modifiée.</P>

            <H3>1. Responsable du traitement</H3>
            <P>
              Le responsable du traitement des données est <strong>Astrid Quémener</strong>, entrepreneure individuelle, éditrice du site psychapro.fr.<br />
              Pour toute question relative à vos données : <strong>contact@psychapro.fr</strong>
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
              Pour exercer ces droits, écrivez à <strong>contact@psychapro.fr</strong>. Une réponse vous sera apportée dans un délai maximum de 30 jours.
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
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: COLORS.deepBrown, marginBottom: 20 }}>Conditions Générales d'Utilisation</h2>
            <P small>En vigueur à compter du [date à compléter]. Le site psychapro.fr ne vendant aucun bien ni service payant, il n'y a pas de CGV (Conditions Générales de Vente) à proprement parler — les présentes CGU régissent l'accès et l'usage gratuit du site.</P>

            <H3>1. Objet</H3>
            <P>
              Les présentes Conditions Générales d'Utilisation (CGU) encadrent l'accès au site <strong>psychapro.fr</strong> et l'utilisation des questionnaires psychologiques gratuits qui y sont proposés. En naviguant sur le site, vous acceptez ces conditions sans réserve.
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
              Le bouton « Prendre RDV » vous redirige vers un service tiers de prise de rendez-vous en ligne (<a href="https://rdv.itiaki.com/astrid-quemener" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.terracotta }}>rdv.itiaki.com/astrid-quemener</a>). À partir de ce clic, vous quittez psychapro.fr et acceptez les conditions propres à cette plateforme.
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
              Pour toute question relative aux présentes CGU : <strong>contact@psychapro.fr</strong>
            </P>
          </article>)}
        </div>

        <div style={{ marginTop: 32, padding: 24, background: "white", borderRadius: 16, boxShadow: "0 2px 16px rgba(61,43,31,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 24 }}>📞</span>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: COLORS.deepBrown }}>Une question juridique ou une demande RGPD ?</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.warmGray }}>contact@psychapro.fr · Réponse sous 30 jours</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ setPage }) {
  return (
    <footer role="contentinfo" style={{
      background: COLORS.deepBrown, padding: "60px clamp(1rem, 4vw, 3rem) 40px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48,
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
            { label: "Personnalité", action: () => setPage("tests") },
            { label: "Santé mentale", action: () => setPage("tests") },
            { label: "Bien-être", action: () => setPage("tests") },
            { label: "Relations", action: () => setPage("tests") },
          ]},
          { title: "Services", links: [
            { label: "Prendre rendez-vous", action: () => window.open("https://rdv.itiaki.com/astrid-quemener", "_blank") },
            { label: "Rapport PDF", action: () => setPage("tests") },
            { label: "Nos tests", action: () => setPage("tests") },
          ]},
          { title: "Légal", links: [
            { label: "Mentions légales", action: () => setPage("legal") },
            { label: "Confidentialité (RGPD)", action: () => setPage("legal-rgpd") },
            { label: "Conditions d'utilisation", action: () => setPage("legal-cgv") },
            { label: "Contact", action: () => {} },
          ]},
        ].map((col, i) => (
          <div key={i}>
            <h4 style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
              color: "white", marginBottom: 16, textTransform: "uppercase",
              letterSpacing: "1px",
            }}>{col.title}</h4>
            {col.links.map((link, j) => (
              <div key={j} onClick={link.action} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: "rgba(255,255,255,0.45)", marginBottom: 10,
                cursor: "pointer", transition: "color 0.3s",
              }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}
              >{link.label}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: 1200, margin: "40px auto 0", paddingTop: 24,
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

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTest, setSelectedTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});

  useSEO(page);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: COLORS.cream, minHeight: "100vh",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <JsonLd />

      {/* Skip to content — accessibility */}
      <a href="#main-content" style={{
        position: "absolute", top: -60, left: 8, zIndex: 999,
        background: COLORS.terracotta, color: "white", padding: "10px 20px",
        borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
        textDecoration: "none", transition: "top 0.2s",
      }}
        onFocus={e => e.target.style.top = "8px"}
        onBlur={e => e.target.style.top = "-60px"}
      >Aller au contenu principal</a>

      {/* Global responsive + a11y styles */}
      <style>{`
        /* Responsive breakpoints */
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
          .how-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          .pro-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .detail-info-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
          .legal-content { padding: 24px 20px !important; }
        }
        @media (max-width: 600px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .hero-stats { flex-direction: column !important; gap: 16px !important; }
          .confirm-bar { flex-direction: column !important; text-align: center !important; }
          .cookie-actions { flex-direction: column !important; width: 100% !important; }
          .cookie-actions button { width: 100% !important; }
          .result-actions { grid-template-columns: 1fr !important; }
        }
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
        /* Focus visible for keyboard navigation */
        *:focus-visible { outline: 3px solid ${COLORS.terracotta}; outline-offset: 2px; border-radius: 4px; }
        /* Smooth scroll preference */
        html { scroll-behavior: smooth; }
        /* Print styles */
        @media print {
          nav, footer, .cookie-banner { display: none !important; }
          main { padding-top: 0 !important; }
        }
      `}</style>

      <NavBar page={page} setPage={setPage} />

      <main role="main" id="main-content">
        {page === "home" && (
          <>
            <Hero setPage={setPage} />
            <HowItWorks setPage={setPage} />
            <TestCatalog setPage={setPage} setSelectedTest={setSelectedTest} />
          </>
        )}
        {page === "tests" && <TestCatalog setPage={setPage} setSelectedTest={setSelectedTest} />}
        {page === "test-detail" && <TestDetail test={selectedTest} setPage={setPage} />}
        {page === "take-test" && <TakeTest test={selectedTest} setPage={setPage} setTestAnswers={setTestAnswers} />}
        {page === "results" && <Results test={selectedTest} setPage={setPage} testAnswers={testAnswers} />}
        {page === "legal" && <MentionsLegales setPage={setPage} activeLegal="mentions" />}
        {page === "legal-rgpd" && <MentionsLegales setPage={setPage} activeLegal="rgpd" />}
        {page === "legal-cgv" && <MentionsLegales setPage={setPage} activeLegal="cgv" />}
      </main>

      <Footer setPage={setPage} />
      <CookieBanner />
    </div>
  );
}
