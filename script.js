/* =========================================================
   INITIAL PAGE POSITION
   ========================================================= */

/*
   Prevent the browser from restoring an old section such as
   #experience when the website is initially opened.

   Navigation links will still work normally after the page loads.
*/
(function () {
  if (window.location.hash && window.location.hash !== "#home") {
    history.replaceState(
      null,
      document.title,
      window.location.pathname + window.location.search
    );
  }

  window.scrollTo(0, 0);
})();


/* =========================================================
   LOADER
   ========================================================= */

const loader = document.getElementById("loader");
const percent = document.getElementById("loaderPercent");
const status = document.getElementById("loaderStatus");

window.addEventListener("load", () => {

  const start = performance.now();

  /*
    CSS progress bar finishes at approximately 3.25 seconds.
    Keep the loader alive slightly longer so everything stays
    synchronized.
  */
  const duration = 3300;

  const statuses = [
    "INITIALIZING",
    "LOADING PROFILE",
    "LOADING EXPERIENCE",
    "LOADING SKILLS",
    "LOADING PROJECTS",
    "FINALIZING SYSTEM"
  ];

  function tick(now) {

    const progress = Math.min(
      (now - start) / duration,
      1
    );

    const value = Math.round(progress * 100);

    if (percent) {
      percent.textContent =
        String(value).padStart(2, "0") + "%";
    }

    if (status) {

      const index = Math.min(
        Math.floor(progress * statuses.length),
        statuses.length - 1
      );

      status.textContent = statuses[index];
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);


  /*
    Once loading is complete:

    1. Remove any old section hash.
    2. Force the website to Page 1.
    3. Scroll to the absolute top.
    4. Then hide the loader.
  */

  setTimeout(() => {

    history.replaceState(
      null,
      document.title,
      window.location.pathname +
      window.location.search +
      "#home"
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    loader?.classList.add("done");
    document.body.classList.add("site-ready");

  }, duration + 100);

});


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

menu?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});


document.querySelectorAll("nav a").forEach(link => {

  link.addEventListener("click", () => {
    nav?.classList.remove("open");
  });

});


/* =========================================================
   NAVIGATION — HOME
   ========================================================= */

document.querySelectorAll('a[href="#home"]').forEach(link => {

  link.addEventListener("click", event => {

    event.preventDefault();

    nav?.classList.remove("open");

    history.pushState(
      null,
      document.title,
      "#home"
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

  });

});


/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

const io = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }

    });

  },
  {
    threshold: 0.12
  }
);


document.querySelectorAll(".reveal").forEach(element => {
  io.observe(element);
});


/* =========================================================
   BACK TO TOP
   ========================================================= */

document.querySelectorAll('a[href="#top"]').forEach(link => {

  link.addEventListener("click", event => {

    event.preventDefault();

    history.pushState(
      null,
      document.title,
      "#home"
    );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });

  });

});


/* =========================================================
   LOGO ERROR PROTECTION
   ========================================================= */

/*
   If a local logo file is accidentally missing, the broken
   image will not display as a huge browser broken-image icon.

   Instead, the card gets a small fallback badge.
*/

document.querySelectorAll(".skills img, .logo img").forEach(img => {

  img.addEventListener("error", () => {

    img.style.display = "none";

    const fallback = document.createElement("span");

    fallback.className = "logoFallback";

    fallback.textContent =
      img.alt || "LOGO";

    img.parentElement?.appendChild(fallback);

  });

});
