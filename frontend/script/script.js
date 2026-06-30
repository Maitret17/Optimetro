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

    timeline.innerHTML += `
      <div class="etape">
        <div class="ligne_visuelle">
          <div class="point_station"></div>
          ${!estDerniere ? '<div class="segment"></div>' : ""}
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

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
  }).addTo(map);

  const points = [];

  trajet.forEach((etape, index) => {
    const position = coordonnees[etape.station];

    points.push(position);

    const marker = L.marker(position).addTo(map);

    marker.bindPopup(`
      <b>${etape.station}</b><br>
      ${etape.ligne}
    `);

    if (index === 0) {
      marker.openPopup();
    }
  });

  L.polyline(points, {
    color: "blue",
    weight: 5,
    opacity: 0.8,
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



