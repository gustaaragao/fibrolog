const svg = document.getElementById("regionMap");

//legenda abaixo do SVG
const legend = document.createElement("div");
legend.id = "legend";
legend.textContent = "Regiões selecionadas: nenhuma";
svg.after(legend);

//guarda os ids selecionados
const selectedRegions = new Set();

//pega os paths do SVG
const regions = svg.querySelectorAll("path");

regions.forEach(region => {
  region.addEventListener("click", () => {
    const id = region.id;

    //alterna seleção
    if (selectedRegions.has(id)) {
      selectedRegions.delete(id);
      region.classList.remove("selected");
    } else {
      selectedRegions.add(id);
      region.classList.add("selected");
    }

    updateLegend();
  });
});

function updateLegend() {
  if (selectedRegions.size === 0) {
    legend.textContent = "Regiões selecionadas: nenhuma";
    return;
  }

  //ordena numericamente
  const ordered = Array.from(selectedRegions)
    .map(Number)
    .sort((a, b) => a - b);

  legend.textContent = `Regiões selecionadas: ${ordered.join(", ")}`;
}
