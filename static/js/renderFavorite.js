const models = {
  getUserLogInInfo: async function () {
    try {
      const res = await fetch(`${window.origin}/api/user`);
      const logIndata = await res.json();
      return logIndata;
    } catch (err) {
      console.log(`fetch error : ${err}`);
    }
  },
  getFavoriteData: async function () {
    try {
      const res = await fetch(`${window.origin}/api/favorite`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.log(`fetch error : ${err}`);
    }
  },
};

const views = {
  renderLogIn: function (data) {
    if (!data.data) {
      location.href = "/cowork";
    } else {
      document.getElementById("main").classList.remove("hide-before-log-in");
    }
  },
  createElementWithClass: function (tagName, className = null) {
    const newElement = document.createElement(tagName);
    if (className) {
      newElement.classList.add(className);
    }
    return newElement;
  },
  createFavoriteItem: function (attraction, favoriteIds) {
    const attractionBox = this.createElementWithClass("article", "attraction-box");

    const heart = this.createElementWithClass("div", "heart");
    heart.classList.add("loading");
    heart.dataset.attractionId = attraction.id;
    heart.innerHTML =
      '<svg viewBox="0 0 24 24" style="pointer-events: none; width: 24px; height: 24px; display: block;"><g class="favorite"><path d="M12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4z"></path></g></svg>';
    const heartPendingLoader = this.createElementWithClass("div", "heart-loader");
    heart.appendChild(heartPendingLoader);

    const linkContainer = document.createElement("a");
    linkContainer.href = `cowork/attraction/${attraction.id}`;
    const imageContainer = this.createElementWithClass("div", "image-container");
    const loadingSpinner = this.createElementWithClass("div", "loader");
    const attractionImage = this.createElementWithClass("img", "loading");
    attractionImage.src = attraction.images;

    imageContainer.appendChild(attractionImage);
    imageContainer.appendChild(loadingSpinner);

    const attractionTextContainer = this.createElementWithClass("div", "attraction-text-container");
    const attractionTitle = this.createElementWithClass("p", "attraction-title");
    attractionTitle.textContent = attraction.name;
    const attractionInfo = this.createElementWithClass("div", "attraction-info");
    const attractionMrt = this.createElementWithClass("p", "attraction-mrt");
    attractionMrt.textContent = attraction.mrt ? attraction.mrt : "無鄰近捷運站";

    const attractionCategory = this.createElementWithClass("p", "attraction-category");
    attractionCategory.textContent = attraction.category;

    const attractionDescription = this.createElementWithClass("p", "attraction-description");
    attractionDescription.textContent = `${attraction.description.slice(0, 40)} ...`;

    const bookAttractionBtn = this.createElementWithClass("a", "book-attraction-btn");
    bookAttractionBtn.textContent = "前往預定此行程";
    bookAttractionBtn.href = `cowork/attraction/${attraction.id}`;

    attractionInfo.appendChild(attractionMrt);
    attractionInfo.appendChild(attractionCategory);

    attractionTextContainer.appendChild(attractionTitle);
    attractionTextContainer.appendChild(attractionInfo);
    attractionTextContainer.appendChild(attractionDescription);

    linkContainer.appendChild(imageContainer);
    linkContainer.appendChild(attractionTextContainer);
    linkContainer.appendChild(bookAttractionBtn);

    attractionBox.appendChild(linkContainer);
    attractionBox.appendChild(heart);

    if (favoriteIds.includes(attraction.id)) {
      heart.classList.add("selected");
    }

    attractionImage.addEventListener("load", () => {
      loadingSpinner.hidden = true;
      attractionImage.classList.remove("loading");
      heart.classList.remove("loading");
    });

    heart.addEventListener("click", () => toggleFavorite(heart));

    return attractionBox;
  },
  renderFavoritesItems: function (favoritesArray) {
    const attractionsContainer = document.getElementById("attractionsContainer");
    if (favoritesArray) {
      const favoriteIds = [];
      favoritesArray.forEach((favorite) => {
        favoriteIds.push(favorite.id);
      });
      favoritesArray.forEach((favorite) => {
        const attractionBox = this.createFavoriteItem(favorite, favoriteIds);
        attractionsContainer.appendChild(attractionBox);
      });
    } else {
      const message = document.createElement("span");
      message.textContent = "您沒有收藏的景點";
      const backLink = this.createElementWithClass("a", "back-to-index");
      backLink.href = "/cowork";
      backLink.innerHTML = `<svg viewBox="0 0 24 24" style="pointer-events: none; width: 24px; height: 24px;"><g class="heart-icon"><path d="M12,21.4L10.6,20C5.4,15.4,2,12.3,2,8.5C2,5.4,4.4,3,7.5,3c1.7,0,3.4,0.8,4.5,2.1C13.1,3.8,14.8,3,16.5,3C19.6,3,22,5.4,22,8.5c0,3.8-3.4,6.9-8.6,11.5L12,21.4z"></path></g></svg><span>開始收藏景點</span>`;
      attractionsContainer.appendChild(message);
      attractionsContainer.appendChild(backLink);
      attractionsContainer.style.flexDirection = "column";
    }
  },
};

const controllers = {
  checkIfLogIn: async function () {
    const userStatus = await models.getUserLogInInfo();
    views.renderLogIn(userStatus);
  },
  showFavoritesItems: async function () {
    const favoritesArray = await models.getFavoriteData();
    views.renderFavoritesItems(favoritesArray);
  },
};

controllers.checkIfLogIn();
controllers.showFavoritesItems();
