function applyTheme() {
  const config = window.VALENTINE_CONFIG;

  if (!config || !config.colors || !config.animations) {
    console.warn("VALENTINE_CONFIG missing or incomplete. Theme not applied.");
    return;
  }

  const root = document.documentElement;

  // Colors
  root.style.setProperty("--background-color-1", config.colors.backgroundStart);
  root.style.setProperty("--background-color-2", config.colors.backgroundEnd);
  root.style.setProperty("--button-color", config.colors.buttonBackground);
  root.style.setProperty("--button-hover", config.colors.buttonHover);
  root.style.setProperty("--text-color", config.colors.textColor);

  // Animations
  root.style.setProperty("--float-duration", config.animations.floatDuration);
  root.style.setProperty("--float-distance", config.animations.floatDistance);
  root.style.setProperty("--bounce-speed", config.animations.bounceSpeed);
  root.style.setProperty("--heart-explosion-size", config.animations.heartExplosionSize);
}

window.addEventListener("DOMContentLoaded", applyTheme);
