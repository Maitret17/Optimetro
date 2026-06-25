function afficherAlertes() {
    const alertBlock = document.getElementById("liste_alertes");

    fetch("http://localhost:8080/api/alertes")
        .then(response => response.json())
        .then(data => {
            alertBlock.innerHTML = "";

            data.forEach(alerte => {
                alertBlock.innerHTML += `
                    <article class="newAlert">
                        <h3>${alerte.title}</h3>
                        <p>${alerte.message}</p>
                    </article>
                `;
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement des alertes :", error);
        });
}

afficherAlertes();
