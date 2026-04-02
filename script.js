let tools = [];
let allTools = [];

const toolsDiv = document.getElementById("tools");
const trendingDiv = document.getElementById("trending");
const search = document.getElementById("search");
const categorySelect = document.getElementById("category");
const pricingSelect = document.getElementById("pricing");
const audienceSelect = document.getElementById("audience");

async function loadTools() {
  try {
    const response = await fetch('tools.json');
    allTools = await response.json();
    // Add logo and default trending to all
    allTools = allTools.map(tool => ({ 
      ...tool, 
      trending: tool.trending || false,
      logo: `https://logo.clearbit.com/${new URL(tool.link).hostname}`
    }));
    tools = [...allTools];
    render(tools, toolsDiv);
    render(tools.filter(t => t.trending), trendingDiv);
  } catch (error) {
    console.error('Error loading tools:', error);
  }
}

function render(list, container) {
  container.innerHTML = "";

  list.forEach(tool => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${tool.logo}" alt="${tool.name} logo" class="tool-logo">
      <h3>${tool.name}</h3>
      <p>${tool.category}</p>
      <p>⭐ ${tool.rating}</p>
      <span class="pricing-tag ${tool.pricing}">${tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1)}</span>
    `;

    const img = card.querySelector('img');
    img.onerror = () => img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(tool.link)}&sz=64`;

    card.onclick = () => {
      window.location.href = `tool.html?id=${encodeURIComponent(tool.name)}`;
    };
    container.appendChild(card);
  });
}

function openModal(tool) {
  // Removed, now using dedicated page
}

function filter() {
  let searchVal = search.value.toLowerCase();
  let categoryVal = categorySelect.value;
  let pricingVal = pricingSelect.value;
  let audienceVal = audienceSelect.value;

  let filtered = allTools.filter(t => {
    let matchesSearch = t.name.toLowerCase().includes(searchVal) || t.description.toLowerCase().includes(searchVal);
    let matchesCategory = categoryVal === "all" || t.category === categoryVal;
    let matchesPricing = pricingVal === "all" || t.pricing === pricingVal;
    let matchesAudience = audienceVal === "all" || t.audience.includes(audienceVal.replace(" Bundle", "").toLowerCase());
    return matchesSearch && matchesCategory && matchesPricing && matchesAudience;
  });

  // Sort filtered tools by category for stepwise display
  filtered.sort((a, b) => a.category.localeCompare(b.category));

  tools = filtered;
  render(filtered, toolsDiv);

  // Hide trending if any filter is applied
  const isFiltered = searchVal || categoryVal !== "all" || pricingVal !== "all" || audienceVal !== "all";
  trendingDiv.style.display = isFiltered ? "none" : "block";
  if (!isFiltered) {
    render(allTools.filter(t => t.trending).sort((a, b) => a.category.localeCompare(b.category)), trendingDiv);
  }
}

search.addEventListener("input", filter);
categorySelect.addEventListener("change", filter);
pricingSelect.addEventListener("change", filter);
audienceSelect.addEventListener("change", filter);

loadTools();