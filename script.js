// ===== object Variables  =====
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

  time: {
    taskbarTime: document.querySelector(".taskbar-time"),

    taskbarDate: document.querySelector(".taskbar-date"),

    calendarDay: document.querySelector(".calendar-day-name"),

    calendarDate: document.querySelector(".calendar-full-date"),
  },

  calendar: {
    grid: document.querySelector(".calendar-grid"),

    monthLabel: document.querySelector(".calendar-month-label"),

    navTriggers: document.querySelectorAll(".calendar-nav-trigger"),
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

const systemState = {
  currentDate: new Date(),
  calendarDate: new Date(),
};

// ===== Functions =====

// Time formatter
function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Date formatter
function formatDate(date) {
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Day Formatter
function formatDay(date) {
  return date.toLocaleDateString([], {
    weekday: "long",
  });
}

// Calender Date Formatter
function formatCalendarDate(date) {
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "long",
  });
}

// Update UI Function

function updateClock() {
  systemState.currentDate = new Date();

  ui.time.taskbarTime.textContent = formatTime(systemState.currentDate);

  ui.time.taskbarDate.textContent = formatDate(systemState.currentDate);

  ui.time.calendarDay.textContent = formatDay(systemState.currentDate);

  ui.time.calendarDate.textContent = formatCalendarDate(
    systemState.currentDate,
  );
}

// Calendar Render Function
function renderCalender() {
  const currentDate = systemState.calendarDate;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startingDay = firstDay.getDay();

  const totalDays = lastDay.getDate();

  ui.calendar.grid.innerHTML = "";
  const previousMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDay; i > 0; i--) {
    const button = document.createElement("button");

    button.classList.add("calendar-day", "muted-day");

    button.textContent = previousMonthLastDay - i + 1;

    ui.calendar.grid.appendChild(button);
  }

  for (let day = 1; day <= totalDays; day++) {
    const button = document.createElement("button");
    button.classList.add("calendar-day");

    button.textContent = day;

    const today = new Date();

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (isToday) {
      button.classList.add("active-day");
    }

    ui.calendar.grid.appendChild(button);
    ui.calendar.monthLabel.textContent = currentDate.toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });
  }

  const totalCells = ui.calendar.grid.children.length;
  const remainingCells = 42 - totalCells;

  for (let day = 1; day <= remainingCells; day++) {
    const button = document.createElement("button");

    button.classList.add("calendar-day", "muted-day");

    button.textContent = day;

    ui.calendar.grid.appendChild(button);
  }
}

// ===== logic =====
updateClock();
setInterval(updateClock, 1000);
renderCalender();

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
