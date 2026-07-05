console.log("script chargé");

const coordonnees = {}
let map = null;
let routeLayer = null;
let markersLayer = null;

let selectedCostType = "TIME";

const lineColors = {
  // Métro
  "1": "#FFCE00",
  "2": "#0064B0",
  "3": "#9F9825",
  "3bis": "#98D4E2",
  "4": "#C04191",
  "5": "#F28E42",
  "6": "#83C491",
  "7": "#F3A4BA",
  "7bis": "#83C491",
  "8": "#CEADD2",
  "9": "#D5C900",
  "10": "#E3B32A",
  "11": "#8D5E2A",
  "12": "#00814F",
  "13": "#98D4E2",
  "14": "#662483",

  // RER
  "A": "#E3051C",
  "B": "#5291CE",
  "C": "#FFCE00",
  "D": "#00814F",
  "E": "#C04191",

  // Tramway
  "T1": "#0064B0",
  "T2": "#C04191",
  "T3a": "#F28E42",
  "T3b": "#00814F",
  "T4": "#E3B32A",
  "T5": "#662483",
  "T6": "#E3051C",
  "T7": "#8D5E2A",
  "T8": "#9F9825",
  "T9": "#5291CE",
  "T10": "#9F9825",
  "T11": "#F28E42",
  "T12": "#B90845",
  "T13": "#8D5E2A",
  "T14": "#00A88F",

  // Transilien / Train
  "H": "#8D5E2A",
  "J": "#D5C900",
  "K": "#9F9825",
  "L": "#CEADD2",
  "N": "#00A88F",
  "P": "#F28E42",
  "R": "#F3A4BA",
  "U": "#B90845",
  "V": "#9F9825",

  // Placeholder
  "TER": "#25303B",
  "Train": "#25303B",
  "Transilien": "#25303B"
};

function normalizeLineKey(ligne) {
  if (!ligne) {
    return "";
  }

  return ligne
      .replace("Métro", "")
      .replace("Metro", "")
      .replace("Ligne", "")
      .replace("RER", "")
      .replace("TER", "TER")
      .replace("Train", "Train")
      .trim();
}

function getLineColor(ligne) {
  const key = normalizeLineKey(ligne);
  return lineColors[key] || "#2368a8";
}

let stationsByLabel = new Map();

function getStationLabel(station) {
  return `${station.name} [${station.line}]`;
}

async function chargerStations() {
  const response = await fetch("http://localhost:8080/api/stations");

  if (!response.ok) {
    throw new Error("Impossible de charger les stations");
  }

  const stations = await response.json();
  const datalist = document.getElementById("station-list");

  datalist.innerHTML = "";
  stationsByLabel.clear();

  stations.forEach((station) => {
    const label = getStationLabel(station);

    stationsByLabel.set(label, station.id);

    const option = document.createElement("option");
    option.value = label;
    datalist.appendChild(option);
  });
}

function afficherTrajet(trajet) {
  const timeline = document.getElementById("timeline_trajet");

  timeline.innerHTML = "";

  trajet.forEach((etape, index) => {
    const estDerniere = index === trajet.length - 1;
    const color = getLineColor(etape.ligne);

    timeline.innerHTML += `
      <div class="etape">
        <div class="ligne_visuelle">
          <div class="point_station" style="border-color: ${color};"></div>
          ${
        !estDerniere
            ? `<div class="segment" style="background: ${color};"></div>`
            : ""
    }
        </div>

        <div class="contenu_station">
          <p class="nom_station">${etape.station}</p>
          <p class="info_ligne">${etape.ligne}</p>
          ${etape.changement ? '<span class="changement">Correspondance</span>' : ""}
        </div>
      </div>
    `;
  });
}

function getEtapePosition(etape) {
  if (etape.latitude != null && etape.longitude != null) {
    return [etape.latitude, etape.longitude];
  }

  return coordonnees[etape.station];
}

function initialiserCarte(positionDepart) {
  if (map) {
    return;
  }

  map = L.map("map", {
    zoomControl: true,
  }).setView(positionDepart, 13);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    },
  ).addTo(map);
}

function afficherCarte(trajet) {
  const points = trajet
      .map(getEtapePosition)
      .filter((position) => position != null);

  if (points.length === 0) {
    console.warn("Aucune coordonnée disponible pour ce trajet.");
    return;
  }

  initialiserCarte(points[0]);

  if (routeLayer) {
    map.removeLayer(routeLayer);
  }

  if (markersLayer) {
    map.removeLayer(markersLayer);
  }

  routeLayer = L.layerGroup().addTo(map);
  markersLayer = L.layerGroup().addTo(map);

  for (let i = 0; i < points.length - 1; i++) {
    const color = getLineColor(trajet[i].ligne);

    L.polyline([points[i], points[i + 1]], {
      color: color,
      weight: 5,
      opacity: 0.8,
    }).addTo(routeLayer);
  }

  trajet.forEach((etape, index) => {
    const position = getEtapePosition(etape);

    if (!position) {
      return;
    }

    const color = getLineColor(etape.ligne);

    const marker = L.circleMarker(position, {
      radius: 7,
      color: color,
      weight: 2,
      fill: true,
      fillColor: color,
      fillOpacity: 1,
    }).addTo(markersLayer);

    marker.bindPopup(`
      <b>${etape.station}</b><br>
      ${etape.ligne}
    `);

    if (index === 0) {
      marker.openPopup();
    }
  });

  // Pin distinctif sur la station d'arrivée, cohérent avec le point rouge
  // utilisé dans le formulaire de recherche.
  const dernierePosition = points[points.length - 1];
  const derniereEtape = trajet[trajet.length - 1];

  const pinArrivee = L.divIcon({
    className: "pin-arrivee",
    html: '<div class="pin-arrivee-forme"></div>',
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -34],
  });

  L.marker(dernierePosition, { icon: pinArrivee })
    .addTo(markersLayer)
    .bindPopup(`
      <b>${derniereEtape.station}</b><br>
      Arrivée
    `);

  map.fitBounds(points, {
    padding: [40, 40],
  });
}


function convertirRouteBackend(route) {
  const trajet = [];

  if (route.length === 0) {
    return trajet;
  }

  trajet.push({
    station: route[0].fromStation.name,
    ligne: route[0].fromStation.line,
    changement: false,
    latitude: route[0].fromStation.latitude,
    longitude: route[0].fromStation.longitude,
  });

  route.forEach((edge) => {
    trajet.push({
      station: edge.toStation.name,
      ligne: edge.toStation.line,
      changement: edge.travelType === "TRANSFER",
      latitude: edge.toStation.latitude,
      longitude: edge.toStation.longitude,
    });
  });

  return trajet;
}

const TRANSFER_WAIT_MINUTES = 5;
const STOP_TIME_MINUTES = 40 / 60;

function calculerDuree(route) {
  const total = route.reduce((sum, edge) => {
    let edgeTime = Number(edge.timeCost) || 0;

    if (edge.travelType === "TRANSFER") {
      edgeTime += TRANSFER_WAIT_MINUTES;
    } else {
      edgeTime += STOP_TIME_MINUTES;
    }

    return sum + edgeTime;
  }, 0);

  return Math.round(total);
}

function calculerCo2(route) {
  const total = route.reduce((sum, edge) => {
    return sum + (Number(edge.pollutionCost) || 0);
  }, 0);
  if (total < 1000) {
    return `${total.toFixed(1)} g`;
  }

  return `${(total / 1000).toFixed(2)} kg`;
}

function compterChangements(route) {
  return route.filter((edge) => edge.travelType === "TRANSFER").length;
}

function formatLineLabel(ligne) {
  const key = normalizeLineKey(ligne);

  if (/^\d/.test(key)) {
    return `L${key}`;
  }

  return key;
}

function getLignesResume(trajet) {
  const lignes = [];

  trajet.forEach((etape) => {
    const ligne = formatLineLabel(etape.ligne);

    if (ligne && lignes[lignes.length - 1] !== ligne) {
      lignes.push(ligne);
    }
  });

  return lignes.join(" -> ");
}

document.addEventListener("DOMContentLoaded", () => {
  initialiserCarte([48.8566, 2.3522]);

  const form = document.getElementById("route-form");
  const results = document.getElementById("route-results");
  const departInput = document.getElementById("depart-input");
  const arriveeInput = document.getElementById("arrivee-input");
  const costButtons = document.querySelectorAll(".cost-option");
  const trajetResult = document.getElementById("trajet-result");
  const routeDetailsPanel = document.getElementById("route-details-panel");
  const nbItineraires = document.getElementById("nb_itineraires");

  if (results) {
    results.innerHTML = "";
  }

  const timeline = document.getElementById("timeline_trajet");
  if (timeline) {
    timeline.innerHTML = "";
  }

  if (nbItineraires) {
    nbItineraires.textContent = "0";
  }

  if (trajetResult) {
    trajetResult.classList.add("hidden");
  }

  if (routeDetailsPanel) {
    routeDetailsPanel.classList.add("hidden");
  }

  costButtons.forEach((button) => {
    button.addEventListener("click", () => {
      costButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      selectedCostType = button.dataset.costType;
    });
  });

  chargerStations().catch((error) => {
    console.error(error);
  });

  if (!form || !results) {
    console.warn("Formulaire ou zone de résultat introuvable.");
    return;
  }

  const swapButton = document.querySelector(".swap");

  if (swapButton) {
    swapButton.addEventListener("click", () => {
      const valeurDepart = departInput.value;
      departInput.value = arriveeInput.value;
      arriveeInput.value = valeurDepart;
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fromId = stationsByLabel.get(departInput.value);
    const toId = stationsByLabel.get(arriveeInput.value);

    if (!fromId || !toId) {
      if (trajetResult) {
        trajetResult.classList.remove("hidden");
      }

      if (routeDetailsPanel) {
        routeDetailsPanel.classList.add("hidden");
      }

      results.innerHTML = `
        <article class="itineraire">
          <h3>Station inconnue</h3>
          <p>Choisis une station proposée dans la liste.</p>
        </article>
      `;
      return;
    }

    try {
      const response = await fetch(
          `http://localhost:8080/api/route?from=${fromId}&to=${toId}&costType=${selectedCostType}`
      );

      if (!response.ok) {
        throw new Error("Erreur backend");
      }

      const route = await response.json();
      const trajet = convertirRouteBackend(route);

      if (route.length === 0 || trajet.length === 0) {
        if (trajetResult) {
          trajetResult.classList.remove("hidden");
        }

        if (routeDetailsPanel) {
          routeDetailsPanel.classList.add("hidden");
        }

        results.innerHTML = `
          <article class="itineraire">
            <h3>Aucun trajet trouvé</h3>
            <p>Aucun itinéraire n'a pu être calculé entre ces deux stations.</p>
          </article>
        `;
        return;
      }

      afficherTrajet(trajet);
      afficherCarte(trajet);

      if (trajetResult) {
        trajetResult.classList.remove("hidden");
      }

      if (routeDetailsPanel) {
        routeDetailsPanel.classList.remove("hidden");
      }

      if (nbItineraires) {
        nbItineraires.textContent = "1";
      }

      const duree = calculerDuree(route);
      const co2 = calculerCo2(route);
      const changements = compterChangements(route);
      const lignesResume = getLignesResume(trajet);

      results.innerHTML = `
        <article class="itineraire" data-type="optimal">
          <div class="itineraire_header">
            <span class="badge">Optimal</span>
            <span class="co2">${co2}</span>
          </div>

          <h3 class="duree">${duree} min</h3>

          <p class="details">
            ${trajet.length} stations - ${changements} changement${changements > 1 ? "s" : ""} - ${lignesResume}
          </p>
        </article>
      `;
    } catch (error) {
      console.error(error);

      if (trajetResult) {
        trajetResult.classList.remove("hidden");
      }

      if (routeDetailsPanel) {
        routeDetailsPanel.classList.add("hidden");
      }

      results.innerHTML = `
        <article class="itineraire">
          <h3>Erreur</h3>
          <p>Impossible de récupérer l'itinéraire depuis le backend.</p>
        </article>
      `;
    }
  });
});

const fenetre = document.querySelector(".fenetre-flottante");
const closeButton = document.querySelector(".fenetre-close");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

if (closeButton) {
  closeButton.addEventListener("mousedown", function (e) {
    e.stopPropagation();
  });

  closeButton.addEventListener("click", function () {
    fenetre.style.display = "none";
  });
}

fenetre.addEventListener("mousedown", function (e) {
  isDragging = true;

  offsetX = e.clientX - fenetre.offsetLeft;
  offsetY = e.clientY - fenetre.offsetTop;

  fenetre.style.cursor = "grabbing";
});

document.addEventListener("mousemove", function (e) {
  if (!isDragging) return;

  fenetre.style.left = e.clientX - offsetX + "px";
  fenetre.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", function () {
  isDragging = false;
  fenetre.style.cursor = "grab";
});
