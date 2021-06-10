const menuBtn = document.querySelector(".menu-btn");
const headerNavbar = document.querySelector(".header-navbar");
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
  headerNavbar.classList.toggle("show");
});
