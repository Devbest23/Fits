/* FITS - Tailwind Config & Scripts */

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-variant": "#e3e2e8",
        "on-surface": "#1a1b20",
        "surface-dim": "#dad9e0",
        "inverse-primary": "#b2c5ff",
        "primary-fixed-dim": "#b2c5ff",
        "on-primary": "#ffffff",
        "on-background": "#1a1b20",
        "on-secondary-container": "#505280",
        "on-secondary": "#ffffff",
        background: "#faf8ff",
        "surface-container-highest": "#e3e2e8",
        "outline-variant": "#c4c6d2",
        "secondary-fixed": "#e1e0ff",
        "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed": "#001848",
        "secondary-fixed-dim": "#c1c2f8",
        "on-tertiary-fixed": "#2c1600",
        "surface-bright": "#faf8ff",
        "on-error-container": "#93000a",
        secondary: "#595a89",
        "inverse-surface": "#2f3035",
        "surface-container-high": "#e9e7ee",
        tertiary: "#573100",
        "tertiary-fixed-dim": "#ffb86e",
        "on-tertiary-fixed-variant": "#693c00",
        "on-error": "#ffffff",
        "on-primary-container": "#afc2ff",
        error: "#ba1a1a",
        "secondary-container": "#c7c7fe",
        "tertiary-fixed": "#ffdcbd",
        "surface-tint": "#415c9f",
        "on-tertiary": "#ffffff",
        "primary-fixed": "#dae2ff",
        "on-secondary-fixed-variant": "#414270",
        primary: "#183678",
        outline: "#747782",
        "surface-container-low": "#f4f3f9",
        "on-surface-variant": "#444650",
        "primary-container": "#334e91",
        "tertiary-container": "#774500",
        surface: "#faf8ff",
        "inverse-on-surface": "#f1f0f6",
        "on-tertiary-container": "#fcb56b",
        "on-primary-fixed-variant": "#284386",
        "on-secondary-fixed": "#151642",
        "surface-container": "#eeedf3",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      spacing: {
        md: "16px",
        "2xl": "64px",
        lg: "24px",
        xs: "4px",
        "margin-desktop": "48px",
        sm: "8px",
        xl: "40px",
        unit: "4px",
        gutter: "20px",
        "margin-mobile": "16px",
      },
      fontFamily: {
        "label-sm": ["Hanken Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "display-lg-mobile": ["Space Grotesk", "sans-serif"],
        "display-lg": ["Space Grotesk", "sans-serif"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "body-lg": ["Hanken Grotesk", "sans-serif"],
      },
      fontSize: {
        "label-sm": ["13px", { lineHeight: "1.4", fontWeight: "500" }],
        "headline-md": [
          "32px",
          {
            lineHeight: "1.2",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-sm": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "display-lg-mobile": [
          "36px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "display-lg": [
          "48px",
          {
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "label-caps": [
          "12px",
          {
            lineHeight: "1.0",
            letterSpacing: "0.08em",
            fontWeight: "500",
          },
        ],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("menu-icon");
  if (toggle && menu && icon) {
    toggle.addEventListener("click", function () {
      const isOpen = !menu.classList.contains("hidden");
      menu.classList.toggle("hidden");
      icon.textContent = isOpen ? "menu" : "close";
    });
  }
});
