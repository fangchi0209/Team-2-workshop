document.getElementById("bookingLink").addEventListener("click", () => {
  fetch(`${window.origin}/api/user`)
    .then((res) => res.json())
    .then((data) => {
      if (data.data) {
        location.href = "cowork/booking";
      } else {
        document.getElementById("logIn").classList.add("slide-in");
        document.getElementById("logIn").classList.add("show");
      }
    })
    .catch((err) => {
      console.log(`fetch error : ${err}`);
    });
});
