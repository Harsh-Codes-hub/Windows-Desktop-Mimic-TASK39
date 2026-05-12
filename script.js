// Panels
const panels = {
  start: {
    trigger: document.querySelector(".start-trigger"),
    panel: document.querySelector(".start-menu"),
  },

  language: {
    trigger: document.querySelector(".language-trigger"),
    panel: document.querySelector(".language-panel"),
  },

  action: {
    trigger: document.querySelector(".quick-action-trigger"),
    panel: document.querySelector(".quick-action-panel"),
  },

  tray: {
    trigger: document.querySelector(".tray-trigger"),
    panel: document.querySelector(".tray-panel"),
  },

  notification: {
    trigger: document.querySelector(".notification-trigger"),
    panel: document.querySelector(".notification-panel"),
  },
};

function closeAllPanels() {
  Object.values(panels).forEach(({ panel }) => {
    panel.classList.remove("active-panel");
  });
}

Object.values(panels).forEach(({ trigger, panel }) => {
  trigger.addEventListener("click", () => {
    const isActive = panel.classList.contains("active-panel");
    closeAllPanels();

    if (!isActive) {
      panel.classList.add("active-panel");
    }
  });
});

document.addEventListener("click", (e) => {
  const clickedInsidePanel = e.target.closest(".panel");
  const clickedTrigger = e.target.closest(".taskbar-item");
  if (!clickedInsidePanel && !clickedTrigger) {
    closeAllPanels();
  }
});
