class CropRecommender {
  constructor(n, p, k) {
    this.n = n;
    this.p = p;
    this.k = k;
    this.rules = [];
    this.initRules();
  }

  initRules() {
    this.rules = [
      { name: "Rice",      range: { n: [51, 100], p: [41, 100], k: [0, 29] } },
      { name: "Wheat",     range: { n: [0, 29],  p: [51, 100], k: [0, 29] } },
      { name: "Cotton",    range: { n: [51, 100], p: [0, 39], k: [51, 100] } },
      { name: "Sugarcane", range: { n: [61, 100], p: [0, 29], k: [0, 100] } },
      { name: "Tea",       range: { n: [0, 39],  p: [41, 100], k: [41, 100] } },
      { name: "Tomato",    range: { n: [20, 60], p: [20, 60], k: [20, 60] } },
      { name: "Potato",    range: { n: [30, 70], p: [30, 70], k: [30, 70] } },
      { name: "Onion",     range: { n: [35, 65], p: [35, 65], k: [35, 65] } }
    ];
  }

  isInRange(value, range) {
    return value >= range[0] && value <= range[1];
  }

  getRecommendedCrops() {
    return this.rules.filter(rule => 
      this.isInRange(this.n, rule.range.n) &&
      this.isInRange(this.p, rule.range.p) &&
      this.isInRange(this.k, rule.range.k)
    ).map(rule => rule.name);
  }
}

const params = new URLSearchParams(window.location.search);
const n = parseInt(params.get("n"), 10);
const p = parseInt(params.get("p"), 10);
const k = parseInt(params.get("k"), 10);

const recommender = new CropRecommender(n, p, k);
const crops = recommender.getRecommendedCrops();

const list = document.getElementById("crop-list");
crops.forEach(crop => {
  const li = document.createElement("li");
  li.textContent = crop;
  li.addEventListener("click", () => {
    window.location.href = `crop-detail.html?crop=${encodeURIComponent(crop)}`;
  });
  list.appendChild(li);
});