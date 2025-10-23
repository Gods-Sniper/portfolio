(function () {
  const links = document.querySelectorAll(".narbar a");

  function activate() {
    const fromTop = window.scrollY + 120;
    links.forEach((link) => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (top <= fromTop && fromTop < bottom) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", activate);
  window.addEventListener("load", activate);

  links.forEach((l) =>
    l.addEventListener("click", () => {
      links.forEach((x) => x.classList.remove("active"));
      l.classList.add("active");
      // close mobile nav after click
      const nav = document.querySelector(".narbar");
      const toggle = document.querySelector(".nav-toggle");
      if (nav && toggle && window.innerWidth <= 768) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    })
  );

  // hamburger toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".narbar");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
    });
    // close nav on outside click
    document.addEventListener("click", (e) => {
      if (window.innerWidth > 768) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    // close on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();

// product lightbox (delegated)
(function () {
  function createLightbox() {
    if (document.querySelector(".lightbox-overlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = `
      <div class="lightbox-content" role="dialog" aria-modal="true">
        <button class="lightbox-close" aria-label="Close">×</button>
        <img class="lightbox-image" src="" alt="" />
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.classList.contains("lightbox-close"))
        closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(imgSrc, altText, caption) {
    createLightbox();
    const overlay = document.querySelector(".lightbox-overlay");
    overlay.classList.add("open");
    overlay.querySelector(".lightbox-image").src = imgSrc;
    overlay.querySelector(".lightbox-image").alt = altText || "";
    overlay.querySelector(".lightbox-caption").textContent = caption || "";
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const overlay = document.querySelector(".lightbox-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    const img = overlay.querySelector(".lightbox-image");
    if (img) img.src = "";
  }

  document.addEventListener("click", (e) => {
    const box = e.target.closest(".product-box");
    if (!box) return;
    const img = box.querySelector("img");
    if (!img) return;
    openLightbox(img.src, img.alt, box.querySelector("h3")?.textContent || "");
  });
})();

// reveal on scroll / animate elements
(function () {
  function initScrollAnimations() {
    const els = Array.from(document.querySelectorAll('[data-animate]'));
    if (!els.length || !window.IntersectionObserver) {
      // fallback: reveal all
      els.forEach(el => el.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('in-view');
          // if no need to observe further, unobserve to improve perf
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });

    // apply small stagger for groups
    els.forEach((el, i) => {
      // allow author to override via data-delay attribute (seconds)
      const explicit = el.getAttribute('data-delay');
      if (explicit != null) el.style.setProperty('--delay', `${explicit}s`);
      else el.style.setProperty('--delay', `${(i % 6) * 0.06}s`);
      io.observe(el);
    });

    // floating hero image toggle for visual interest
    const heroImg = document.querySelector('.home .image img');
    if (heroImg) {
      heroImg.classList.add('floating');
      // pause float on pointer over for clarity
      heroImg.addEventListener('pointerenter', () => heroImg.classList.remove('floating'));
      heroImg.addEventListener('pointerleave', () => heroImg.classList.add('floating'));
    }
  }

  // init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
})();
