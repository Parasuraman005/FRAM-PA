const cropData = {
  Rice: "Rice requires abundant water and is commonly grown in flooded fields. Ideal for warm climates.",
  Wheat: "Wheat is a staple grain grown in cooler climates. Needs moderate water and sunlight.",
  Cotton: "Cotton thrives in warm temperatures with dry climate during harvest. Needs fertile soil.",
  Sugarcane: "Sugarcane grows in tropical climates. Requires lots of water and rich soil.",
  Tea: "Tea plants grow best in cool, humid climates with well-drained soil.",
  Tomato: "Tomatoes need warm weather, direct sunlight, and regular watering.",
  Potato: "Potatoes prefer cool weather and loose, well-drained soil.",
  Onion: "Onions require full sun and loose soil. Water frequently for optimal growth."
};

const params = new URLSearchParams(window.location.search);
const crop = params.get("crop");

document.getElementById("crop-name").textContent = crop;
document.getElementById("crop-desc").textContent = cropData[crop] || "No description available.";