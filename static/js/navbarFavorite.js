document.getElementById("favoriteLink").addEventListener("click", () => {
  fetch(`${window.origin}/cowork/api/user`)
    .then((res) => res.json())
    .then((data) => {
      if (data.data) {
        location.href = `${window.origin}/cowork/favorite`;
      } else {
        document.getElementById("logIn").classList.add("slide-in");
        document.getElementById("logIn").classList.add("show");
      }
    })
    .catch((err) => {
      console.log(`fetch error : ${err}`);
    });
});
