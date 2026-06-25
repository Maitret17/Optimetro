console.log("script chargé");

const trajetTest = [
    { station: "EFREI Paris", ligne: "Métro 7", changement: false },
    { station: "Kremlin-Bicêtre", ligne: "Métro 7", changement: false },
    { station: "Place d'Italie", ligne: "Métro 7 → Métro 5", changement: true },
    { station: "Châtelet", ligne: "Métro 1", changement: false }
];

function afficherTrajet(trajet) {
    const timeline = document.getElementById("timeline_trajet");

    console.log(timeline);

    timeline.innerHTML = "";

    trajet.forEach((etape, index) => {
        const estDerniere = index === trajet.length - 1;

        timeline.innerHTML += `
            <div class="etape">
                <div class="ligne_visuelle">
                    <div class="point_station"></div>
                    ${!estDerniere ? '<div class="segment"></div>' : ''}
                </div>

                <div class="contenu_station">
                    <p class="nom_station">${etape.station}</p>
                    <p class="info_ligne">${etape.ligne}</p>
                    ${etape.changement ? '<span class="changement">Correspondance</span>' : ''}
                </div>
            </div>
        `;
    });
}

afficherTrajet(trajetTest);