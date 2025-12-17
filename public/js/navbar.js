const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 1) {
    navbar.classList.remove("transparent");
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.add("transparent");
    navbar.classList.remove("scrolled");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".menu-icon");
  const navList = document.querySelector(".navbar ul");
  menuIcon.addEventListener("click", () => {
    navList.classList.toggle("show");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar")) {
      navList.classList.remove("show");
    }
  });
});