const SLIDES = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg",
    caption: "The flag of Bosnia & Herzegovina — the gold stars and blue represent Europe and the blue of peace."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Trionda_2026Fifa_World_Cup_Football_Championship_Official_Ball_at_Bic_Camera_Namba.jpg",
    caption: "Trionda — the official match ball of the 2026 FIFA World Cup."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/00/CAN-BIH_2026-06-12.svg",
    caption: "Match report: Canada vs Bosnia & Herzegovina — Group H, 12 June 2026."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/56/2026_FIFA_World_Cup_Match_26%2C_Switzerland_v_Bosnia_and_Herzegovina.jpg",
    caption: "Switzerland vs Bosnia & Herzegovina — Group H match 26 at the 2026 FIFA World Cup."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/SUI-BIH_2026-06-18.svg",
    caption: "Match report: Switzerland vs Bosnia & Herzegovina — Group H, 18 June 2026."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/1c/BIH-QAT_2026-06-24.svg",
    caption: "Match report: Bosnia & Herzegovina vs Qatar — Group H, 24 June 2026."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Bosna_i_Hercegovina_-_Njema%C4%8Dka_%2811.10.2024%29_3.jpg",
    caption: "Bosnia & Herzegovina vs Germany — UEFA qualifying match, October 2024."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/20150331_2026_AUT_BIH_2177_Edin_D%C5%BEeko.jpg",
    caption: "Edin Džeko — Bosnia's all-time top scorer, one of the Dragons' greatest ever players."
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/98/Bosnia_Soccer_Fans_at_King_Baudouin_Stadium_Brussels.jpg",
    caption: "Bosnian football fans — the passionate support that travels with the Dragons."
  }
];

const ADVANCE_MS = 4000;

const track = document.getElementById("track");
const dotsEl = document.getElementById("dots");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnPause = document.getElementById("btnPause");
const counter = document.getElementById("counter");

let current = 0;
let userPaused = false;
let hoverPaused = false;
let timer = null;

// build slides
SLIDES.forEach((slide, i) => {
  const div = document.createElement("div");
  div.className = "slide" + (i === 0 ? " active" : "");
  div.dataset.index = i;

  const img = document.createElement("img");
  img.src = slide.src;
  img.alt = slide.caption;
  img.referrerPolicy = "no-referrer";
  img.crossOrigin = "anonymous";
  img.onerror = () => {
    div.classList.add("img-error");
  };

  // hover-pause
  div.addEventListener("mouseenter", () => { hoverPaused = true; clearTimer(); updatePauseBtn(); });
  div.addEventListener("mouseleave", () => { hoverPaused = false; if (!userPaused) startTimer(); updatePauseBtn(); });

  const cap = document.createElement("div");
  cap.className = "caption";
  cap.textContent = slide.caption;

  const ph = document.createElement("div");
  ph.className = "placeholder";
  const phSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  phSvg.setAttribute("width", "80");
  phSvg.setAttribute("height", "60");
  const phUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  phUse.setAttribute("href", "#img-broken");
  phSvg.appendChild(phUse);
  const phSpan = document.createElement("span");
  phSpan.textContent = "Image unavailable";
  ph.appendChild(phSvg);
  ph.appendChild(phSpan);

  div.appendChild(img);
  div.appendChild(ph);
  div.appendChild(cap);
  track.appendChild(div);

  // dot
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", "Slide " + (i + 1));
  dot.addEventListener("click", () => goTo(i));
  dotsEl.appendChild(dot);
});

function updateCounter() {
  counter.textContent = (current + 1) + " / " + SLIDES.length;
}

function updateDots() {
  dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === current));
}

function updateSlides() {
  track.querySelectorAll(".slide").forEach((s, i) => s.classList.toggle("active", i === current));
  updateDots();
  updateCounter();
}

function goTo(n) {
  current = (n + SLIDES.length) % SLIDES.length;
  updateSlides();
}

function advance() { goTo(current + 1); }

function startTimer() {
  clearTimer();
  if (!userPaused && !hoverPaused) timer = setInterval(advance, ADVANCE_MS);
}

function clearTimer() {
  if (timer) { clearInterval(timer); timer = null; }
}

function updatePauseBtn() {
  btnPause.textContent = userPaused ? "▶ Play" : "⏸ Pause";
}

btnPrev.addEventListener("click", () => { goTo(current - 1); startTimer(); });
btnNext.addEventListener("click", () => { goTo(current + 1); startTimer(); });

btnPause.addEventListener("click", () => {
  userPaused = !userPaused;
  userPaused || hoverPaused ? clearTimer() : startTimer();
  updatePauseBtn();
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft")  { goTo(current - 1); startTimer(); }
  if (e.key === "ArrowRight") { goTo(current + 1); startTimer(); }
  if (e.key === " ")          { btnPause.click(); e.preventDefault(); }
});

updateCounter();
startTimer();
