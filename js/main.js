/* ============================================================
   James Threadgold — Portfolio interactions
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll + progress bar ---------- */
  const header = document.getElementById("header");
  const progress = document.getElementById("progress");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  if (toggle && navLinks) {
    const setOpen = (open) => {
      navLinks.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true")
    );
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for siblings revealed together
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    // stagger groups of reveals that share a parent
    document.querySelectorAll(".hero-inner, .about-body, .projects, .steps, .about-stats").forEach((group) => {
      group.querySelectorAll(":scope > .reveal, :scope > * > .reveal").forEach((el, i) => {
        el.dataset.delay = i * 70;
      });
    });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const countObs = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || "";
          if (reduceMotion) {
            el.textContent = target + suffix;
          } else {
            const dur = 1400;
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min((now - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * eased) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
          obs.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => countObs.observe(c));
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */
  const cursor = document.getElementById("cursor");
  if (cursor && fine && !reduceMotion) {
    let cx = window.innerWidth / 2,
      cy = window.innerHeight / 2,
      tx = cx,
      ty = cy,
      raf = null;

    const render = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.style.opacity = "1";
      if (!raf) render();
    });
    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) cursor.style.opacity = "0";
    });
    window.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    window.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

    const hoverSel = "a, button, [data-magnetic], [data-tilt]";
    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.3;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Project card tilt ---------- */
  if (fine && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const max = 5; // degrees
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- Parallax on hero blobs ---------- */
  if (fine && !reduceMotion) {
    const blobs = document.querySelectorAll(".blob");
    if (blobs.length) {
      window.addEventListener(
        "mousemove",
        (e) => {
          const dx = (e.clientX / window.innerWidth - 0.5) * 2;
          const dy = (e.clientY / window.innerHeight - 0.5) * 2;
          blobs.forEach((b, i) => {
            const depth = (i + 1) * 14;
            b.style.translate = `${dx * depth}px ${dy * depth}px`;
          });
        },
        { passive: true }
      );
    }
  }

  /* ---------- Contact form (Netlify Forms + AJAX) ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setStatus = (type, msg) => {
      if (!status) return;
      status.className = "form-status " + type;
      status.textContent = msg;
    };

    const validate = () => {
      let ok = true;
      form.querySelectorAll("[data-required]").forEach((el) => {
        const field = el.closest(".field");
        let bad = !el.value.trim();
        if (!bad && el.type === "email") bad = !emailRe.test(el.value.trim());
        field.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      return ok;
    };

    // Clear a field's error as soon as it's corrected
    form.querySelectorAll("[data-required]").forEach((el) => {
      el.addEventListener("input", () => {
        const field = el.closest(".field");
        if (field.classList.contains("invalid")) {
          let bad = !el.value.trim();
          if (!bad && el.type === "email") bad = !emailRe.test(el.value.trim());
          field.classList.toggle("invalid", bad);
        }
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        setStatus("error", "Please fill in the highlighted fields.");
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      const original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setStatus("", "");

      const data = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      })
        .then((res) => {
          if (!res.ok) throw new Error("Bad response");
          form.reset();
          setStatus("success", "Thanks — your message is on its way. I'll reply within 1-2 business days.");
        })
        .catch(() => {
          setStatus(
            "error",
            "Something went wrong sending that. Please try again in a moment, or reach out via LinkedIn."
          );
        })
        .finally(() => {
          if (btn) { btn.disabled = false; btn.textContent = original; }
        });
    });
  }
})();
