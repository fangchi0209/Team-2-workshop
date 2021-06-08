const favoriteIcons = document.querySelectorAll(".heart");
for (let favoriteIcon of favoriteIcons) {
  favoriteIcon.addEventListener("click", () => {
    console.log("clicked");
    if (!checkLogInBeforeFavarite()) {
      console.log("not logging in!");
      return;
    }
  });
}
