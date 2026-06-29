const STORAGE_KEY = "six-day-training-v1";

const plan = [
  {
    name: "Monday: Squat and Press",
    focus: "Bodyweight squats, one-arm kettlebell press, split squats",
    minutes: 20,
    upperBody: true,
    exercises: [
      exercise("Bodyweight squat", "Quads", ["quadriceps"], 3, 15, 20, "Today baseline: 20, 20, 20", "low", [20, 20, 20]),
      exercise("One-arm kettlebell overhead press", "Shoulders", ["deltoids"], 3, 8, 12, "30 lb today: 12, 10, 8. Only progress if next morning is fine.", "watch", [12, 10, 8], 30),
      exercise("Split squat", "Quads", ["vastus medialis"], 2, 8, 10, "Today baseline: 10, 10. Use the third field only if you add a set later.", "low", [10, 10, ""])
    ]
  },
  {
    name: "Tuesday: Cautious Push",
    focus: "Chest and triceps without neck or wrist drama",
    minutes: 20,
    upperBody: true,
    exercises: [
      exercise("Incline push-up on handles or fists", "Chest", ["pectorals"], 2, 6, 12, "Stop well before failure; avoid deep wrist extension", "moderate"),
      exercise("Light bench press", "Chest", ["pectorals"], 2, 6, 10, "Only if neck stays relaxed and symptoms are quiet", "moderate"),
      exercise("Light triceps pressdown", "Triceps", ["triceps"], 2, 10, 15, "Elbows still, shoulders low", "low"),
      exercise("Easy walk or breathing reset", "Recovery", ["cardio"], 1, 5, 8, "Use remaining minutes; relaxed shoulders", "low")
    ],
    fallbackExercises: [
      exercise("Air squat", "Quads", ["quadriceps"], 3, 15, 20, "Use this when upper body feels risky", "low"),
      exercise("Glute bridge", "Glutes", ["glute max"], 3, 12, 15, "Do not push through the head", "low"),
      exercise("Bird dog legs-only", "Core stability", ["erectors"], 2, 8, 12, "Neck still, looking at the floor", "low")
    ]
  },
  {
    name: "Wednesday: Glutes and Hamstrings",
    focus: "Glute bridges, lunges, easy hinge pattern",
    minutes: 20,
    upperBody: false,
    exercises: [
      exercise("Glute bridge", "Glutes", ["glute max"], 3, 12, 15, "Do not push through the head", "low"),
      exercise("Step-back lunge", "Glutes", ["glute med"], 2, 8, 12, "Each side, smooth reps", "low"),
      exercise("Bodyweight good morning", "Hamstrings", ["hamstrings"], 2, 10, 15, "Hinge only as far as your neck stays quiet", "low"),
      exercise("Hamstring walkout", "Hamstrings", ["biceps femoris"], 2, 6, 10, "Slow and controlled", "low")
    ]
  },
  {
    name: "Thursday: Cautious Pull",
    focus: "Rows and scapular control without shrugging",
    minutes: 20,
    upperBody: true,
    exercises: [
      exercise("Chest-supported row", "Mid-back", ["rhomboids"], 2, 8, 12, "Head supported or neutral; no shrugging", "moderate"),
      exercise("Band pull-apart", "Upper back", ["rear delts"], 2, 10, 15, "Light tension, shoulders down", "low"),
      exercise("Scapular wall slide", "Shoulder control", ["serratus anterior"], 2, 8, 12, "Smooth reps, neck relaxed", "low"),
      exercise("Easy walk or breathing reset", "Recovery", ["cardio"], 1, 5, 8, "Use remaining minutes; relaxed shoulders", "low")
    ],
    fallbackExercises: [
      exercise("Split squat", "Quads", ["vastus medialis"], 2, 8, 10, "Each side, stay tall", "low"),
      exercise("Glute bridge", "Glutes", ["glute max"], 3, 12, 15, "Easy lower-body replacement", "low"),
      exercise("Bird dog legs-only", "Core stability", ["erectors"], 2, 8, 12, "Neck still, looking at the floor", "low")
    ]
  },
  {
    name: "Friday: Arms and Shoulder Control",
    focus: "Curls, lateral raises, wrist-neutral control",
    minutes: 20,
    upperBody: true,
    exercises: [
      exercise("Light curl", "Biceps", ["biceps"], 2, 10, 15, "No swinging, shoulders quiet", "low"),
      exercise("Lateral raise", "Side delts", ["lateral deltoid"], 2, 10, 15, "Light, no shrugging", "moderate"),
      exercise("Wrist neutral mobility", "Nerve-friendly reset", ["wrist"], 1, 6, 10, "Gentle only; stop if tingling increases", "low"),
      exercise("Easy walk or breathing reset", "Recovery", ["cardio"], 1, 5, 8, "Use remaining minutes; relaxed shoulders", "low")
    ],
    fallbackExercises: [
      exercise("Bird dog legs-only", "Core stability", ["erectors"], 3, 8, 12, "Use this if overhead work feels questionable", "low"),
      exercise("Air squat", "Quads", ["quadriceps"], 3, 15, 20, "Easy lower-body filler", "low"),
      exercise("Glute bridge", "Glutes", ["glute max"], 2, 12, 15, "Do not push through the head", "low")
    ]
  },
  {
    name: "Saturday: Core and Conditioning",
    focus: "Bird dogs, cautious dead bugs, easy walking",
    minutes: 20,
    upperBody: false,
    exercises: [
      exercise("Bird dog", "Core stability", ["erectors"], 3, 8, 12, "Start legs-only if your neck is touchy", "low"),
      exercise("Dead bug", "Core", ["deep abdominals"], 2, 6, 10, "Only if no popping or discomfort today", "moderate"),
      exercise("Modified side plank", "Obliques", ["obliques"], 2, 15, 30, "Stop if the neck starts helping", "moderate"),
      exercise("Easy walk", "Conditioning", ["cardio"], 1, 8, 12, "Minutes, relaxed shoulders", "low")
    ]
  },
  {
    name: "Sunday: Rest",
    focus: "Rest day. Walk if you want, but no logged strength work.",
    minutes: 0,
    rest: true,
    upperBody: false,
    exercises: []
  }
];

function exercise(name, target, muscles, sets, minReps, maxReps, note, neckLoad = "low", defaultReps = [], defaultWeight = "") {
  return { id: slug(name), name, target, muscles, sets, minReps, maxReps, note, neckLoad, defaultReps, defaultWeight };
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const state = loadState();
const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  bindEvents();
  render();
  registerServiceWorker();
});

function defaultState() {
  return {
    settings: {
      age: 40,
      loadJump: 5,
      weekStart: 1,
      useCalendarDay: true,
      neckSensitive: true,
      projectNotes: ""
    },
    logs: []
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const defaults = defaultState();
    return {
      ...defaults,
      ...saved,
      settings: {
        ...defaults.settings,
        ...(saved.settings || {})
      }
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function cacheElements() {
  [
    "phaseLabel",
    "todayDate",
    "todayTitle",
    "todayFocus",
    "sessionMinutes",
    "exerciseList",
    "weekGrid",
    "progressSummary",
    "progressRule",
    "historyList",
    "settingsButton",
    "settingsDialog",
    "ageInput",
    "loadJumpInput",
    "weekStartInput",
    "useTodayInput",
    "neckSensitiveInput",
    "projectNotesInput",
    "neckGuidance",
    "neckBeforeInput",
    "neckAfterInput",
    "numbnessInput",
    "neckSymptomsInput",
    "morningNumbnessInput",
    "upperBodyRiskInput",
    "saveSettings",
    "saveSession",
    "resetDemo",
    "exportBackup",
    "importBackup",
    "backupFileInput",
    "toast"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });

  els.settingsButton.addEventListener("click", openSettings);
  els.saveSettings.addEventListener("click", saveSettings);
  els.saveSession.addEventListener("click", saveSession);
  els.resetDemo.addEventListener("click", clearLogs);
  els.exportBackup.addEventListener("click", exportBackup);
  els.importBackup.addEventListener("click", () => els.backupFileInput.click());
  els.backupFileInput.addEventListener("change", importBackup);
  [els.numbnessInput, els.morningNumbnessInput, els.upperBodyRiskInput].forEach((input) => {
    input.addEventListener("input", render);
    input.addEventListener("change", render);
  });
}

function render() {
  const dayIndex = getTrainingDayIndex(new Date());
  const day = plan[dayIndex];
  const activeDay = getActiveDay(day);
  const phase = getPhase();

  els.phaseLabel.textContent = phase.label;
  els.todayDate.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date());
  els.todayTitle.textContent = activeDay.isFallback ? `${day.name}: replacement` : day.name;
  els.todayFocus.textContent = activeDay.isFallback ? "Upper body swapped for lower-body/core today." : day.focus;
  els.sessionMinutes.textContent = activeDay.minutes;
  els.neckGuidance.textContent = getNeckGuidance();

  renderExercises(activeDay, phase);
  renderWeek(dayIndex);
  renderProgress(phase);
}

function getTrainingDayIndex(date) {
  if (!state.settings.useCalendarDay) {
    return state.logs.length % plan.length;
  }

  return (date.getDay() + 6) % 7;
}

function getPhase() {
  const sessions = state.logs.length;
  const baselineTarget = 24;
  const age = Number(state.settings.age) || 40;
  const ageMod = age >= 60 ? "slower" : age >= 45 ? "steady" : "standard";
  const symptomStatus = getSymptomStatus();

  if (sessions < baselineTarget) {
    return {
      kind: "baseline",
      label: `Baseline: ${sessions}/${baselineTarget}`,
      summary: `Keep effort repeatable while the app learns your starting reps and loads. ${baselineTarget - sessions} baseline sessions remain.`,
      rule: symptomStatus.flagged
        ? "Your last session or morning check raised a symptom flag. Repeat, reduce, or use a replacement today."
        : "Use the listed rep ranges and stop with about 2 good reps in reserve. The first month is for honest data, not forced increases.",
      ageMod
    };
  }

  const cycleWeek = Math.floor((sessions - baselineTarget) / 6) % 4;
  const deload = cycleWeek === 3;
  return {
    kind: deload ? "deload" : "build",
    label: deload ? "Deload week" : `Build week ${cycleWeek + 1}`,
    summary: deload
      ? "This week trims effort so the next build block starts fresh."
      : "The app is now using your saved sessions to nudge reps or weight.",
    rule: deload
      ? "Use roughly 80 percent of recent weight or one fewer set, and keep every rep crisp."
      : getAgeRule(ageMod),
    ageMod
  };
}

function getAgeRule(ageMod) {
  if (getSymptomStatus().flagged) {
    return "Hold progression until the last neck or numbness flag is followed by a clean session and a normal next morning.";
  }
  if (ageMod === "slower") {
    return "Progress only after two strong repeats: first add reps, then add the smallest weight jump and return to the low end of the rep range.";
  }
  if (ageMod === "steady") {
    return "Progress after a strong repeat: add reps until the top of the range, then add the smallest weight jump and return to the low end.";
  }
  return "Add reps when all sets land cleanly. Once the top of the range is repeatable, add weight and return to the low end.";
}

function renderExercises(day, phase) {
  els.exerciseList.innerHTML = "";
  const activeDay = getActiveDay(day);
  els.saveSession.disabled = Boolean(activeDay.rest);
  els.saveSession.textContent = activeDay.rest ? "Rest day" : "Save session";
  if (activeDay.rest) {
    els.exerciseList.innerHTML = `
      <article class="exercise-card">
        <h3>Rest</h3>
        <p class="meta">No strength work today. Easy walking is fine if it helps you feel better.</p>
        <p class="hint">If the next morning is worse, yesterday was too aggressive.</p>
      </article>
    `;
    return;
  }
  activeDay.exercises.forEach((item) => {
    const suggestion = getSuggestion(item, phase);
    const neckTag = getNeckTag(item);
    const card = document.createElement("article");
    card.className = "exercise-card";
    card.dataset.exerciseId = item.id;
    card.innerHTML = `
      <div class="exercise-head">
        <div>
          <h3>${item.name}</h3>
          <p class="muscles">${item.target}: ${item.muscles.join(", ")}</p>
          <p class="meta">${suggestion}</p>
          <p class="hint">${item.note}</p>
          <p class="safety-note">${neckTag}</p>
        </div>
        <span class="tag">${item.sets} x ${item.minReps}-${item.maxReps}</span>
      </div>
      <div class="inputs set-inputs">
        <label>Set 1 <input data-field="rep1" type="number" min="0" inputmode="numeric" value="${item.defaultReps[0] ?? ""}" placeholder="${item.minReps}-${item.maxReps}"></label>
        <label>Set 2 <input data-field="rep2" type="number" min="0" inputmode="numeric" value="${item.defaultReps[1] ?? ""}" placeholder="${item.minReps}-${item.maxReps}"></label>
        <label>Set 3 <input data-field="rep3" type="number" min="0" inputmode="numeric" value="${item.defaultReps[2] ?? ""}" placeholder="optional"></label>
        <label>Weight <input data-field="weight" type="number" min="0" step="0.5" inputmode="decimal" value="${item.defaultWeight}" placeholder="lb"></label>
      </div>
    `;
    els.exerciseList.appendChild(card);
  });
}

function getSuggestion(item, phase) {
  const recent = getRecentExerciseLogs(item.id);
  if (state.settings.neckSensitive && getSymptomStatus().flagged) {
    return "Today: repeat or reduce. No increase until your neck or numbness is calm the next morning.";
  }
  if (!recent.length || phase.kind === "baseline") {
    return `Today: ${item.sets} sets in the ${item.minReps}-${item.maxReps} rep range.`;
  }

  const last = recent[0];
  const loadJump = Number(state.settings.loadJump);
  const lastReps = getEntryReps(last);
  const lowestRep = lastReps.length ? Math.min(...lastReps) : 0;
  const hitTop = lowestRep >= item.maxReps && last.sets >= item.sets;
  const hitRange = lowestRep >= item.minReps && last.sets >= item.sets;

  if (phase.kind === "deload") {
    const weight = last.weight ? Math.max(0, roundToHalf(last.weight * 0.8)) : "";
    return weight ? `Today: deload around ${weight} lb.` : "Today: deload with one fewer set or easier reps.";
  }

  if (hitTop && last.weight) {
    return `Today: try ${roundToHalf(last.weight + loadJump)} lb for ${item.minReps} reps.`;
  }
  if (hitRange) {
    return `Today: try to add 1 rep to your lowest set, up to ${item.maxReps}.`;
  }
  return "Today: repeat the last target and make it cleaner.";
}

function getNeckGuidance() {
  if (!state.settings.neckSensitive) {
    return "Neck-protection mode is off.";
  }
  const status = getSymptomStatus();
  if (status.flagged) {
    return "Symptom flag is active. Keep it easier today; the next morning decides whether that was enough.";
  }
  return "Cautious progression, not avoidance forever. Stop, reduce, or swap if pain, tingling, headache, or arm symptoms increase.";
}

function getNeckTag(item) {
  if (!state.settings.neckSensitive) {
    return "";
  }
  const labels = {
    low: "Neck load: low",
    moderate: "Neck load: watch carefully",
    watch: "Neck load: only if symptoms are quiet",
    avoid: "Neck load: avoid unless cleared"
  };
  return labels[item.neckLoad] || labels.low;
}

function getActiveDay(day) {
  const shouldUseFallback =
    state.settings.neckSensitive &&
    day.upperBody &&
    (els.upperBodyRiskInput?.checked || getSymptomStatus().flagged);

  if (!shouldUseFallback || !day.fallbackExercises?.length) {
    return day;
  }

  return {
    ...day,
    isFallback: true,
    exercises: day.fallbackExercises
  };
}

function getSymptomStatus() {
  const last = state.logs[state.logs.length - 1];
  const lastFlagged = Boolean(last?.symptoms?.flagged || last?.neck?.flagged);
  const morningFlagged = Boolean(els.morningNumbnessInput?.checked);
  const upperRisk = Boolean(els.upperBodyRiskInput?.checked);
  const currentNumbness = Number(els.numbnessInput?.value) || 0;
  return {
    flagged: lastFlagged || morningFlagged || upperRisk || currentNumbness >= 3
  };
}

function renderWeek(todayIndex) {
  els.weekGrid.innerHTML = "";
  plan.forEach((day, index) => {
    const card = document.createElement("article");
    card.className = `day-card${index === todayIndex ? " is-today" : ""}`;
    card.innerHTML = `
      <div class="day-head">
        <div>
          <p class="eyebrow">Day ${index + 1}</p>
          <h3>${day.name}</h3>
        </div>
        <span class="tag">${day.minutes} min</span>
      </div>
      <p class="muted">${day.focus}</p>
      <ul class="day-list">
        ${day.exercises
          .map((item) => `<li><span>${item.name}</span><span class="muted">${item.target}</span></li>`)
          .join("") || `<li><span>Rest</span><span class="muted">Sunday</span></li>`}
      </ul>
    `;
    els.weekGrid.appendChild(card);
  });
}

function renderProgress(phase) {
  els.progressSummary.textContent = phase.summary;
  els.progressRule.textContent = phase.rule;
  els.historyList.innerHTML = "";

  if (!state.logs.length) {
    els.historyList.innerHTML = `<p class="muted">No sessions saved yet.</p>`;
    return;
  }

  state.logs.slice(-8).reverse().forEach((log) => {
    const row = document.createElement("div");
    row.className = "history-row";
    const totalSets = log.entries.reduce((sum, entry) => sum + getEntryReps(entry).length, 0);
    const symptomNote = log.symptoms?.flagged || log.neck?.flagged ? "Symptom flag" : "Clean";
    row.innerHTML = `
      <div>
        <strong>${log.dayName}</strong>
        <p class="muted">${new Date(log.date).toLocaleDateString()}</p>
        <p class="muted">${symptomNote}</p>
      </div>
      <span class="tag">${totalSets} sets</span>
    `;
    els.historyList.appendChild(row);
  });
}

function getRecentExerciseLogs(exerciseId) {
  return state.logs
    .flatMap((log) =>
      log.entries
        .filter((entry) => entry.exerciseId === exerciseId)
        .map((entry) => ({ ...entry, date: log.date }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function switchView(view) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("is-active", section.id === `${view}View`);
  });
}

function openSettings() {
  els.ageInput.value = state.settings.age;
  els.loadJumpInput.value = state.settings.loadJump;
  els.weekStartInput.value = state.settings.weekStart;
  els.useTodayInput.checked = state.settings.useCalendarDay;
  els.neckSensitiveInput.checked = state.settings.neckSensitive;
  els.projectNotesInput.value = state.settings.projectNotes || "";
  els.settingsDialog.showModal();
}

function saveSettings() {
  state.settings.age = Number(els.ageInput.value) || state.settings.age;
  state.settings.loadJump = Number(els.loadJumpInput.value);
  state.settings.weekStart = Number(els.weekStartInput.value);
  state.settings.useCalendarDay = els.useTodayInput.checked;
  state.settings.neckSensitive = els.neckSensitiveInput.checked;
  state.settings.projectNotes = els.projectNotesInput.value.trim();
  saveState();
  render();
  showToast("Settings saved.");
}

function saveSession() {
  const dayIndex = getTrainingDayIndex(new Date());
  const day = plan[dayIndex];
  const activeDay = getActiveDay(day);
  if (activeDay.rest) {
    showToast("Sunday is your rest day.");
    return;
  }
  const entries = [...els.exerciseList.querySelectorAll(".exercise-card")].map((card) => {
    const exerciseId = card.dataset.exerciseId;
    const input = (field) => Number(card.querySelector(`[data-field="${field}"]`).value) || 0;
    const repsBySet = [input("rep1"), input("rep2"), input("rep3")].filter((value) => value > 0);
    return {
      exerciseId,
      sets: repsBySet.length,
      repsBySet,
      reps: repsBySet.length ? Math.min(...repsBySet) : 0,
      weight: input("weight")
    };
  });

  state.logs.push({
    date: new Date().toISOString(),
    dayName: activeDay.isFallback ? `${day.name}: replacement` : day.name,
    dayIndex,
    symptoms: getSymptomLog(),
    entries
  });
  clearDailySymptomInputs();
  saveState();
  render();
  showToast("Session saved.");
}

function getSymptomLog() {
  const before = Number(els.neckBeforeInput.value);
  const after = Number(els.neckAfterInput.value);
  const numbness = Number(els.numbnessInput.value);
  const symptomsChanged = els.neckSymptomsInput.checked;
  const morningNumbness = els.morningNumbnessInput.checked;
  const upperBodyRisk = els.upperBodyRiskInput.checked;
  const hasBefore = els.neckBeforeInput.value !== "";
  const hasAfter = els.neckAfterInput.value !== "";
  const hasNumbness = els.numbnessInput.value !== "";
  const flagged =
    symptomsChanged ||
    morningNumbness ||
    upperBodyRisk ||
    (hasBefore && hasAfter && after > before) ||
    (hasAfter && after >= 3) ||
    (hasNumbness && numbness >= 3);
  return {
    neckBefore: hasBefore ? before : null,
    neckAfter: hasAfter ? after : null,
    wristHandNumbness: hasNumbness ? numbness : null,
    morningNumbness,
    upperBodyRisk,
    symptomsChanged,
    flagged
  };
}

function clearLogs() {
  state.logs = [];
  clearDailySymptomInputs();
  saveState();
  render();
  showToast("Logs cleared.");
}

function exportBackup() {
  const payload = {
    app: "six-day-training",
    version: 1,
    exportedAt: new Date().toISOString(),
    state
  };
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `training-backup-${date}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Backup exported.");
}

function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const importedState = parsed.state || parsed;
      if (!Array.isArray(importedState.logs) || typeof importedState.settings !== "object") {
        throw new Error("Invalid backup");
      }
      const defaults = defaultState();
      state.settings = {
        ...defaults.settings,
        ...importedState.settings
      };
      state.logs = importedState.logs;
      saveState();
      render();
      showToast("Backup imported.");
    } catch {
      showToast("That backup file did not work.");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function clearDailySymptomInputs() {
  if (!els.neckBeforeInput) {
    return;
  }
  els.neckBeforeInput.value = "";
  els.neckAfterInput.value = "";
  els.numbnessInput.value = "";
  els.neckSymptomsInput.checked = false;
  els.morningNumbnessInput.checked = false;
  els.upperBodyRiskInput.checked = false;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
}

function roundToHalf(value) {
  return Math.round(value * 2) / 2;
}

function getEntryReps(entry) {
  if (Array.isArray(entry.repsBySet)) {
    return entry.repsBySet.filter((value) => Number(value) > 0).map(Number);
  }
  return Number(entry.reps) > 0 ? [Number(entry.reps)] : [];
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
