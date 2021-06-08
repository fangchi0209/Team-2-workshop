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
  getBookingData: async function () {
    try {
      const res = await fetch(`${window.origin}/api/booking`);
      const data = await res.json();
      const bookingData = data.data;
      return bookingData;
    } catch (err) {
      console.log(`fetch error : ${err}`);
    }
  },
  getUserInfo: async function () {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      const userData = data.data;
      return userData;
    } catch (err) {
      console.log(`fetch error : ${err}`);
    }
  },
  removeBookingData: async function (requestBody) {
    try {
      const res = await fetch("/api/booking", {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: requestBody,
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(`fetch error : ${err}`);
    }
  },
};

const views = {
  totalPrice: 0,
  renderLogIn: function (data) {
    if (!data.data) {
      location.href = "/";
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
  renderSingleAttraction: function (data) {
    document.getElementsByClassName("no-booking")[0].classList.add("hide");
    document.getElementsByClassName("has-booking")[0].classList.remove("hide");

    const bookingAttraction = this.createElementWithClass("section", "booking-attraction");
    bookingAttraction.dataset.attractionId = data.attraction.id;
    const bookingAttractionInfo = this.createElementWithClass("div", "booking-attraction-info");
    const attractionImageContainer = this.createElementWithClass("div", "attraction-image-container");
    const attractionImage = this.createElementWithClass("img");
    attractionImage.src = data.attraction.image;
    const bookingDetail = this.createElementWithClass("div", "booking-detail");
    const attractionHeader = this.createElementWithClass("h3", "body-bold");
    attractionHeader.innerHTML = `台北一日遊：<span>${data.attraction.name}</span>`;
    const bookingDate = this.createElementWithClass("p", "body-bold");
    bookingDate.innerHTML = `日期：<span class="body-reg">${data.date}</span>`;
    const bookingTime = this.createElementWithClass("p", "body-bold");
    let time;
    if (data.time === "morning") {
      time = "早上 9 點到下午 4 點";
    } else if (data.time === "afternoon") {
      time = "下午 2 點到晚上 9 點";
    }
    bookingTime.innerHTML = `時間：<span class="body-reg">${time}</span>`;
    const bookingPrice = this.createElementWithClass("p", "body-bold");
    bookingPrice.innerHTML = `費用：<span class="body-reg">新台幣 ${data.price} 元</span>`;
    const attractionAddress = this.createElementWithClass("p", "body-bold");
    attractionAddress.innerHTML = `地點：<span class="body-reg">${data.attraction.address}</span>`;
    const deleteIcon = this.createElementWithClass("img", "delete");
    deleteIcon.src = "../static/images/icon_delete.png";
    deleteIcon.alt = "刪除預定行程";

    bookingDetail.appendChild(attractionHeader);
    bookingDetail.appendChild(bookingDate);
    bookingDetail.appendChild(bookingTime);
    bookingDetail.appendChild(bookingPrice);
    bookingDetail.appendChild(attractionAddress);

    attractionImageContainer.appendChild(attractionImage);

    bookingAttractionInfo.appendChild(attractionImageContainer);
    bookingAttractionInfo.appendChild(bookingDetail);
    bookingAttractionInfo.appendChild(deleteIcon);

    bookingAttraction.appendChild(bookingAttractionInfo);

    document.getElementsByClassName("has-booking")[0].prepend(bookingAttraction);
    this.totalPrice += data.price;
  },
  renderBookingAttractions: function (data) {
    if (!data) {
      document.getElementsByTagName("main")[0].classList.add("main-no-booking");
      document.getElementsByTagName("footer")[0].classList.add("footer-no-booking");
    } else {
      for (let attraction of data) {
        this.renderSingleAttraction(attraction);
      }
      document.getElementById("bookingPrice").textContent = this.totalPrice;
    }
  },
  removeBookingView: function (data) {
    if (data.ok) {
      window.location.reload();
    } else if (data.error) {
      console.log(data.message);
    }
  },
  renderUserInfo: function (data) {
    document.getElementById("username").textContent = data.name;
    document.getElementById("bookingName").value = data.name;
    document.getElementById("bookingEmail").value = data.email;
  },
};

const controllers = {
  checkIfLogIn: async function () {
    const userStatus = await models.getUserLogInInfo();
    views.renderLogIn(userStatus);
  },
  showUserInfo: async function () {
    const userData = await models.getUserInfo();
    views.renderUserInfo(userData);
  },
  showBookings: async function () {
    const bookingData = await models.getBookingData();
    views.renderBookingAttractions(bookingData);
  },
  deleteBooking: async function () {
    const deleteIcons = document.querySelectorAll(".delete");
    for (let deleteIcon of deleteIcons) {
      deleteIcon.addEventListener("click", async () => {
        const attractionId = parseInt(deleteIcon.parentElement.parentElement.dataset.attractionId);
        const requestBody = JSON.stringify({ attractionId: attractionId });
        const removeStatus = await models.removeBookingData(requestBody);
        views.removeBookingView(removeStatus);
      });
    }
  },
};

controllers.checkIfLogIn();
controllers.showUserInfo();
(async () => {
  await controllers.showBookings();
  controllers.deleteBooking();
})();
