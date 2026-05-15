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

    shell: document.querySelector(".desktop-shell"),

    refresh: document.querySelector(".refresh-trigger"),
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

    section: document.querySelector(".calendar-section"),

    collapseTrigger: document.querySelector(".calendar-collapse-trigger"),
  },

  focus: {
    duration: document.querySelector(".focus-duration"),

    triggers: document.querySelectorAll(".focus-time-trigger"),

    start: document.querySelector(".focus-trigger"),

    modal: document.querySelector(".focus-modal"),

    countdown: document.querySelector(".focus-countdown"),

    stop: document.querySelector(".focus-stop-trigger"),

    reset: document.querySelector(".focus-reset-trigger"),

    cancel: document.querySelector(".focus-cancel-trigger"),
  },

  sounds: {
    focusComplete: new Audio("./sounds/alarm-sound.mp3"),
  },

  actions: {
    buttons: document.querySelectorAll(".action-item"),

    taskbarWifi: document.querySelector(".quick-action-trigger .ri-wifi-line"),

    taskbarVolume: document.querySelector(
      ".quick-action-trigger .ri-volume-up-line",
    ),
  },

  sliders: {
    controls: document.querySelectorAll(".action-slider"),
  },

  battery: {
    level: document.querySelector(".battery-level"),

    taskbar: document.querySelector(".taskbar-battery-level"),
  },

  language: {
    items: document.querySelectorAll(".language-item"),

    taskbarCode: document.querySelectorAll(".language-trigger span"),
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
  focusTimer: {
    duration: 30,
    remaining: 30 * 60,
    active: false,
    interval: null,
    paused: false,
  },
  actions: {
    wifi: true,
    bluetooth: true,
  },
  environment: {
    brightness: 100,
    volume: 100,
  },
  battery: {
    level: 100,
    charging: false,
  },
  language: "ENG IN",
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
function renderCalendar() {
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

// Render Focus Duration

function renderFocusDuration() {
  ui.focus.duration.textContent = `${systemState.focusTimer.duration} mins`;
}

// Countdown Formatter Function

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")} : ${String(remainingSeconds).padStart(2, "0")}`.replace(
    /\s/g,
    "",
  );
}

// Render Countdown Function

function renderCountdown() {
  ui.focus.countdown.textContent = formatCountdown(
    systemState.focusTimer.remaining,
  );
}

// Focus Timer Start Function

function startFocusTimer() {
  if (systemState.focusTimer.active) return;

  systemState.focusTimer.active = true;

  systemState.focusTimer.paused = false;

  systemState.focusTimer.remaining = systemState.focusTimer.duration * 60;

  renderCountdown();

  runFocusCountdown();

  utils.closeAllPanels();
  ui.focus.modal.classList.add("active-panel");
}

// Focus Countdown Function

function runFocusCountdown() {
  systemState.focusTimer.interval = setInterval(() => {
    systemState.focusTimer.remaining--;

    renderCountdown();

    if (systemState.focusTimer.remaining <= 0) {
      clearInterval(systemState.focusTimer.interval);

      systemState.focusTimer.interval = null;

      systemState.focusTimer.active = false;

      ui.sounds.focusComplete.loop = true;

      ui.sounds.focusComplete.currentTime = 0;

      ui.sounds.focusComplete.play();

      Swal.fire({
        title: "Focus Session Complete",

        text: "Great work. Time for a short break.",

        icon: "success",

        confirmButtonText: "Dismiss",
      }).then(() => {
        ui.sounds.focusComplete.pause();

        ui.sounds.focusComplete.currentTime = 0;

        ui.sounds.focusComplete.loop = false;
      });
    }
  }, 1000);
}

// Focus toggle Function

function toggleFocusTimer() {
  const timer = systemState.focusTimer;

  if (!timer.active) return;

  if (!timer.paused) {
    clearInterval(timer.interval);

    timer.interval = null;

    timer.paused = true;

    ui.focus.stop.textContent = "Resume";
  } else {
    timer.paused = false;

    runFocusCountdown();

    ui.focus.stop.textContent = "Stop";
  }
}

// Focus Reset Function

function resetFocusTimer(shouldClose = false) {
  clearInterval(systemState.focusTimer.interval);

  systemState.focusTimer.interval = null;

  systemState.focusTimer.active = false;

  systemState.focusTimer.paused = false;

  systemState.focusTimer.remaining = systemState.focusTimer.duration * 60;

  renderCountdown();

  ui.focus.stop.textContent = "Stop";

  if (shouldClose) {
    ui.focus.modal.classList.remove("active-panel");
  }
}

// Render Action Function

function renderActions() {
  ui.actions.buttons.forEach((button) => {
    const action = button.dataset.action;
    if (action === "focus") return;
    button.classList.toggle("active-action", systemState.actions[action]);
    ui.actions.taskbarWifi.className = systemState.actions.wifi
      ? "ri-wifi-line"
      : "ri-wifi-off-line";
  });
}

// Render Brightness Function

function renderBrightness() {
  const safeBrightness = Math.max(systemState.environment.brightness, 20);

  ui.desktop.shell.style.filter = `brightness(${safeBrightness}%)`;
}

// Volume Icon Function

function getVolumeIcon() {
  const volume = systemState.environment.volume;

  if (volume <= 0) return "ri-volume-mute-line";

  if (volume <= 30) return "ri-volume-down-line";

  return "ri-volume-up-line";
}

// Render Volume Function

function renderVolume() {
  const normalizedVolume = systemState.environment.volume / 100;

  Object.values(ui.sounds).forEach((sound) => {
    sound.volume = normalizedVolume;
    ui.actions.taskbarVolume.className = getVolumeIcon();
  });
}

// Render Battery function
function renderBattery() {
  const batteryLevel = `${systemState.battery.level}%`;

  ui.battery.level.textContent = batteryLevel;

  ui.battery.taskbar.textContent = batteryLevel;
}

// Battery Data Function
async function initializeBattery() {
  if (!navigator.getBattery) return;

  const battery = await navigator.getBattery();

  function updateBatteryInfo() {
    systemState.battery.level = Math.floor(battery.level * 100);

    systemState.battery.charging = battery.charging;

    renderBattery();
  }

  updateBatteryInfo();

  battery.addEventListener("levelchange", updateBatteryInfo);

  battery.addEventListener("chargingchange", updateBatteryInfo);
}

// Language Render Function

function renderLanguage() {
  ui.language.items.forEach((item) => {
    item.classList.toggle(
      "active-language",

      item.dataset.language === systemState.language,
    );
  });

  const [language, region] = systemState.language.split(" ");

  ui.language.taskbarCode[0].textContent = language;

  ui.language.taskbarCode[1].textContent = region;
}

// ===== Implying  =====
updateClock();
setInterval(updateClock, 1000);
renderCalendar();
renderActions();
initializeBattery();
renderBrightness();
renderVolume();
renderFocusDuration();
renderCountdown();
renderLanguage();

Object.values(ui.panels).forEach(({ trigger, panel }) => {
  trigger.addEventListener("click", () => {
    const isActive = panel.classList.contains("active-panel");

    utils.closeAllPanels();

    if (!isActive) {
      panel.classList.add("active-panel");
      if (panel.classList.contains("notification-panel")) {
        systemState.calendarDate = new Date();

        renderCalendar();
      }
    }
  });
});

document.addEventListener("click", (e) => {
  const clickedInsidePanel = e.target.closest(".panel:not(.focus-modal)");

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

ui.calendar.navTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.direction;
    if (direction === "previous") {
      systemState.calendarDate = new Date(
        systemState.calendarDate.getFullYear(),
        systemState.calendarDate.getMonth() - 1,
        1,
      );
    }
    if (direction === "next") {
      systemState.calendarDate = new Date(
        systemState.calendarDate.getFullYear(),
        systemState.calendarDate.getMonth() + 1,
        1,
      );
    }
    renderCalendar();
  });
});

ui.calendar.collapseTrigger.addEventListener("click", () => {
  const isExpanded = ui.calendar.section.dataset.calendarExpanded === "true";
  ui.calendar.section.dataset.calendarExpanded = !isExpanded;
  const icon = ui.calendar.collapseTrigger.querySelector("i");
  icon.classList.toggle("ri-arrow-up-s-line");
  icon.classList.toggle("ri-arrow-down-s-line");
});

// Focus Trigger Logic

ui.focus.triggers.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "increase") {
      systemState.focusTimer.duration += 1;
    }
    if (action === "decrease") {
      if (systemState.focusTimer.duration > 1) {
        systemState.focusTimer.duration -= 1;
      }
    }
    renderFocusDuration();
  });
});

ui.focus.start.addEventListener("click", startFocusTimer);

ui.focus.stop.addEventListener("click", toggleFocusTimer);

ui.focus.reset.addEventListener("click", () => resetFocusTimer());

ui.focus.cancel.addEventListener("click", () => resetFocusTimer(true));

// Quick Action toggle simulation
ui.actions.buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;

    if (action === "focus") {
      startFocusTimer();
      return;
    }

    systemState.actions[action] = !systemState.actions[action];
    renderActions();
  });
});

// Slider Interaction Simulation
ui.sliders.controls.forEach((slider) => {
  slider.addEventListener("input", () => {
    const type = slider.dataset.slider;

    systemState.environment[type] = slider.value;

    if (type === "brightness") {
      renderBrightness();
    }

    if (type === "volume") {
      renderVolume();
    }
  });
});

// Language Toggle Interaction Simulation
ui.language.items.forEach((item) => {
  item.addEventListener("click", () => {
    systemState.language = item.dataset.language;

    renderLanguage();
  });
});

ui.desktop.refresh.addEventListener("click", () => {
  location.reload();
});
