document.addEventListener("DOMContentLoaded", () => {
    chargerAlertes();
});

async function chargerAlertes() {

    const container = document.getElementById("alert_ratp");

    container.innerHTML = "<p>Chargement des alertes...</p>";

    try {

        const response = await fetch("http://localhost:8080/api/alertes");

        if (!response.ok) {
            throw new Error("Erreur " + response.status);
        }

        const data = await response.json();

        console.log(data);

        container.innerHTML = "";

        const disruptions = data.disruptions || [];

        if (disruptions.length === 0) {
            container.innerHTML =
                "<p class='alerte_vide'>Aucune perturbation actuellement.</p>";
            return;
        }

        disruptions.forEach((alerte) => {

            const ligne =
                alerte.impacted_objects?.[0]?.pt_object?.line?.name ??
                "Ligne inconnue";

            const badge =
                alerte.severity?.name ??
                "Information";

            const description =
                alerte.messages?.[0]?.text ??
                "Aucune description disponible";

            container.innerHTML += `
                <div class="alerte_carte">

                    <div class="alerte_carte_header">

                        <span class="alerte_ligne">
                            ${ligne}
                        </span>

                        <span class="alerte_badge">
                            ${badge}
                        </span>

                    </div>

                    <p class="alerte_description">
                        ${description}
                    </p>

                </div>
            `;

        });

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="alerte_erreur">
                Impossible de récupérer les alertes.
            </p>
        `;
    }

}