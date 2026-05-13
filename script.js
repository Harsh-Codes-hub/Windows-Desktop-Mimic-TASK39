// object Variables
const ui = {
  panels: {
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
  },

  desktop: {
    area: document.querySelector(".desktop-area"),

    contextLayer: document.querySelector(".context-layer"),

    contextMenu: document.querySelector(".desktop-context-menu"),
  },
};

const utils = {
  closeAllPanels() {
    Object.values(ui.panels).forEach(({ panel }) => {
      panel.classList.remove("active-panel");
    });
  },

  hideContextMenu() {
    ui.desktop.contextMenu.style.display = "none";
  },
};

function closeAllPanels() {
  Object.values(panels).forEach(({ panel }) => {
    panel.classList.remove("active-panel");
  });
}

Object.values(ui.panels).forEach(({ trigger, panel }) => {
  trigger.addEventListener("click", () => {
    const isActive = panel.classList.contains("active-panel");

    utils.closeAllPanels();

    if (!isActive) {
      panel.classList.add("active-panel");
    }
  });
});

document.addEventListener("click", (e) => {
  const clickedInsidePanel = e.target.closest(".panel");

  const clickedTrigger = e.target.closest(".taskbar-item");

  const clickedInsideContext = e.target.closest(".context-menu");

  if (!clickedInsidePanel && !clickedTrigger) {
    utils.closeAllPanels();
  }

  if (!clickedInsideContext) {
    utils.hideContextMenu();
  }
});

ui.desktop.area.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  const layerWidth = ui.desktop.contextLayer.clientWidth;

  const layerHeight = ui.desktop.contextLayer.clientHeight;

  const menuWidth = ui.desktop.contextMenu.offsetWidth;

  const menuHeight = ui.desktop.contextMenu.offsetHeight;

  let x = e.clientX;
  let y = e.clientY;

  if (x + menuWidth > layerWidth) {
    x = layerWidth - menuWidth;
  }

  if (y + menuHeight > layerHeight) {
    y = layerHeight - menuHeight;
  }

  Object.assign(ui.desktop.contextMenu.style, {
    display: "block",
    left: `${x}px`,
    top: `${y}px`,
  });
});
