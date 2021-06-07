const models = {
  orderNum: new URL(document.location).searchParams.get("number"),
  // orderNum: location.href.split("=").pop(),
  fetchData: async function (urlPath) {
    try {
      const res = await fetch(urlPath);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.log(`fetch error : ${err}`);
    }
  },
  getUserData: async function () {
    const userData = await this.fetchData("/api/user");
    return userData;
  },
  getOrderData: async function () {
    const orderData = await this.fetchData(`/api/orders/${this.orderNum}`);
    return orderData;
  },
};

const views = {
  renderIfLogIn: function (data) {
    if (!data) {
      location.href = "/";
    } else {
      document.getElementById("main").classList.remove("hide-before-log-in");
    }
  },
  renderOrderContact: function (data) {
    const contactData = data.contact;
    document.getElementById("contactName").textContent = contactData.name;
    document.getElementById("contactEmail").textContent = contactData.email;
    document.getElementById("contactPhone").textContent = contactData.phone;
  },
  createElementWithClass: function (tagName, className = null) {
    const newElement = document.createElement(tagName);
    if (className) {
      newElement.classList.add(className);
    }
    return newElement;
  },
  renderSingleTrip: function (tripData) {
    const orderAttractionInfo = this.createElementWithClass("article", "order-attraction-info");
    const attractionImageContainer = this.createElementWithClass("div", "attraction-image-container");
    const attractionImage = this.createElementWithClass("img");
    attractionImage.src = tripData.attraction.image;
    const orderDetail = this.createElementWithClass("div", "order-detail");
    const attractionHeader = this.createElementWithClass("h3", "body-bold");
    attractionHeader.textContent = tripData.attraction.name;
    const tripDate = this.createElementWithClass("p", "body-bold");
    tripDate.innerHTML = `日期：<span class="body-reg">${tripData.date}</span>`;
    const tripTime = this.createElementWithClass("p", "body-bold");
    let time = tripData.time === "morning" ? "早上 9 點到下午 4 點" : "下午 2 點到晚上 9 點";
    tripTime.innerHTML = `時間：<span class="body-reg">${time}</span>`;
    const attractionAddress = this.createElementWithClass("p", "body-bold");
    attractionAddress.innerHTML = `地點：<span class="body-reg">${tripData.attraction.address}</span>`;

    orderDetail.appendChild(attractionHeader);
    orderDetail.appendChild(tripDate);
    orderDetail.appendChild(tripTime);
    orderDetail.appendChild(attractionAddress);

    attractionImageContainer.appendChild(attractionImage);

    orderAttractionInfo.appendChild(attractionImageContainer);
    orderAttractionInfo.appendChild(orderDetail);

    document.querySelector(".order-attraction").appendChild(orderAttractionInfo);
  },
  renderOrder: function (orderData) {
    if (!orderData) {
      document.querySelector(".has-order").classList.add("hide");
      document.querySelector(".no-order").classList.remove("hide");
    } else {
      document.getElementById("orderNum").textContent = orderData.number;
      const trips = orderData.trip;
      trips.forEach((trip) => this.renderSingleTrip(trip));
    }
  },
};

const controllers = {
  checkIfLogIn: async function () {
    const userStatus = await models.getUserData();
    views.renderIfLogIn(userStatus);
  },
  showOrderContact: async function () {
    const orderContactData = await models.getOrderData();
    views.renderOrderContact(orderContactData);
  },
  showOrderInfo: async function () {
    const orderData = await models.getOrderData();
    views.renderOrder(orderData);
  },
};

controllers.checkIfLogIn();
controllers.showOrderInfo();
controllers.showOrderContact();
