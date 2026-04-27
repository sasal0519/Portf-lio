const progressBar = document.getElementById("scroll-progress");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

window.addEventListener("scroll", () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = Math.min(pct, 100) + "%";
}, {passive: true});

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
if (heroCard && !prefersReducedMotion && isFinePointer && window.innerWidth > 960) {
  let parallaxReady = false;
  heroCard.addEventListener("transitionend", () => { parallaxReady = true; }, { once: true });
  heroCard.addEventListener("mousemove", (e) => {
    if (!parallaxReady) return;
    const rect = heroCard.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `perspective(900px) rotateY(${cx * 3}deg) rotateX(${cy * -3}deg) translateZ(2px)`;
  });
  heroCard.addEventListener("mouseleave", () => {
    if (!parallaxReady) return;
    heroCard.style.transform = "";
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#'], .mobile-dock a[href^='#']");
const navObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((a) => {
        a.classList.remove("is-active");
        a.removeAttribute("aria-current");
      });
      document.querySelectorAll(`.nav a[href="#${entry.target.id}"], .mobile-dock a[href="#${entry.target.id}"]`).forEach((active) => {
        active.classList.add("is-active");
        active.setAttribute("aria-current", "location");
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach((section) => navObs.observe(section));

if (!prefersReducedMotion && isFinePointer && window.innerWidth > 760) {
  const interactiveCards = document.querySelectorAll(".panel, .project-note, .list-card, .contact-card, .project-main, .project-proof-card, .opportunity-card");

  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -3.2;
      const ry = ((x / rect.width) - 0.5) * 3.2;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      card.style.transform = `translate(-4px, -4px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
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
