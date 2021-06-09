document.getElementById("favoriteLink").addEventListener("click", () => {
  fetch(`${window.origin}/api/user`)
    .then((res) => res.json())
    .then((data) => {
      if (data.data) {
        location.href = "/favorite";
      } else {
        document.getElementById("logIn").classList.add("slide-in");
        document.getElementById("logIn").classList.add("show");
      }
    })
    .catch((err) => {
      console.log(`fetch error : ${err}`);
    });
});