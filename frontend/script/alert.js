

// Clé API PRIM (compte gratuit sur prim.iledefrance-mobilites.fr)
const PRIM_API_KEY = "CGnvto2erSxnpK3I2UJHT66c2yKRcf8U";

const PRIM_ENDPOINT =
  "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia/line_reports/line_reports" +
  "?count=300" +
  "&forbidden_uris[]=physical_mode:Bus" +
  "&forbidden_uris[]=physical_mode:Coach" +
  "&forbidden_uris[]=physical_mode:LocalTrain" +
  "&forbidden_uris[]=physical_mode:Train";

const AUTO_REFRESH_MS = 2 * 60 * 1000; // 2 minutes

let currentDisruptions = [];
let currentMode = "tous";
let autoRefreshTimer = null;

// -------- Références DOM --------
const container = document.getElementById("alert_ratp");
const statutEl = document.getElementById("alerte_statut");
const refreshBtn = document.getElementById("refresh_btn");
const filtresEl = document.getElementById("alerte_filtres");

// -------- Initialisation --------
document.addEventListener("DOMContentLoaded", () => {
  chargerAlertes();
  demarrerAutoRefresh();

  refreshBtn.addEventListener("click", () => chargerAlertes());

  filtresEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    filtresEl.querySelectorAll("button[data-mode]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
    afficherAlertes(currentDisruptions);
  });
});

function demarrerAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(chargerAlertes, AUTO_REFRESH_MS);
}

// -------- Récupération des données --------
async function chargerAlertes() {
  afficherStatut("Chargement des données de trafic en direct…", "chargement");

  try {
    const response = await fetch(PRIM_ENDPOINT, {
      method: "GET",
      headers: { apikey: PRIM_API_KEY },
    });

    if (response.status === 401 || response.status === 403) {
      afficherStatut(
        "Clé API refusée (401/403). Vérifiez qu'elle est correcte et bien activée sur le compte PRIM.",
        "erreur"
      );
      return;
    }

    if (response.status === 429) {
      afficherStatut(
        "Quota de requêtes PRIM dépassé pour aujourd'hui (429). Réessayez plus tard.",
        "erreur"
      );
      return;
    }

    if (!response.ok) {
      afficherStatut(
        `Erreur lors de la récupération des données (code ${response.status}).`,
        "erreur"
      );
      return;
    }

    const data = await response.json();
    currentDisruptions = extraireDisruptions(data);
    afficherAlertes(currentDisruptions);

    const heure = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    afficherStatut(`Dernière actualisation à ${heure} · trafic en direct (source PRIM / IDFM)`, "ok");
  } catch (err) {
    console.error("Erreur alert.js :", err);
    afficherStatut(
      "Impossible de contacter l'API PRIM (réseau, CORS ou clé invalide). Vérifiez la connexion.",
      "erreur"
    );
  }
}

// -------- Transformation des données Navitia --------
function extraireDisruptions(data) {
  const disruptions = Array.isArray(data.disruptions) ? data.disruptions : [];
  const cartes = [];

  disruptions.forEach((d) => {
    if (d.status && d.status !== "active") return;

    const impacted = Array.isArray(d.impacted_objects) ? d.impacted_objects : [];

    // On ne garde que les objets de type "ligne" (on ignore réseaux/arrêts isolés)
    const lignesConcernees = impacted
      .map((io) => io.pt_object)
      .filter((obj) => obj && obj.embedded_type === "line" && obj.line);

    if (lignesConcernees.length === 0) return;

    const severite = mapSeverite(d.severity);
    const message = extraireMessage(d.messages);
    const dateMaj = formaterDateRelative(d.updated_at);

    lignesConcernees.forEach((obj) => {
      const line = obj.line;
      const modeCategorie = categoriserMode(line);

      // On ne garde que métro / RER-train / tramway (les bus sont déjà exclus côté API,
      // ceci filtre aussi tout ce qui ne rentrerait dans aucune de ces catégories)
      if (!["metro", "rer", "tram"].includes(modeCategorie)) return;

      const nomMode = (line.commercial_mode && line.commercial_mode.name) || "";
      const nomLigne = decoderEntitesHtml(`${nomMode} ${line.code || line.name || ""}`.trim());

      cartes.push({
        ligne: nomLigne || "Ligne",
        modeCategorie,
        gravite: severite.gravite,
        badge: severite.badge,
        description: message || "Aucun détail supplémentaire fourni.",
        meta: dateMaj,
        ordre: severite.ordre,
      });
    });
  });

  // Tri : interruptions d'abord, puis ralentissements, puis infos
  cartes.sort((a, b) => a.ordre - b.ordre);

  // On évite les doublons stricts (même ligne + même description)
  const vues = new Set();
  return cartes.filter((c) => {
    const cle = c.ligne + "|" + c.description;
    if (vues.has(cle)) return false;
    vues.add(cle);
    return true;
  });
}

function categoriserMode(line) {
  const mode = ((line.commercial_mode && line.commercial_mode.name) || "").toLowerCase();
  const texte = mode;

  if (texte.includes("métro") || texte.includes("metro")) return "metro";
  if (texte.includes("rer")) return "rer";
  if (texte.includes("tram")) return "tram";
  if (texte.includes("bus") || texte.includes("car")) return "bus";
  return "autre";
}

function mapSeverite(severity) {
  const effect = severity && severity.effect ? severity.effect : "UNKNOWN_EFFECT";
  const nomOfficiel = severity && severity.name ? severity.name : "";

  const table = {
    NO_SERVICE: { gravite: "interrompu", badge: "Trafic interrompu", ordre: 0 },
    SIGNIFICANT_DELAYS: { gravite: "ralentissement", badge: "Trafic ralenti", ordre: 1 },
    REDUCED_SERVICE: { gravite: "ralentissement", badge: "Trafic perturbé", ordre: 1 },
    DETOUR: { gravite: "ralentissement", badge: "Déviation", ordre: 1 },
    MODIFIED_SERVICE: { gravite: "info", badge: "Service modifié", ordre: 2 },
    STOP_MOVED: { gravite: "info", badge: "Arrêt déplacé", ordre: 2 },
    ADDITIONAL_SERVICE: { gravite: "info", badge: "Information", ordre: 2 },
    OTHER_EFFECT: { gravite: "info", badge: "Information", ordre: 2 },
    UNKNOWN_EFFECT: { gravite: "info", badge: "Information", ordre: 2 },
    NO_EFFECT: { gravite: "info", badge: "Information", ordre: 2 },
  };

  const defaut = table[effect] || table.UNKNOWN_EFFECT;
  return {
    gravite: defaut.gravite,
    badge: nomOfficiel ? capitaliser(decoderEntitesHtml(nomOfficiel)) : defaut.badge,
    ordre: defaut.ordre,
  };
}

function extraireMessage(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return "";

  let meilleur = "";
  messages.forEach((m) => {
    const texte = nettoyerTexte(m.text || "");
    if (texte.length > meilleur.length) meilleur = texte;
  });
  return meilleur;
}

function nettoyerTexte(texteBrut) {
  return decoderEntitesHtml(texteBrut.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decoderEntitesHtml(str) {
  return str
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function formaterDateRelative(navitiaDate) {
  if (!navitiaDate) return "Date inconnue";
  // Format Navitia : "20260701T101112"
  const m = navitiaDate.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/);
  if (!m) return "Date inconnue";
  const [, y, mo, d, h, mi, s] = m;
  const date = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "Mis à jour à l'instant";
  if (diffMin < 60) return `Mis à jour il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  const resteMin = diffMin % 60;
  if (diffH < 24) {
    return resteMin > 0
      ? `Mis à jour il y a ${diffH} h ${resteMin}`
      : `Mis à jour il y a ${diffH} h`;
  }
  const diffJ = Math.floor(diffH / 24);
  return `Mis à jour il y a ${diffJ} j`;
}

function capitaliser(texte) {
  if (!texte) return texte;
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

// -------- Affichage --------
function afficherAlertes(cartes) {
  const filtrees =
    currentMode === "tous" ? cartes : cartes.filter((c) => c.modeCategorie === currentMode);

  container.innerHTML = "";

  if (filtrees.length === 0) {
    const vide = document.createElement("p");
    vide.className = "alerte_vide";
    vide.textContent =
      currentDisruptions.length === 0
        ? "Trafic normal : aucune perturbation en cours sur le réseau."
        : "Aucune perturbation pour ce mode de transport actuellement.";
    container.appendChild(vide);
    return;
  }

  filtrees.forEach((c) => {
    const carte = document.createElement("div");
    carte.className = "alerte_carte";
    carte.dataset.gravite = c.gravite;

    carte.innerHTML = `
      <div class="alerte_carte_header">
        <span class="alerte_ligne">${escapeHtml(c.ligne)}</span>
        <span class="alerte_badge">${escapeHtml(c.badge)}</span>
      </div>
      <p class="alerte_description">${escapeHtml(c.description)}</p>
      <p class="alerte_meta">${escapeHtml(c.meta)}</p>
    `;

    container.appendChild(carte);
  });
}

function afficherStatut(texte, type) {
  statutEl.textContent = texte;
  statutEl.className = "alerte_statut alerte_statut_" + type;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
