const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  body.classList.toggle("menu-open", !expanded);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
});

document.querySelectorAll("[data-accordion] .accordion-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".accordion-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.querySelectorAll("[data-testimonial-slider]").forEach((slider) => {
  const slides = [...slider.querySelectorAll(".testimonial-slide")];
  const dotsWrap = slider.querySelector(".testimonial-dots");
  const prev = slider.querySelector("[data-testimonial-prev]");
  const next = slider.querySelector("[data-testimonial-next]");
  const intervalMs = Number(slider.dataset.testimonialInterval || 5000);
  let autoSlideTimer;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "testimonial-dot";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dotsWrap.append(dot);
    return dot;
  });

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  }

  function startAutoSlide() {
    window.clearInterval(autoSlideTimer);
    autoSlideTimer = window.setInterval(() => showSlide(activeIndex + 1), intervalMs);
  }

  function moveSlide(index) {
    showSlide(index);
    startAutoSlide();
  }

  prev.addEventListener("click", () => moveSlide(activeIndex - 1));
  next.addEventListener("click", () => moveSlide(activeIndex + 1));
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => moveSlide(index));
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(autoSlideTimer));
  slider.addEventListener("mouseleave", startAutoSlide);
  slider.addEventListener("focusin", () => window.clearInterval(autoSlideTimer));
  slider.addEventListener("focusout", startAutoSlide);

  showSlide(activeIndex);
  startAutoSlide();
});

const productModal = document.querySelector("#productModal");

if (productModal) {
  const productModalTitle = productModal.querySelector("#productModalTitle");
  const productModalCopy = productModal.querySelector("#productModalCopy");
  const productTiles = [...document.querySelectorAll(".product-tile")];
  const defaultProduct = productTiles.find((tile) => tile.classList.contains("is-featured")) || productTiles[0];

  function openProductModal(tile = defaultProduct) {
    if (!tile) return;
    productModalTitle.textContent = tile.dataset.productTitle || tile.querySelector("strong").textContent;
    productModalCopy.textContent = tile.dataset.productCopy || "";
    productModal.classList.add("is-open");
    productModal.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
    productModal.querySelector("[data-product-close]").focus();
  }

  function closeProductModal() {
    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
  }

  productTiles.forEach((tile) => {
    tile.addEventListener("click", () => openProductModal(tile));
  });

  document.querySelectorAll("[data-product-open]").forEach((button) => {
    button.addEventListener("click", () => openProductModal(defaultProduct));
  });

  productModal.querySelectorAll("[data-product-close]").forEach((button) => {
    button.addEventListener("click", closeProductModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && productModal.classList.contains("is-open")) {
      closeProductModal();
    }
  });
}

const contactForm = document.querySelector("#contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    const note = document.querySelector("#formNote");
    const submitButton = event.currentTarget.querySelector('button[type="submit"]');
    if (note) note.textContent = "Sending your enquiry...";
    if (submitButton) submitButton.textContent = "Sending...";
  });
}
