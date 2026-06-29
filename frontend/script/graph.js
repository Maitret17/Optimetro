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