// Small behaviours for the portfolio: menu, scroll reveals, logo ticker, testimonial slider.
document.documentElement.classList.remove("no-js");

// Mobile / tablet menu
document.querySelectorAll(".nav-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const nav = btn.closest(".nav");
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
});
document.querySelectorAll(".nav-menu a").forEach((a) =>
  a.addEventListener("click", () => a.closest(".nav").classList.remove("open"))
);

// Elements fade/rise in once they scroll into view
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { rootMargin: "0px 0px -10% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Logo ticker: duplicate the set and scroll left at 70px per second
const track = document.querySelector(".logos-track");
if (track) {
  const items = [...track.children];
  const setUp = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const setWidth = items.reduce((w, el) => w + el.getBoundingClientRect().width + gap, 0);
    track.style.setProperty("--ticker-shift", setWidth + "px");
    track.style.setProperty("--ticker-duration", setWidth / 70 + "s");
  };
  for (let i = 0; i < 3; i++) items.forEach((el) => {
    const c = el.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    track.appendChild(c);
  });
  if (document.readyState === "complete") setUp();
  else window.addEventListener("load", setUp);
  window.addEventListener("resize", setUp);
}

// Testimonial slider: loops forever, auto-advances every 3 seconds
const slider = document.querySelector(".slider");
if (slider) {
  const strip = slider.querySelector(".slider-track");
  const originals = [...strip.children];
  const n = originals.length;
  // Clone a full set before and after so the loop never shows an edge
  originals.forEach((s) => strip.appendChild(Object.assign(s.cloneNode(true), { ariaHidden: "true" })));
  originals.slice().reverse().forEach((s) => strip.prepend(Object.assign(s.cloneNode(true), { ariaHidden: "true" })));
  const dots = [...slider.querySelectorAll(".slider-dots button")];
  let index = n; // first real slide
  let timer;

  const step = () => {
    const gap = parseFloat(getComputedStyle(strip).columnGap) || 0;
    return strip.children[0].getBoundingClientRect().width + gap;
  };
  const place = (animate) => {
    strip.style.transition = animate ? "transform .8s cubic-bezier(0.2, 0.9, 0.25, 1)" : "none";
    strip.style.transform = `translateX(${-index * step()}px)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === ((index - n) % n + n) % n));
  };
  const go = (to) => { index = to; place(true); restart(); };
  strip.addEventListener("transitionend", () => {
    if (index >= 2 * n) { index -= n; place(false); }
    if (index < n) { index += n; place(false); }
  });
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(index + 1), 3000); };

  slider.querySelector(".prev").addEventListener("click", () => go(index - 1));
  slider.querySelector(".next").addEventListener("click", () => go(index + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => go(n + i)));
  window.addEventListener("resize", () => place(false));
  place(false);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) restart();
}

// Floating nav: add a soft shadow once the page has scrolled
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Cursor dot: follows the pointer with a little lag, grows over links, pulses on click
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (finePointer && !calm) {
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  let x = -100, y = -100, dx = x, dy = y;
  window.addEventListener("mousemove", (e) => {
    x = e.clientX; y = e.clientY;
    if (!dot.classList.contains("on")) { dx = x; dy = y; dot.classList.add("on"); }
    dot.classList.toggle("hover", !!e.target.closest("a, button, .project, .t-card"));
  }, { passive: true });
  document.addEventListener("mouseleave", () => dot.classList.remove("on"));
  window.addEventListener("mousedown", () => {
    dot.classList.remove("press"); void dot.offsetWidth; dot.classList.add("press");
  });
  const tick = () => {
    dx += (x - dx) * 0.18; dy += (y - dy) * 0.18;
    dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
