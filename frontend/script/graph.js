document.querySelectorAll(".graph_svg").forEach((object) => {
  object.addEventListener("load", () => {
    svgPanZoom(object, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.5,
      maxZoom: 20
    });
  });
});

const connectivityButton = document.getElementById("connectivity_btn");
const connectivityResult = document.getElementById("connectivity_result");

if (connectivityButton && connectivityResult) {
  connectivityButton.addEventListener("click", async () => {
    connectivityResult.textContent = "Test en cours...";
    connectivityResult.className = "connectivity_result";

    try {
      const response = await fetch("http://localhost:8080/api/graph/connectivity");

      if (!response.ok) {
        throw new Error("Erreur backend");
      }

      const data = await response.json();

      if (data.connected) {
        connectivityResult.textContent =
            `Graphe connecté : ${data.visitedStations}/${data.totalStations} stations atteignables.`;
        connectivityResult.classList.add("connectivity_ok");
      } else {
        connectivityResult.textContent =
            `Graphe non connecté : ${data.visitedStations}/${data.totalStations} stations atteignables. ` +
            `${data.unreachableStations.length} station(s) non atteignable(s).`;
        connectivityResult.classList.add("connectivity_error");
      }
    } catch (error) {
      console.error(error);
      connectivityResult.textContent =
          "Impossible de tester la connectivité du graphe.";
      connectivityResult.classList.add("connectivity_error");
    }
  });
}