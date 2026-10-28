/* DAY ONE CLUB · interações */

// >>> PREENCHER: número do WhatsApp da equipe, só dígitos com DDI (ex.: 5511999999999)
const WHATSAPP_NUMBER = "";

// Menu mobile
const burger = document.querySelector(".burger");
const links = document.querySelector(".nav-links");
if (burger && links) {
  burger.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
}

// Reveal em cascata: entra quando aparece na tela, escalonado dentro do mesmo pai
(() => {
  const sel = ".section-head, .card, .pillar-grid, .carousel, .car-dots, .mirror li, .proof-card, .fit .col, .founder > *, .form, .stat, .next, .gallery .placeholder, .closer, .mirror-foot, .proof-foot, .hero-badge, .hero h1, .hero .lead, .vsl, .hero-cta, .ev-video";
  const els = document.querySelectorAll(sel);
  els.forEach(el => {
    el.classList.add("rv");
    const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains("rv"));
    const i = sibs.indexOf(el);
    if (i > 0) el.classList.add("rv-d" + Math.min(i, 8));
  });
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  els.forEach(el => io.observe(el));
})();

// Spotlight: luz dourada que segue o mouse nos cards
document.querySelectorAll(".card, .pillar, .fit .col, .form").forEach(el => {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

// Contadores: sobem do zero quando entram na tela
(() => {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;
  const run = el => {
    const target = parseInt(el.dataset.count, 10);
    const t0 = performance.now(), dur = 1400;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: .6 });
  nums.forEach(n => { n.textContent = "0"; io.observe(n); });
})();

// Marquee: duplica a faixa pra rodar sem emenda
document.querySelectorAll(".marquee-track").forEach(t => { t.innerHTML += t.innerHTML; });

// Carrossel de experiências: setas, bolinhas, arraste, teclado e autoplay com barra
document.querySelectorAll(".carousel").forEach(car => {
  const track = car.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const dots = Array.from(car.parentElement.querySelectorAll(".car-dots button"));
  const dur = parseInt(car.dataset.autoplay || "0", 10);
  const bar = document.createElement("div"); bar.className = "car-progress"; bar.innerHTML = "<i></i>"; car.appendChild(bar);
  car.style.setProperty("--car-dur", dur + "ms");
  let i = 0, timer = null, startX = 0, dx = 0, dragging = false;
  const go = n => {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    slides.forEach((s, k) => s.classList.toggle("on", k === i));
    dots.forEach((d, k) => d.classList.toggle("on", k === i));
    restart();
  };
  const restart = () => {
    if (!dur) return;
    clearTimeout(timer);
    car.classList.remove("playing"); void bar.offsetWidth; car.classList.add("playing");
    timer = setTimeout(() => go(i + 1), dur);
  };
  car.querySelector(".prev").addEventListener("click", () => go(i - 1));
  car.querySelector(".next").addEventListener("click", () => go(i + 1));
  dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
  car.addEventListener("pointerdown", e => { if (e.target.closest(".car-btn")) return; dragging = true; startX = e.clientX; dx = 0; car.classList.add("dragging"); car.setPointerCapture(e.pointerId); clearTimeout(timer); });
  car.addEventListener("pointermove", e => { if (!dragging) return; dx = e.clientX - startX; track.style.transform = `translateX(calc(-${i * 100}% + ${dx}px))`; });
  const end = () => { if (!dragging) return; dragging = false; car.classList.remove("dragging"); if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1); else go(i); };
  car.addEventListener("pointerup", end); car.addEventListener("pointercancel", end);
  car.addEventListener("mouseenter", () => { clearTimeout(timer); car.classList.remove("playing"); });
  car.addEventListener("mouseleave", restart);
  car.tabIndex = 0;
  car.addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); });
  const io = new IntersectionObserver(en => { en.forEach(e => { if (e.isIntersecting) { go(0); io.disconnect(); } }); }, { threshold: .3 });
  io.observe(car);
  slides[0].classList.add("on");
});

// Pilares no celular: carrossel horizontal com passagem automática, toque pra avançar e bolinhas
(() => {
  const grid = document.querySelector(".pillar-grid");
  const dotsBox = document.querySelector(".pillar-dots");
  if (!grid || !dotsBox) return;
  const cards = Array.from(grid.children);
  const mq = matchMedia("(max-width:720px)");
  let timer = null, i = 0, paused = false;
  dotsBox.innerHTML = cards.map(() => "<i></i>").join("");
  const dots = Array.from(dotsBox.children);
  const mark = () => dots.forEach((d, k) => d.classList.toggle("on", k === i));
  const goTo = n => {
    i = (n + cards.length) % cards.length;
    const c = cards[i];
    grid.scrollTo({ left: c.offsetLeft - (grid.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
    mark();
  };
  const schedule = () => { clearTimeout(timer); if (mq.matches && !paused) timer = setTimeout(() => { goTo(i + 1); schedule(); }, 4200); };
  // acompanha o scroll feito com o dedo
  let st = null;
  grid.addEventListener("scroll", () => {
    clearTimeout(st);
    st = setTimeout(() => {
      const mid = grid.scrollLeft + grid.clientWidth / 2;
      let best = 0, bd = 1e9;
      cards.forEach((c, k) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
      i = best; mark();
    }, 80);
  }, { passive: true });
  // toque no card avança; segurar pausa
  cards.forEach(c => c.addEventListener("click", () => { if (mq.matches) { goTo(i + 1); schedule(); } }));
  grid.addEventListener("touchstart", () => { paused = true; clearTimeout(timer); }, { passive: true });
  grid.addEventListener("touchend", () => { paused = false; schedule(); }, { passive: true });
  dots.forEach((d, k) => d.addEventListener("click", () => { goTo(k); schedule(); }));
  const start = () => { if (!mq.matches) { clearTimeout(timer); return; } mark(); schedule(); };
  mq.addEventListener ? mq.addEventListener("change", start) : mq.addListener(start);
  const io = new IntersectionObserver(en => { en.forEach(e => { if (e.isIntersecting) start(); else clearTimeout(timer); }); }, { threshold: .2 });
  io.observe(grid);
  mark();
})();

// Espelho: contador de "quantas são suas"
const mirror = document.querySelector(".mirror");
if (mirror) {
  const out = document.querySelector(".mirror-foot .count");
  const update = () => {
    const n = mirror.querySelectorAll("li.on").length;
    if (!out) return;
    if (n === 0) out.textContent = "Toque nas frases que são suas.";
    else if (n < 3) out.textContent = `${n} de 8, continua lendo.`;
    else out.textContent = `${n} de 8, esta página foi feita para você.`;
  };
  mirror.querySelectorAll("li").forEach(li => li.addEventListener("click", () => { li.classList.toggle("on"); update(); }));
  update();
}

// VSL: placeholder de player (trocar pelo embed real quando o vídeo existir)
const vsl = document.querySelector(".vsl");
if (vsl) {
  vsl.addEventListener("click", () => {
    const src = vsl.dataset.src;
    if (!src) { alert("VSL ainda não configurada. Coloque a URL do vídeo em data-src na div .vsl."); return; }
    vsl.innerHTML = `<iframe src="${src}" title="VSL Day One Club" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>`;
  });
}

// Cards de prova: tocar/pausar vídeo
document.querySelectorAll(".proof-card").forEach(card => {
  const v = card.querySelector("video");
  if (!v) return;
  card.querySelector(".media").addEventListener("click", () => {
    if (v.paused) {
      document.querySelectorAll(".proof-card video").forEach(o => { if (o !== v) { o.pause(); o.closest(".proof-card").classList.remove("playing"); } });
      v.play(); card.classList.add("playing");
    } else { v.pause(); card.classList.remove("playing"); }
  });
  v.addEventListener("ended", () => card.classList.remove("playing"));
});

// Formulário de aplicação → WhatsApp com as respostas
const form = document.querySelector("#form-aplicacao");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = new FormData(form);
    const g = k => (d.get(k) || "").toString().trim();
    const msg = [
      "*Aplicação · Day One Club · Comunidade*",
      "",
      `*Nome:* ${g("nome")}`,
      `*WhatsApp:* ${g("whatsapp")}`,
      `*O que faz:* ${g("negocio")}`,
      `*Como se define:* ${g("perfil")}`,
      `*Faturamento médio mensal:* ${g("faturamento")}`,
      `*Maior problema hoje:* ${g("problema")}`,
      `*Por que mudar de ambiente agora:* ${g("motivo")}`,
      `*Topa executar uma estratégia por semana:* ${g("compromisso")}`
    ].join("\n");
    if (!WHATSAPP_NUMBER) {
      alert("Formulário pronto. Falta configurar o número do WhatsApp em js/main.js (WHATSAPP_NUMBER).");
      console.log(msg);
      return;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  });
}
