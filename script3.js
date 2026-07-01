/* ===========================================================
   EVNTLY — Event Planner logic
   Handles: storage, CRUD, filtering/search/sort, rendering,
   modal, toast notifications, stats.
   =========================================================== */

(function () {
  "use strict";

  /* ---------------- Storage ---------------- */
  const STORAGE_KEY = "evntly_events_v1";

  function loadEvents() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Could not read saved events:", e);
      return [];
    }
  }

  function saveEvents(events) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error("Could not save events:", e);
      showToast("Couldn't save — storage might be full.");
    }
  }

  let events = loadEvents();

  // Seed with example events on first-ever visit so the board isn't empty.
  if (events.length === 0 && !localStorage.getItem("evntly_seeded")) {
    const today = new Date();
    const inDays = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return d.toISOString().slice(0, 10);
    };
    events = [
      {
        id: cryptoId(),
        title: "Product Launch Conference",
        date: inDays(4),
        time: "09:30",
        location: "Grand Convention Center",
        category: "conference",
        notes: "Keynote at 10am. Confirm AV setup the night before.",
        completed: false
      },
      {
        id: cryptoId(),
        title: "Maya & Chris's Wedding",
        date: inDays(21),
        time: "16:00",
        location: "Rosewood Gardens",
        category: "wedding",
        notes: "Florist delivery at noon. Final headcount due Friday.",
        completed: false
      },
      {
        id: cryptoId(),
        title: "Team Offsite Kickoff",
        date: inDays(-2),
        time: "10:00",
        location: "Riverside Office, Room 4B",
        category: "meeting",
        notes: "",
        completed: true
      }
    ];
    saveEvents(events);
    localStorage.setItem("evntly_seeded", "1");
  }

  /* ---------------- Helpers ---------------- */
  function cryptoId() {
    return (
      Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
    );
  }

  const CATEGORY_COLORS = {
    wedding: "#FF6B4A",
    conference: "#3E6FA8",
    party: "#FFC857",
    meeting: "#4FB286",
    workshop: "#8A6FD1",
    other: "#8A8594"
  };

  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const WEEKDAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  function parseDate(dateStr) {
    // dateStr is YYYY-MM-DD; parse as local date to avoid TZ shifting the day
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function daysBetween(a, b) {
    const MS = 24 * 60 * 60 * 1000;
    return Math.round((startOfDay(b) - startOfDay(a)) / MS);
  }

  function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  }

  function getStatus(ev) {
    const today = new Date();
    const evDate = parseDate(ev.date);
    const diff = daysBetween(today, evDate);
    if (ev.completed) return "completed";
    if (diff === 0) return "today";
    if (diff > 0) return "upcoming";
    return "past";
  }

  function statusLabel(status, diff) {
    switch (status) {
      case "completed": return "Completed";
      case "today": return "Today";
      case "upcoming": return diff === 1 ? "Tomorrow" : `In ${diff} days`;
      case "past": return diff === -1 ? "Yesterday" : `${Math.abs(diff)} days ago`;
      default: return "";
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  /* ---------------- DOM refs ---------------- */
  const eventsGrid = document.getElementById("eventsGrid");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const statusFilter = document.getElementById("statusFilter");
  const sortOrder = document.getElementById("sortOrder");
  const newEventBtn = document.getElementById("newEventBtn");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalClose = document.getElementById("modalClose");
  const cancelBtn = document.getElementById("cancelBtn");
  const eventForm = document.getElementById("eventForm");

  const eventIdInput = document.getElementById("eventId");
  const eventTitleInput = document.getElementById("eventTitle");
  const eventDateInput = document.getElementById("eventDate");
  const eventTimeInput = document.getElementById("eventTime");
  const eventCategoryInput = document.getElementById("eventCategory");
  const eventLocationInput = document.getElementById("eventLocation");
  const eventNotesInput = document.getElementById("eventNotes");

  const statTotal = document.getElementById("statTotal");
  const statUpcoming = document.getElementById("statUpcoming");
  const statWeek = document.getElementById("statWeek");
  const statDone = document.getElementById("statDone");

  const toast = document.getElementById("toast");
  let toastTimer = null;

  /* ---------------- Toast ---------------- */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ---------------- Modal ---------------- */
  function openModal(editEvent) {
    eventForm.reset();
    clearFieldErrors();

    if (editEvent) {
      modalTitle.textContent = "Edit Event";
      eventIdInput.value = editEvent.id;
      eventTitleInput.value = editEvent.title;
      eventDateInput.value = editEvent.date;
      eventTimeInput.value = editEvent.time || "";
      eventCategoryInput.value = editEvent.category;
      eventLocationInput.value = editEvent.location || "";
      eventNotesInput.value = editEvent.notes || "";
    } else {
      modalTitle.textContent = "New Event";
      eventIdInput.value = "";
    }

    modalOverlay.classList.add("show");
    setTimeout(() => eventTitleInput.focus(), 50);
  }

  function closeModal() {
    modalOverlay.classList.remove("show");
  }

  newEventBtn.addEventListener("click", () => openModal(null));
  modalClose.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("show")) closeModal();
  });

  function clearFieldErrors() {
    document.querySelectorAll(".field.invalid").forEach((f) =>
      f.classList.remove("invalid")
    );
  }

  function markInvalid(input) {
    input.closest(".field").classList.add("invalid");
  }

  /* ---------------- Form submit ---------------- */
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFieldErrors();

    let valid = true;
    if (!eventTitleInput.value.trim()) {
      markInvalid(eventTitleInput);
      valid = false;
    }
    if (!eventDateInput.value) {
      markInvalid(eventDateInput);
      valid = false;
    }
    if (!valid) return;

    const id = eventIdInput.value;
    const payload = {
      title: eventTitleInput.value.trim(),
      date: eventDateInput.value,
      time: eventTimeInput.value,
      category: eventCategoryInput.value,
      location: eventLocationInput.value.trim(),
      notes: eventNotesInput.value.trim()
    };

    if (id) {
      const existing = events.find((ev) => ev.id === id);
      Object.assign(existing, payload);
      showToast("Event updated");
    } else {
      events.push({ id: cryptoId(), completed: false, ...payload });
      showToast("Event added");
    }

    saveEvents(events);
    closeModal();
    render();
  });

  /* ---------------- CRUD actions ---------------- */
  function deleteEvent(id) {
    const card = eventsGrid.querySelector(`[data-id="${id}"]`);
    if (card) {
      card.classList.add("tearing");
      setTimeout(() => {
        events = events.filter((ev) => ev.id !== id);
        saveEvents(events);
        render();
        showToast("Event deleted");
      }, 280);
    } else {
      events = events.filter((ev) => ev.id !== id);
      saveEvents(events);
      render();
    }
  }

  function toggleComplete(id) {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    ev.completed = !ev.completed;
    saveEvents(events);
    render();
    showToast(ev.completed ? "Marked as completed" : "Marked as upcoming");
  }

  function editEvent(id) {
    const ev = events.find((e) => e.id === id);
    if (ev) openModal(ev);
  }

  /* ---------------- Filtering / sorting ---------------- */
  function getFilteredEvents() {
    const term = searchInput.value.trim().toLowerCase();
    const cat = categoryFilter.value;
    const status = statusFilter.value;

    let list = events.filter((ev) => {
      if (term) {
        const haystack = `${ev.title} ${ev.location} ${ev.notes}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (cat !== "all" && ev.category !== cat) return false;
      if (status !== "all") {
        const s = getStatus(ev);
        if (status === "upcoming" && !(s === "upcoming" || s === "today")) return false;
        if (status === "past" && s !== "past") return false;
        if (status === "completed" && s !== "completed") return false;
      }
      return true;
    });

    const sortVal = sortOrder.value;
    list.sort((a, b) => {
      if (sortVal === "title") return a.title.localeCompare(b.title);
      const da = parseDate(a.date).getTime();
      const db = parseDate(b.date).getTime();
      return sortVal === "date-desc" ? db - da : da - db;
    });

    return list;
  }

  /* ---------------- Rendering ---------------- */
  function renderCard(ev) {
    const evDate = parseDate(ev.date);
    const diff = daysBetween(new Date(), evDate);
    const status = getStatus(ev);
    const color = CATEGORY_COLORS[ev.category] || CATEGORY_COLORS.other;

    const card = document.createElement("article");
    card.className = "ticket";
    card.dataset.id = ev.id;

    card.innerHTML = `
      <div class="ticket-stub" style="--cat-color:${color}">
        <span class="stub-day">${String(evDate.getDate()).padStart(2, "0")}</span>
        <span class="stub-month">${MONTHS[evDate.getMonth()]}</span>
        <span class="stub-weekday">${WEEKDAYS[evDate.getDay()]}</span>
      </div>
      <div class="perforation"></div>
      <div class="ticket-body">
        <div class="ticket-top">
          <h3 class="ticket-title ${ev.completed ? "completed" : ""}">${escapeHtml(ev.title)}</h3>
          <span class="cat-tag" style="--cat-color:${color}">${escapeHtml(ev.category)}</span>
        </div>
        <div class="ticket-meta">
          ${ev.time ? `<span>🕐 ${formatTime(ev.time)}</span>` : ""}
          ${ev.location ? `<span>📍 ${escapeHtml(ev.location)}</span>` : ""}
        </div>
        ${ev.notes ? `<p class="ticket-notes">${escapeHtml(ev.notes)}</p>` : ""}
        <span class="status-pill ${status}">${statusLabel(status, diff)}</span>
        <div class="ticket-actions">
          <button class="icon-btn done-btn ${ev.completed ? "active" : ""}" title="${ev.completed ? "Mark as upcoming" : "Mark as completed"}" aria-label="Toggle complete">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-btn edit-btn" title="Edit event" aria-label="Edit event">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-btn delete-btn" title="Delete event" aria-label="Delete event">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4.5 4.5l.6 8a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    `;

    card.querySelector(".done-btn").addEventListener("click", () => toggleComplete(ev.id));
    card.querySelector(".edit-btn").addEventListener("click", () => editEvent(ev.id));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteEvent(ev.id));

    return card;
  }

  function render() {
    const filtered = getFilteredEvents();
    eventsGrid.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.classList.add("show");
    } else {
      emptyState.classList.remove("show");
      filtered.forEach((ev) => eventsGrid.appendChild(renderCard(ev)));
    }

    renderStats();
  }

  function renderStats() {
    const today = new Date();
    const total = events.length;
    const upcoming = events.filter((ev) => {
      const s = getStatus(ev);
      return s === "upcoming" || s === "today";
    }).length;
    const thisWeek = events.filter((ev) => {
      const diff = daysBetween(today, parseDate(ev.date));
      return diff >= 0 && diff <= 7 && !ev.completed;
    }).length;
    const done = events.filter((ev) => ev.completed).length;

    statTotal.textContent = total;
    statUpcoming.textContent = upcoming;
    statWeek.textContent = thisWeek;
    statDone.textContent = done;
  }

  /* ---------------- Listeners ---------------- */
  searchInput.addEventListener("input", render);
  categoryFilter.addEventListener("change", render);
  statusFilter.addEventListener("change", render);
  sortOrder.addEventListener("change", render);

  /* ---------------- Init ---------------- */
  render();
})();
