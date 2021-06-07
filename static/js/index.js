const attractionsContainer = document.getElementById("attractionsContainer");
const searchForm = document.getElementById("searchForm");
const searchKeyword = document.getElementById("searchKeyword");

let nextPage = 0;
let attractionsArray = [];
let readyToLoadAgain = false;
let keyword = null;

// ========= functions ===========

// fetch attractions api and get (called in loadAttractions function)
async function getAttractionsData(pageNum, keyword = null) {
  let apiUrl;
  if (keyword) {
    apiUrl = `/api/attractions?page=${pageNum}&keyword=${keyword}`;
  } else {
    apiUrl = `/api/attractions?page=${pageNum}`;
  }
  const response = await fetch(apiUrl);
  const data = await response.json();
  nextPage = data.nextPage;
  attractionsArray = data.data;
  return nextPage;
}

// create single attraction item (called in showAttractions function)
function createAttractionItem(attraction) {
  const attractionBox = document.createElement("article");
  attractionBox.classList.add("attraction-box");

  const linkContainer = document.createElement("a");
  linkContainer.href = `/attraction/${attraction.id}`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const loadingSpinner = document.createElement("div");
  loadingSpinner.classList.add("loader");

  const attractionImage = document.createElement("img");
  attractionImage.src = attraction.images[0];
  attractionImage.classList.add("loading");

  imageContainer.appendChild(attractionImage);
  imageContainer.appendChild(loadingSpinner);

  const attractionTextContainer = document.createElement("div");
  attractionTextContainer.classList.add("attraction-text-container");

  const attractionTitle = document.createElement("p");
  attractionTitle.classList.add("attraction-title");
  attractionTitle.textContent = attraction.name;

  const attractionInfo = document.createElement("div");
  attractionInfo.classList.add("attraction-info");

  const attractionMrt = document.createElement("p");
  attractionMrt.classList.add("attraction-mrt");
  attractionMrt.textContent = attraction.mrt ? attraction.mrt : "無鄰近捷運站";

  const attractionCategory = document.createElement("p");
  attractionCategory.classList.add("attraction-category");
  attractionCategory.textContent = attraction.category;

  attractionInfo.appendChild(attractionMrt);
  attractionInfo.appendChild(attractionCategory);

  attractionTextContainer.appendChild(attractionTitle);
  attractionTextContainer.appendChild(attractionInfo);

  linkContainer.appendChild(imageContainer);
  linkContainer.appendChild(attractionTextContainer);

  attractionBox.appendChild(linkContainer);

  attractionImage.addEventListener("load", () => {
    loadingSpinner.hidden = true;
    attractionImage.classList.remove("loading");
  });

  return attractionBox;
}

// show all attractions in the same page (called in loadAttractions function)
function showAttractions() {
  if (attractionsArray.length) {
    for (let attraction of attractionsArray) {
      const attractionBox = createAttractionItem(attraction);
      attractionsContainer.appendChild(attractionBox);
    }
  } else if (!attractionsContainer.firstChild) {
    const message = document.createElement("span");
    message.textContent = "未找到符合關鍵字的景點";
    attractionsContainer.appendChild(message);
  }
}

// load and visualize attractions
async function loadAttractions(keyword = null) {
  if (nextPage !== null) {
    nextPage = await getAttractionsData(nextPage, keyword);
    showAttractions();
    readyToLoadAgain = true;
  }
}

// =========== initial load and event listener ========

// initial load
loadAttractions();

// infinite scroll : listen of scroll event
if (nextPage !== null) {
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.getBoundingClientRect().bottom && readyToLoadAgain) {
      loadAttractions(keyword);
      readyToLoadAgain = false;
    }
  });
}

// attraction keyword search : submit search form
searchForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  attractionsContainer.innerHTML = "";
  nextPage = 0;
  keyword = searchKeyword.value;
  loadAttractions(keyword);
});
