// Pull config from window (set by config.js)
const config = window.VALENTINE_CONFIG;

if (!config) {
  throw new Error("VALENTINE_CONFIG not found. Make sure config.js loads before script.js.");
}

// Default color values
function getDefaultColor(key) {
  const defaults = {
    backgroundStart: "#ffafbd",
    backgroundEnd: "#ffc3a0",
    buttonBackground: "#ff6b6b",
    buttonHover: "#ff8787",
    textColor: "#ff4757",
  };
  return defaults[key];
}

// Validate configuration
function validateConfig() {
  const warnings = [];

  if (!config.valentineName) {
    warnings.push("Valentine's name is not set! Using default.");
    config.valentineName = "My Love";
  }

  // Validate colors
  const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

  if (!config.colors) config.colors = {};
  Object.entries({
    backgroundStart: config.colors.backgroundStart,
    backgroundEnd: config.colors.backgroundEnd,
    buttonBackground: config.colors.buttonBackground,
    buttonHover: config.colors.buttonHover,
    textColor: config.colors.textColor,
  }).forEach(([key, value]) => {
    if (!value || !isValidHex(value)) {
      warnings.push(`Invalid color for ${key}! Using default.`);
      config.colors[key] = getDefaultColor(key);
    }
  });

  // Validate animation values
  if (!config.animations) config.animations = {};
  if (parseFloat(config.animations.floatDuration) < 5) {
    warnings.push("Float duration too short! Setting to 5s minimum.");
    config.animations.floatDuration = "5s";
  }

  if (
    typeof config.animations.heartExplosionSize !== "number" ||
    config.animations.heartExplosionSize < 1 ||
    config.animations.heartExplosionSize > 3
  ) {
    warnings.push("Heart explosion size should be between 1 and 3! Using default.");
    config.animations.heartExplosionSize = 1.5;
  }

  if (warnings.length > 0) {
    console.warn("⚠️ Configuration Warnings:");
    warnings.forEach((w) => console.warn("- " + w));
  }
}

// Set page title
document.title = config.pageTitle || "Valentine 💝";

// Create floating hearts and bears
function createFloatingElements() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  // Clear anything existing (prevents duplicates on refresh)
  container.innerHTML = "";

  // Hearts
  (config.floatingEmojis?.hearts || []).forEach((heart) => {
    const div = document.createElement("div");
    div.className = "heart";
    div.innerHTML = heart;
    setRandomPosition(div);
    container.appendChild(div);
  });

  // Bears
  (config.floatingEmojis?.bears || []).forEach((bear) => {
    const div = document.createElement("div");
    div.className = "bear";
    div.innerHTML = bear;
    setRandomPosition(div);
    container.appendChild(div);
  });
}

// Set random position for floating elements
function setRandomPosition(element) {
  element.style.left = Math.random() * 100 + "vw";
  element.style.animationDelay = Math.random() * 5 + "s";
  element.style.animationDuration = 10 + Math.random() * 20 + "s";
}

// Show next question
function showNextQuestion(questionNumber) {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  const next = document.getElementById(`question${questionNumber}`);
  if (next) next.classList.remove("hidden");
}

// Move the button around
function moveButton(button) {
  const x = Math.random() * (window.innerWidth - button.offsetWidth);
  const y = Math.random() * (window.innerHeight - button.offsetHeight);
  button.style.position = "fixed";
  button.style.left = x + "px";
  button.style.top = y + "px";
}

// Love meter init (must run after DOM exists)
function initLoveMeter() {
  const loveMeter = document.getElementById("loveMeter");
  const loveValue = document.getElementById("loveValue");
  const extraLove = document.getElementById("extraLove");

  if (!loveMeter || !loveValue || !extraLove) {
    console.warn("Love meter elements not found. Skipping love meter init.");
    return;
  }

  function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = "100";
    loveMeter.style.width = "100%";
  }

  setInitialPosition();

  loveMeter.addEventListener("input", () => {
    const value = parseInt(loveMeter.value, 10);
    loveValue.textContent = String(value);

    if (value > 100) {
      extraLove.classList.remove("hidden");

      const overflowPercentage = (value - 100) / 9900;
      const extraWidth = overflowPercentage * window.innerWidth * 0.8;
      loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
      loveMeter.style.transition = "width 0.3s";

      if (value >= 5000) {
        extraLove.classList.add("super-love");
        extraLove.textContent = config.loveMessages.extreme;
      } else if (value > 1000) {
        extraLove.classList.remove("super-love");
        extraLove.textContent = config.loveMessages.high;
      } else {
        extraLove.classList.remove("super-love");
        extraLove.textContent = config.loveMessages.normal;
      }
    } else {
      extraLove.classList.add("hidden");
      extraLove.classList.remove("super-love");
      loveMeter.style.width = "100%";
    }
  });
}

// Celebration
function celebrate() {
  document.querySelectorAll(".question-section").forEach((q) => q.classList.add("hidden"));
  const celebration = document.getElementById("celebration");
  if (!celebration) return;

  celebration.classList.remove("hidden");

  document.getElementById("celebrationTitle").textContent = config.celebration.title;
  document.getElementById("celebrationMessage").textContent = config.celebration.message;
  document.getElementById("celebrationEmojis").textContent = config.celebration.emojis;

  createHeartExplosion();
}

// Heart explosion animation
function createHeartExplosion() {
  const container = document.querySelector(".floating-elements");
  if (!container) return;

  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("div");
    const hearts = config.floatingEmojis?.hearts || ["❤️"];
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    heart.innerHTML = randomHeart;
    heart.className = "heart";
    container.appendChild(heart);
    setRandomPosition(heart);
  }
}

// Music Player Setup
function setupMusicPlayer() {
  const musicControls = document.getElementById("musicControls");
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  const musicSource = document.getElementById("musicSource");

  if (!musicControls || !musicToggle || !bgMusic || !musicSource) return;

  if (!config.music?.enabled) {
    musicControls.style.display = "none";
    return;
  }

  musicSource.src = config.music.musicUrl;
  bgMusic.volume = typeof config.music.volume === "number" ? config.music.volume : 0.5;
  bgMusic.load();

  // Try autoplay if enabled
  if (config.music.autoplay) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          musicToggle.textContent = config.music.stopText;
        })
        .catch(() => {
          // Browser blocked autoplay
          musicToggle.textContent = config.music.startText;
        });
    }
  } else {
    musicToggle.textContent = config.music.startText;
  }

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = config.music.stopText;
    } else {
      bgMusic.pause();
      musicToggle.textContent = config.music.startText;
    }
  });
}

// DOM init
window.addEventListener("DOMContentLoaded", () => {
  validateConfig();

  const title = document.getElementById("valentineTitle");
  if (title) title.textContent = `${config.valentineName}, my love...`;

  // Question 1
  const q1 = config.questions?.first;
  if (q1) {
    document.getElementById("question1Text").textContent = q1.text;
    document.getElementById("yesBtn1").textContent = q1.yesBtn;
    document.getElementById("noBtn1").textContent = q1.noBtn;
    document.getElementById("secretAnswerBtn").textContent = q1.secretAnswer;
  }

  // Question 2
  const q2 = config.questions?.second;
  if (q2) {
    document.getElementById("question2Text").textContent = q2.text;
    document.getElementById("startText").textContent = q2.startText;
    document.getElementById("nextBtn").textContent = q2.nextBtn;
  }

  // Question 3
  const q3 = config.questions?.third;
  if (q3) {
    document.getElementById("question3Text").textContent = q3.text;
    document.getElementById("yesBtn3").textContent = q3.yesBtn;
    document.getElementById("noBtn3").textContent = q3.noBtn;
  }

  createFloatingElements();
  setupMusicPlayer();
  initLoveMeter();
});

// Expose these to inline HTML onclick="" calls
window.showNextQuestion = showNextQuestion;
window.moveButton = moveButton;
window.celebrate = celebrate;
