/**
 * slideshow.test.js — Node.js unit tests for slideshow logic
 *
 * Run with:  node slideshow/slideshow.test.js
 *
 * No external dependencies — uses only Node built-in `assert`.
 *
 * Strategy: the core logic (goTo, startTimer, clearTimer, pause handling) is
 * self-contained and only depends on a few variables. We duplicate that minimal
 * set here so we can test it without a real DOM or browser APIs.
 */

"use strict";
const assert = require("assert");

// ---------------------------------------------------------------------------
// Minimal stubs (only what the functions under test actually touch)
// ---------------------------------------------------------------------------

// Fake slides array — we test with 5 slides for easy arithmetic.
const SLIDES = [{}, {}, {}, {}, {}];
const ADVANCE_MS = 4000;

// Fake timer infrastructure — track calls without real timers.
let _intervalCallback = null;
let _intervalActive = false;
function fakeSetInterval(fn) { _intervalCallback = fn; _intervalActive = true; return 42; }
function fakeClearInterval() { _intervalCallback = null; _intervalActive = false; }

// Fake counter/dots elements — just need textContent/classList stubs.
const counterEl = { textContent: "" };
const dotsEl = {
  _dots: SLIDES.map(() => ({ classList: { _active: false, toggle(cls, v) { this._active = v; } } })),
  querySelectorAll() { return this._dots; }
};
const trackEl = {
  _slides: SLIDES.map(() => ({ classList: { _active: false, toggle(cls, v) { this._active = v; } } })),
  querySelectorAll() { return this._slides; }
};
const btnPauseEl = { textContent: "" };

// ---------------------------------------------------------------------------
// Core logic under test (mirrors slideshow.js exactly after the fix)
// ---------------------------------------------------------------------------

let current = 0;
let userPaused = false;
let hoverPaused = false;
let timer = null;

function updateCounter() {
  counterEl.textContent = (current + 1) + " / " + SLIDES.length;
}

function updateDots() {
  dotsEl.querySelectorAll().forEach((d, i) => d.classList.toggle("active", i === current));
}

function updateSlides() {
  trackEl.querySelectorAll().forEach((s, i) => s.classList.toggle("active", i === current));
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
  if (!userPaused && !hoverPaused) timer = fakeSetInterval(advance, ADVANCE_MS);
}

function clearTimer() {
  if (timer) { fakeClearInterval(timer); timer = null; }
}

function updatePauseBtn() {
  btnPauseEl.textContent = userPaused ? "▶ Play" : "⏸ Pause";
}

// Mirrors the btnPause click handler.
function clickPause() {
  userPaused = !userPaused;
  userPaused || hoverPaused ? clearTimer() : startTimer();
  updatePauseBtn();
}

// Mirrors the mouseenter handler on a slide div.
function slideMouseenter() {
  hoverPaused = true;
  clearTimer();
  updatePauseBtn();
}

// Mirrors the mouseleave handler on a slide div.
function slideMouseleave() {
  hoverPaused = false;
  if (!userPaused) startTimer();
  updatePauseBtn();
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function reset() {
  current = 0;
  userPaused = false;
  hoverPaused = false;
  timer = null;
  _intervalActive = false;
  _intervalCallback = null;
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  reset();
  try {
    fn();
    console.log("  PASS  " + name);
    passed++;
  } catch (e) {
    console.error("  FAIL  " + name);
    console.error("        " + e.message);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

console.log("\nslideshow.test.js — running tests\n");

// --- goTo() ---

test("goTo(0) sets current to 0", () => {
  goTo(0);
  assert.strictEqual(current, 0);
});

test("goTo(4) sets current to last slide (index 4)", () => {
  goTo(4);
  assert.strictEqual(current, 4);
});

test("goTo(-1) wraps to last slide", () => {
  goTo(-1);
  assert.strictEqual(current, SLIDES.length - 1);
});

test("goTo(SLIDES.length) wraps to 0", () => {
  goTo(SLIDES.length);
  assert.strictEqual(current, 0);
});

test("goTo(-1) from slide 0 goes to slide 4", () => {
  current = 0;
  goTo(current - 1);
  assert.strictEqual(current, 4);
});

test("goTo(SLIDES.length) from last slide wraps to 0", () => {
  current = SLIDES.length - 1;
  goTo(current + 1);
  assert.strictEqual(current, 0);
});

test("goTo() updates the active slide in trackEl", () => {
  goTo(2);
  assert.strictEqual(trackEl._slides[2].classList._active, true);
  assert.strictEqual(trackEl._slides[0].classList._active, false);
});

// --- startTimer() / clearTimer() ---

test("startTimer() starts the interval when not paused", () => {
  startTimer();
  assert.strictEqual(_intervalActive, true);
});

test("startTimer() does NOT start timer when userPaused is true", () => {
  userPaused = true;
  startTimer();
  assert.strictEqual(_intervalActive, false);
});

test("startTimer() does NOT start timer when hoverPaused is true", () => {
  hoverPaused = true;
  startTimer();
  assert.strictEqual(_intervalActive, false);
});

test("startTimer() does NOT start timer when both userPaused and hoverPaused are true", () => {
  userPaused = true;
  hoverPaused = true;
  startTimer();
  assert.strictEqual(_intervalActive, false);
});

test("clearTimer() stops the interval", () => {
  startTimer();
  assert.strictEqual(_intervalActive, true);
  clearTimer();
  assert.strictEqual(_intervalActive, false);
  assert.strictEqual(timer, null);
});

// --- Pause button (user-pause) ---

test("clicking pause toggles userPaused to true", () => {
  clickPause();
  assert.strictEqual(userPaused, true);
});

test("clicking pause twice restores userPaused to false", () => {
  clickPause();
  clickPause();
  assert.strictEqual(userPaused, false);
});

test("clicking pause stops the timer", () => {
  startTimer();
  assert.strictEqual(_intervalActive, true);
  clickPause();
  assert.strictEqual(_intervalActive, false);
});

test("clicking pause twice restarts the timer", () => {
  startTimer();
  clickPause();
  clickPause();
  assert.strictEqual(_intervalActive, true);
});

test("updatePauseBtn shows Play when userPaused", () => {
  userPaused = true;
  updatePauseBtn();
  assert.strictEqual(btnPauseEl.textContent, "▶ Play");
});

test("updatePauseBtn shows Pause when not userPaused", () => {
  userPaused = false;
  updatePauseBtn();
  assert.strictEqual(btnPauseEl.textContent, "⏸ Pause");
});

// --- Hover-pause interaction ---

test("mouseenter pauses the timer", () => {
  startTimer();
  assert.strictEqual(_intervalActive, true);
  slideMouseenter();
  assert.strictEqual(_intervalActive, false);
  assert.strictEqual(hoverPaused, true);
});

test("mouseleave resumes the timer when userPaused is false", () => {
  startTimer();
  slideMouseenter();
  assert.strictEqual(_intervalActive, false);
  slideMouseleave();
  assert.strictEqual(_intervalActive, true);
  assert.strictEqual(hoverPaused, false);
});

test("mouseleave does NOT restart timer when userPaused is true [BLOCKER fix]", () => {
  // User explicitly paused, then hovered over slide, then moved away.
  // The timer must NOT restart — user's intent takes priority.
  userPaused = true;
  slideMouseenter();
  assert.strictEqual(_intervalActive, false);
  slideMouseleave();
  assert.strictEqual(_intervalActive, false, "Timer must NOT restart after mouseleave when userPaused=true");
});

test("user-pause state survives a hover cycle [BLOCKER fix]", () => {
  // Scenario: user clicks Pause, then moves mouse in and out of slide.
  // Timer must remain stopped throughout.
  startTimer();           // timer running
  clickPause();           // user pauses → timer stops, userPaused=true
  assert.strictEqual(_intervalActive, false);
  slideMouseenter();      // hover: hoverPaused=true (timer already stopped)
  assert.strictEqual(_intervalActive, false);
  slideMouseleave();      // un-hover: hoverPaused=false — but userPaused is still true
  assert.strictEqual(_intervalActive, false, "Timer must stay stopped after hover cycle while userPaused");
  assert.strictEqual(userPaused, true, "userPaused must still be true after hover cycle");
});

test("hover pause does not affect updatePauseBtn display [BLOCKER fix]", () => {
  // The pause button should show Pause (not Play) during hover-pause,
  // since the user has not clicked Pause.
  startTimer();
  slideMouseenter();       // hover pauses — but userPaused is false
  updatePauseBtn();
  assert.strictEqual(btnPauseEl.textContent, "⏸ Pause",
    "Pause btn should still say Pause (not Play) during hover-pause only");
});

test("clicking pause while hovering: un-hovering still does not restart timer", () => {
  // User hovers → timer pauses; user clicks Pause; user un-hovers.
  // Timer should stay stopped (userPaused is true).
  startTimer();
  slideMouseenter();       // hoverPaused=true, timer stopped
  clickPause();            // userPaused=true
  slideMouseleave();       // hoverPaused=false, but userPaused=true → no restart
  assert.strictEqual(_intervalActive, false);
  assert.strictEqual(userPaused, true);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("\n" + (failed === 0 ? "All tests passed" : failed + " test(s) FAILED") +
  " (" + passed + " passed, " + failed + " failed)\n");

if (failed > 0) process.exit(1);
