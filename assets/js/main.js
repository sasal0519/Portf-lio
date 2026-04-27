const progressBar = document.getElementById("scroll-progress");
window.addEventListener("scroll", () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = Math.min(pct, 100) + "%";
}, {passive: true});

const spotlight = document.getElementById("cursor-spotlight");
window.addEventListener("mousemove", (e) => {
  spotlight.style.left = `${e.clientX}px`;
  spotlight.style.top = `${e.clientY}px`;
}, {passive: true});

const heroSection = document.querySelector(".hero");
const items = ["Python","Linux","Engenharia Química","ProEng","Automacao","Open Source","Git","LaTeX","UFRN","HTML & CSS","Bash","Neobrutalismo"];
const half = items.map((item) => `<span>${item}</span><span class="sep">★</span>`).join("");
const marqueeHTML = `
<div class="marquee-strip" aria-hidden="true">
  <div class="marquee-track">${half}${half}</div>
</div>`;
heroSection.insertAdjacentHTML("afterend", marqueeHTML);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 45, 260)}ms`;
  revealObs.observe(el);
});

const titleObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("glitch-active");
      titleObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll(".section-title").forEach((el) => titleObs.observe(el));

const skillObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("skills-animated");
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll(".skill-strip").forEach((el) => skillObs.observe(el));

const metricObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-counted");
      metricObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });
document.querySelectorAll(".metric").forEach((el) => metricObs.observe(el));

const heroCard = document.querySelector(".hero-card");
if (heroCard) {
  let parallaxReady = false;
  heroCard.addEventListener("transitionend", () => { parallaxReady = true; }, { once: true });
  heroCard.addEventListener("mousemove", (e) => {
    if (!parallaxReady) return;
    const rect = heroCard.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `perspective(900px) rotateY(${cx * 5}deg) rotateX(${cy * -5}deg) translateZ(4px)`;
  });
  heroCard.addEventListener("mouseleave", () => {
    if (!parallaxReady) return;
    heroCard.style.transform = "";
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) => {
        a.style.background = "";
        a.style.boxShadow = "";
      });
      const active = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.background = "#fff4bf";
        active.style.boxShadow = "4px 4px 0 #111";
      }
    }
  });
}, { threshold: 0.5 });
sections.forEach((section) => navObs.observe(section));

document.querySelectorAll(".gallery-card").forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const interactiveCards = document.querySelectorAll(".panel, .gallery-card, .project-note, .list-card, .contact-card, .project-main");

  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -5;
      const ry = ((x / rect.width) - 0.5) * 5;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.transform = `translate(-6px, -6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
      card.style.transform = "";
    });
  });
}

const staggerLists = document.querySelectorAll(".timeline-item ul, .project-note ul, .list-card ul");

staggerLists.forEach((list) => {
  list.classList.add("stagger-list");
});

const listObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("is-visible");
    entry.target.querySelectorAll("li").forEach((item, index) => {
      item.style.transitionDelay = `${index * 70}ms`;
    });
    listObs.unobserve(entry.target);
  });
}, { threshold: 0.35 });

staggerLists.forEach((list) => {
  listObs.observe(list);
});
