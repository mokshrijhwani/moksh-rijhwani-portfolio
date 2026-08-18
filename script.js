/* =========================================================
   PORTFOLIO SYSTEM — JAVASCRIPT
   ========================================================= */


/* =========================================================
   LOADER
   ========================================================= */

const loader = document.getElementById("loader");
const percent = document.getElementById("loaderPercent");
const status = document.getElementById("loaderStatus");

window.addEventListener("load", () => {

    const start = performance.now();
    const duration = 2850;

    const statuses = [
        "INITIALIZING",
        "LOADING SYSTEM",
        "CALIBRATING DATA",
        "SYNCING MODULES",
        "BUILDING PROFILE",
        "SYSTEM READY"
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


    setTimeout(() => {

        if (loader) {
            loader.classList.add("done");
        }

        document.body.classList.add("site-ready");

    }, duration + 120);

});


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menu = document.querySelector(".menu");
const nav = document.querySelector("nav");

if (menu && nav) {

    menu.addEventListener("click", () => {

        nav.classList.toggle("open");

    });

}


document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", () => {

        if (nav) {
            nav.classList.remove("open");
        }

    });

});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


document.querySelectorAll(".reveal").forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sections = document.querySelectorAll(
    "main .panel[id]"
);

const navLinks = document.querySelectorAll(
    "nav a[href^='#']"
);


const activeObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            const id = entry.target.getAttribute("id");

            navLinks.forEach(link => {

                link.classList.remove("active");

                if (
                    link.getAttribute("href") === "#" + id
                ) {

                    link.classList.add("active");

                }

            });

        });

    },

    {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    }

);


sections.forEach(section => {

    activeObserver.observe(section);

});


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm =
    document.querySelector(".contact form");


if (contactForm) {

    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        const button =
            contactForm.querySelector("button");

        if (!button) {
            return;
        }

        const originalText =
            button.textContent;

        button.textContent =
            "MESSAGE READY ✓";

        button.disabled = true;

        setTimeout(() => {

            button.textContent =
                originalText;

            button.disabled = false;

        }, 2200);

    });

}


/* =========================================================
   IMAGE LOAD PROTECTION
   ========================================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("error", () => {

        image.style.opacity = "0";

    });

});


/* =========================================================
   PAGE READY
   ========================================================= */

document.body.classList.add("js-enabled");
