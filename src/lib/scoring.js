import { QUESTION_BANKS, DIMENSION_LABELS, getAnswerOptions } from "../data/questionBanks.js";

export function computeResults(testId, answers) {
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

export function getDimensionDescription(testId, dim, score) {
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

export function getGlobalLevel(testId, dimensions) {
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

export function generateSummary(testId, dimensions, critical) {
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

export function generateAdvice(testId, dimensions, critical) {
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
