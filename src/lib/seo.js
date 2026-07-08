import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://monpsy.click";

function setMeta(attr, attrVal, content) {
  let el = document.querySelector(`meta[${attr}="${attrVal}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, attrVal); document.head.appendChild(el); }
  el.content = content;
}

// Call from each page component with that page's own title/description.
// indexable defaults to true; pass false for /tests/:slug/passer, /tests/:slug/resultats, and the 404 page.
export function useSEO({ title, description, indexable = true }) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", indexable ? "index, follow" : "noindex, nofollow");
    setMeta("name", "author", "PsychaPro SAS");
    setMeta("name", "viewport", "width=device-width, initial-scale=1.0");

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", SITE_URL + location.pathname);
    setMeta("property", "og:image", SITE_URL + "/og-image.jpg");
    setMeta("property", "og:locale", "fr_FR");
    setMeta("property", "og:site_name", "PsychaPro");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", SITE_URL + "/og-image.jpg");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = SITE_URL + location.pathname;

    document.documentElement.lang = "fr";
  }, [title, description, indexable, location.pathname]);
}

export function JsonLd() {
  useEffect(() => {
    const data = { "@context": "https://schema.org", "@type": "MedicalBusiness", "name": "PsychaPro", "url": SITE_URL,
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
