// ================================================
// ============ Check if Logged In ================
// ================================================
fetch(`${window.origin}/api/user`)
  .then((res) => res.json())
  .then((data) => {
    if (data.data) {
      document.getElementById("logOut").classList.remove("hide");
    } else {
      document.getElementById("logInSignUp").classList.remove("hide");
    }
  })
  .catch((err) => {
    console.log(`fetch error : ${err}`);
  });
