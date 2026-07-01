console.log("script chargé");

const trajetTest = [
  { station: "EFREI Paris", ligne: "Métro 7", changement: false },
  { station: "Kremlin-Bicêtre", ligne: "Métro 7", changement: false },
  { station: "Place d'Italie", ligne: "Métro 7 → Métro 5", changement: true },
  { station: "Châtelet", ligne: "Métro 1", changement: false },
];

const coordonnees = {
  "EFREI Paris": [48.7889, 2.363],
  "Kremlin-Bicêtre": [48.8103, 2.3629],
  "Place d'Italie": [48.8315, 2.3557],
  Châtelet: [48.8586, 2.347],
};

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

function afficherCarte(trajet) {
  const depart = coordonnees[trajet[0].station];

  const map = L.map("map", {
    zoomControl: true,
  }).setView(depart, 13);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    },
  ).addTo(map);

  const points = [];

  trajet.forEach((etape, index) => {
    const position = coordonnees[etape.station];
    points.push(position);

    const marker = L.circleMarker(position, {
      radius: 7,
      color: "#2368a8",
      weight: 3,
      fillColor: "#2368a8",
      fill : true,
      fillOpacity: 1,
    }).addTo(map);

    marker.bindPopup(`
      <b>${etape.station}</b><br>
      ${etape.ligne}
    `);

    if (index === 0) {
      marker.openPopup();
    }
  });

  L.polyline(points, {
    color: "#2368a8",
    weight: 5,
    opacity: 1,
  }).addTo(map);

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
  });

  route.forEach((edge) => {
    trajet.push({
      station: edge.toStation.name,
      ligne: edge.toStation.line,
      changement: edge.travelType === "TRANSFER",
    });
  });

  return trajet;
}

document.addEventListener("DOMContentLoaded", () => {
  afficherTrajet(trajetTest);
  afficherCarte(trajetTest);

  const form = document.getElementById("route-form");
  const results = document.getElementById("route-results");
  const departInput = document.getElementById("depart-input");
  const arriveeInput = document.getElementById("arrivee-input");

  chargerStations().catch((error) => {
    console.error(error);
  });

  if (!form || !results) {
    console.warn("Formulaire ou zone de résultat introuvable.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fromId = stationsByLabel.get(departInput.value);
    const toId = stationsByLabel.get(arriveeInput.value);

    if (!fromId || !toId) {
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
          `http://localhost:8080/api/route?from=${fromId}&to=${toId}&costType=TIME`
      );

      if (!response.ok) {
        throw new Error("Erreur backend");
      }

      const route = await response.json();
      const trajet = convertirRouteBackend(route);

      afficherTrajet(trajet);

      results.innerHTML = `
        <article class="itineraire" data-type="optimal">
          <div class="itineraire_header">
            <span class="badge">Optimal</span>
            <span class="co2">Backend</span>
          </div>

          <h3 class="duree">${route.length} étapes</h3>

          <p class="details">
            ${trajet.map(etape => `${etape.station} (${etape.ligne})`).join(" → ")}
          </p>
        </article>
      `;
    } catch (error) {
      console.error(error);

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



