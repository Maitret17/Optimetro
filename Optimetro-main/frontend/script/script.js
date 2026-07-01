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

afficherTrajet(trajetTest);
afficherCarte(trajetTest);

const fenetre = document.querySelector(".fenetre-flottante");
const closeButton = document.querySelector(".fenetre-close");

if (closeButton && fenetre) {
  closeButton.addEventListener("click", function () {
    fenetre.style.display = "none";
  });
}
