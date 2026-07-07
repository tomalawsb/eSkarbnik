const APP_VERSION = "1.6.3 ETAP 4 - eSkarbnik RR";
const APP_BUILD = "2026-07-07-etap4-clean-ui";
const CACHE_NAME = "eskarbnik-v1-6-3-etap4-clean-ui";

const BUDGET_TYPES = {
  school: "school",
  class: "class",
};

const CATEGORY_TYPES = {
  payment: "payment",
  expense: "expense",
};

const DEFAULT_PAYMENT_CATEGORIES = [
  { key: "committee_fee", name: "Składka na Radę Rodziców" },
  { key: "class_fee", name: "Składka klasowa" },
  { key: "donation", name: "Darowizna" },
  { key: "refund", name: "Zwrot" },
  { key: "correction", name: "Korekta" },
  { key: "other", name: "Inne" },
];

const DEFAULT_EXPENSE_CATEGORIES = [
  { key: "education_day", name: "Dzień Edukacji" },
  { key: "mikolajki", name: "Mikołajki" },
  { key: "children_day", name: "Dzień Dziecka" },
  { key: "prizes", name: "Nagrody" },
  { key: "sweets", name: "Słodycze" },
  { key: "equipment", name: "Wyposażenie" },
  { key: "trip", name: "Wyjście / wycieczka" },
  { key: "food", name: "Poczęstunek" },
  { key: "flowers", name: "Kwiaty" },
  { key: "transport", name: "Transport" },
  { key: "other", name: "Inne" },
];

const RECEIPT_CATEGORY_KEYWORDS = [
  { key: "sweets", words: ["czekolada", "cukierek", "cukierki", "lizak", "lizaki", "wafel", "wafelek", "wafelki", "baton", "ciastka", "ciastko", "słodycze", "slodycze", "żelki", "zelki"] },
  { key: "food", words: ["poczęstunek", "poczestunek", "pizza", "zapiekanka", "napój", "napoj", "sok", "woda", "drożdżówka", "drozdzowka", "bułka", "bulka", "kanapka", "ciasto", "tort"] },
  { key: "flowers", words: ["kwiat", "kwiaty", "bukiet", "róża", "roza", "goździk", "gozdzik", "flor", "kwiaciarnia"] },
  { key: "prizes", words: ["nagroda", "nagrody", "dyplom", "medal", "puchar", "książka", "ksiazka", "zabawka", "gra", "upominek"] },
  { key: "equipment", words: ["ławka", "lawka", "krzesło", "krzeslo", "papier", "druk", "toner", "tusz", "taśma", "tasma", "bateria", "wyposażenie", "wyposazenie"] },
  { key: "transport", words: ["transport", "bus", "autobus", "paliwo", "parking", "przejazd", "bilet"] },
  { key: "trip", words: ["wycieczka", "kino", "teatr", "muzeum", "basen", "wyjście", "wyjscie"] },
  { key: "mikolajki", words: ["mikołaj", "mikolaj", "mikołajki", "mikolajki"] },
  { key: "education_day", words: ["dzień edukacji", "dzien edukacji", "nauczyciel", "nauczyciela"] },
  { key: "children_day", words: ["dzień dziecka", "dzien dziecka"] },
];

const LEGACY_SCHOOL_BUDGET_ID = "budget_school_main";
const SCHOOL_YEAR_STORAGE_KEY = "rr_active_school_year_id";
const FIREBASE_SYNC_STORAGE_KEY = "rr_firebase_sync_settings";
const DEFAULT_FIREBASE_WORKSPACE_ID = "eskarbnik";
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAGbPb7aBSj23H3lJA0T7GnE-XH12qKS5I",
  authDomain: "eskarbnik-fa364.firebaseapp.com",
  projectId: "eskarbnik-fa364",
  storageBucket: "eskarbnik-fa364.firebasestorage.app",
  messagingSenderId: "52090207112",
  appId: "1:52090207112:web:9181ac0aad5194cab1183d",
  measurementId: "G-LY20JXENDE",
};
const DEFAULT_FIREBASE_CONFIG_TEXT = `const firebaseConfig = ${JSON.stringify(DEFAULT_FIREBASE_CONFIG, null, 2)};`;
const FIREBASE_SDK_VERSION = "10.12.5";
const FIREBASE_SYNC_COLLECTION = "radaRodzicowPro";
const FIREBASE_SYNC_SNAPSHOT_ID = "current";
const FIREBASE_ROLES_COLLECTION = "roles";
const AI_SETTINGS_STORAGE_KEY = "rr_ai_settings";
const DEFAULT_AI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const DEFAULT_AI_MODEL = "gpt-4o-mini";
const APP_CACHE_BUSTER = "1.6.3-etap4-clean-ui";

const USER_ROLES = {
  schoolTreasurer: "schoolTreasurer",
  classTreasurer: "classTreasurer",
  viewer: "viewer",
  pending: "pending",
  localAdmin: "localAdmin",
  legacyAdmin: "admin",
};

const ROLE_LABELS = {
  [USER_ROLES.schoolTreasurer]: "Skarbnik Rady Rodziców",
  [USER_ROLES.classTreasurer]: "Skarbnik klasy",
  [USER_ROLES.viewer]: "Podgląd",
  [USER_ROLES.pending]: "Brak nadanej roli",
  [USER_ROLES.localAdmin]: "Tryb lokalny — pełny dostęp",
  [USER_ROLES.legacyAdmin]: "Dawny administrator — traktowany jak skarbnik Rady Rodziców",
};

const SYNC_STORE_NAMES = [
  RR_STORES.schoolYears,
  RR_STORES.classes,
  RR_STORES.students,
  RR_STORES.budgets,
  RR_STORES.payments,
  RR_STORES.expenses,
  RR_STORES.categories,
];

const appState = {
  schoolYears: [],
  activeSchoolYearId: null,
  classes: [],
  students: [],
  budgets: [],
  categories: [],
  payments: [],
  expenses: [],
  selectedClassId: null,
  importPreview: null,
  firebaseSync: {
    settings: null,
    runtime: null,
    lastSnapshot: null,
    isBusy: false,
  },
  auth: {
    user: null,
    role: null,
    isReady: false,
    isBusy: false,
    unsubscribe: null,
  },
  ai: {
    settings: null,
    isBusy: false,
    lastTest: null,
  },
  receiptLastAnalysisSource: "local",
};

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return [...document.querySelectorAll(selector)];
}

function makeId(prefix) {
  if (window.crypto?.randomUUID) return `${prefix}_${window.crypto.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeText(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function normalizeMoney(value) {
  const number = Number(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.round(number * 100) / 100;
}

function formatMoney(value) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value || 0);
}

function compareByName(a, b, field) {
  return String(a[field] ?? "").localeCompare(String(b[field] ?? ""), "pl", {
    sensitivity: "base",
    numeric: true,
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripPolishSigns(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function formatIsoDateToPl(value) {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value || "brak";
  return `${match[3]}.${match[2]}.${match[1]}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => toast.classList.add("hidden"), 2600);
}

function setDbStatus(text, ok = true) {
  const dbStatus = $("#dbStatus");
  dbStatus.textContent = text;
  dbStatus.className = ok ? "status-pill status-ok" : "status-pill status-offline";
}

function closeFloatingMenu() {
  const nav = $("#mainNav");
  const button = $("#floatingMenuButton");
  const backdrop = $("#navBackdrop");

  nav?.classList.remove("open");
  document.body.classList.remove("menu-open");
  backdrop?.classList.add("hidden");
  if (button) {
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Otwórz menu");
  }
}

function toggleFloatingMenu(forceOpen = null) {
  const nav = $("#mainNav");
  const button = $("#floatingMenuButton");
  const backdrop = $("#navBackdrop");
  if (!nav || !button || !backdrop) return;

  const shouldOpen = forceOpen ?? !nav.classList.contains("open");
  nav.classList.toggle("open", shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);
  backdrop.classList.toggle("hidden", !shouldOpen);
  button.setAttribute("aria-expanded", String(shouldOpen));
  button.setAttribute("aria-label", shouldOpen ? "Zamknij menu" : "Otwórz menu");
}

function switchSection(sectionId) {
  $all(".view").forEach((view) => {
    view.classList.toggle("active-view", view.id === sectionId);
  });

  $all(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });

  closeFloatingMenu();
}

function setupNavigation() {
  const menuButton = $("#floatingMenuButton");
  const backdrop = $("#navBackdrop");

  menuButton?.addEventListener("click", () => toggleFloatingMenu());
  backdrop?.addEventListener("click", closeFloatingMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeFloatingMenu();
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 981px)").matches) closeFloatingMenu();
  });

  $all(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchSection(button.dataset.section));
  });

  $all("[data-section-jump]").forEach((button) => {
    button.addEventListener("click", () => switchSection(button.dataset.sectionJump));
  });
}

function setupConnectionStatus() {
  const status = $("#connectionStatus");

  function refresh() {
    if (navigator.onLine) {
      status.textContent = "Online";
      status.className = "status-pill status-ok";
      return;
    }

    status.textContent = "Offline";
    status.className = "status-pill status-offline";
  }

  window.addEventListener("online", refresh);
  window.addEventListener("offline", refresh);
  refresh();
}

function setupInstallButton() {
  const installButton = $("#installButton");
  let deferredPrompt = null;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.classList.remove("hidden");
  });

  installButton.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    installButton.classList.add("hidden");
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("service-worker.js");
  } catch (error) {
    console.warn("Service worker nie został zarejestrowany:", error);
  }
}


function getDefaultSchoolYearStartYear(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return month >= 8 ? year : year - 1;
}

function makeSchoolYearId(startYear) {
  return `year_${startYear}_${startYear + 1}`;
}

function makeSchoolYearName(startYear) {
  return `${startYear}/${startYear + 1}`;
}

function buildSchoolYear(startYear, existingYear = null) {
  return {
    id: makeSchoolYearId(startYear),
    name: makeSchoolYearName(startYear),
    startYear,
    endYear: startYear + 1,
    isActive: true,
    createdAt: existingYear?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

function parseSchoolYearInput(value) {
  const normalized = normalizeText(value).replaceAll(" ", "");
  const match = normalized.match(/^(20\d{2})\/(\d{2}|20\d{2})$/);
  if (!match) return null;

  const startYear = Number(match[1]);
  let endYear = Number(match[2]);
  if (endYear < 100) endYear = 2000 + endYear;

  if (!Number.isInteger(startYear) || endYear !== startYear + 1) return null;
  return buildSchoolYear(startYear);
}

function getActiveSchoolYear() {
  return appState.schoolYears.find((year) => year.id === appState.activeSchoolYearId) ?? appState.schoolYears[0] ?? null;
}

function getActiveSchoolYearName() {
  return getActiveSchoolYear()?.name ?? "brak roku";
}

function getSchoolBudgetId(schoolYearId = appState.activeSchoolYearId) {
  return `budget_school_${schoolYearId}`;
}

function isActiveYearRecord(record) {
  return record?.schoolYearId === appState.activeSchoolYearId;
}

function makeCategoryId(type, key, schoolYearId = appState.activeSchoolYearId) {
  return `category_${type}_${schoolYearId}_${key}`;
}

function getDefaultCategoryDefinitions(type) {
  return type === CATEGORY_TYPES.payment ? DEFAULT_PAYMENT_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES;
}

function createDefaultCategory(type, definition, schoolYearId = appState.activeSchoolYearId, sortOrder = 0, existing = null) {
  return {
    id: makeCategoryId(type, definition.key, schoolYearId),
    schoolYearId,
    type,
    key: definition.key,
    name: definition.name,
    isSystem: true,
    isActive: existing?.isActive ?? true,
    sortOrder,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

async function ensureCategoryConsistency() {
  const allCategories = await RRDatabase.getAll(RR_STORES.categories);
  const yearCategories = allCategories.filter(isActiveYearRecord);

  for (const type of Object.values(CATEGORY_TYPES)) {
    const definitions = getDefaultCategoryDefinitions(type);
    for (const [index, definition] of definitions.entries()) {
      const id = makeCategoryId(type, definition.key);
      const existing = yearCategories.find((category) => category.id === id);
      const normalized = createDefaultCategory(type, definition, appState.activeSchoolYearId, index, existing);

      if (!existing || existing.type !== normalized.type || existing.schoolYearId !== appState.activeSchoolYearId) {
        await RRDatabase.put(RR_STORES.categories, normalized);
      }
    }
  }
}

function getCategoriesByType(type, activeOnly = false) {
  return appState.categories
    .filter((category) => category.type === type && (!activeOnly || category.isActive))
    .sort((a, b) => Number(a.sortOrder ?? 999) - Number(b.sortOrder ?? 999) || compareByName(a, b, "name"));
}

function getCategoryByIdOrKey(type, value) {
  if (!value) return null;
  return appState.categories.find((category) => category.type === type && (category.id === value || category.key === value)) ?? null;
}

function getCategoryLabel(type, value) {
  const category = getCategoryByIdOrKey(type, value);
  if (category) return category.name;
  return value || "Inne";
}

function getDefaultCategoryId(type, key = "other") {
  const exact = appState.categories.find((category) => category.type === type && category.key === key && category.isActive);
  if (exact) return exact.id;
  const firstActive = getCategoriesByType(type, true)[0];
  return firstActive?.id ?? "";
}

function fillCategorySelect(selectId, type, preferredValue = "") {
  const select = $(selectId);
  if (!select) return;

  const currentValue = preferredValue || select.value;
  const activeCategories = getCategoriesByType(type, true);
  select.innerHTML = activeCategories.map((category) => `
    <option value="${escapeHtml(category.id)}">${escapeHtml(category.name)}</option>
  `).join("");

  if (currentValue && activeCategories.some((category) => category.id === currentValue || category.key === currentValue)) {
    const category = getCategoryByIdOrKey(type, currentValue);
    select.value = category?.id ?? currentValue;
    return;
  }

  select.value = getDefaultCategoryId(type);
}

async function ensureSchoolYears() {
  let years = await RRDatabase.getAll(RR_STORES.schoolYears);
  const defaultStartYear = getDefaultSchoolYearStartYear();
  const defaultYear = buildSchoolYear(defaultStartYear);

  if (years.length === 0) {
    await RRDatabase.put(RR_STORES.schoolYears, defaultYear);
    years = [defaultYear];
  }

  years = years.sort((a, b) => Number(b.startYear) - Number(a.startYear));
  appState.schoolYears = years;

  const savedYearId = localStorage.getItem(SCHOOL_YEAR_STORAGE_KEY);
  const validSavedYear = years.some((year) => year.id === savedYearId);
  appState.activeSchoolYearId = validSavedYear ? savedYearId : years[0].id;
  localStorage.setItem(SCHOOL_YEAR_STORAGE_KEY, appState.activeSchoolYearId);
}

async function migrateLegacyData(defaultSchoolYearId) {
  const targetSchoolBudgetId = getSchoolBudgetId(defaultSchoolYearId);
  const storesToMigrate = [
    RR_STORES.classes,
    RR_STORES.students,
    RR_STORES.budgets,
    RR_STORES.payments,
    RR_STORES.expenses,
  ];

  for (const storeName of storesToMigrate) {
    const records = await RRDatabase.getAll(storeName);
    for (const record of records) {
      let changed = false;

      if (!record.schoolYearId) {
        record.schoolYearId = defaultSchoolYearId;
        changed = true;
      }

      if ((storeName === RR_STORES.payments || storeName === RR_STORES.expenses) && record.budgetId === LEGACY_SCHOOL_BUDGET_ID) {
        record.budgetId = targetSchoolBudgetId;
        changed = true;
      }

      if (storeName === RR_STORES.budgets && record.id === LEGACY_SCHOOL_BUDGET_ID) {
        continue;
      }

      if (changed) {
        record.updatedAt = nowIso();
        await RRDatabase.put(storeName, record);
      }
    }
  }

  const budgets = await RRDatabase.getAll(RR_STORES.budgets);
  const legacySchoolBudget = budgets.find((budget) => budget.id === LEGACY_SCHOOL_BUDGET_ID);
  if (legacySchoolBudget) {
    await RRDatabase.put(RR_STORES.budgets, createSchoolBudget(legacySchoolBudget, defaultSchoolYearId));
    await RRDatabase.remove(RR_STORES.budgets, LEGACY_SCHOOL_BUDGET_ID);
  }
}
function createSchoolBudget(existingBudget, schoolYearId = appState.activeSchoolYearId) {
  return {
    id: getSchoolBudgetId(schoolYearId),
    schoolYearId,
    type: BUDGET_TYPES.school,
    classId: null,
    name: "Rada Rodziców",
    description: `Budżet wspólny dla całej szkoły w roku ${getActiveSchoolYearName()}.`,
    isSystem: true,
    isActive: true,
    createdAt: existingBudget?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

function createClassBudget(classItem, existingBudget) {
  return {
    id: `budget_class_${classItem.id}`,
    schoolYearId: classItem.schoolYearId,
    type: BUDGET_TYPES.class,
    classId: classItem.id,
    name: `Kasa klasowa ${classItem.name}`,
    description: `Budżet klasowy dla klasy ${classItem.name} w roku ${getActiveSchoolYearName()}.`,
    defaultFee: normalizeMoney(classItem.classDefaultFee ?? classItem.defaultFee),
    isSystem: true,
    isActive: true,
    createdAt: existingBudget?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

async function ensureBudgetConsistency() {
  const allBudgets = await RRDatabase.getAll(RR_STORES.budgets);
  const budgets = allBudgets.filter(isActiveYearRecord);
  const schoolBudgetId = getSchoolBudgetId();
  const schoolBudget = budgets.find((budget) => budget.id === schoolBudgetId);
  const normalizedSchoolBudget = createSchoolBudget(schoolBudget);

  if (!schoolBudget || schoolBudget.name !== normalizedSchoolBudget.name || schoolBudget.type !== normalizedSchoolBudget.type || schoolBudget.schoolYearId !== appState.activeSchoolYearId) {
    await RRDatabase.put(RR_STORES.budgets, normalizedSchoolBudget);
  }

  const classIds = new Set(appState.classes.map((classItem) => classItem.id));

  for (const classItem of appState.classes) {
    const expectedId = `budget_class_${classItem.id}`;
    const existingBudget = budgets.find((budget) => budget.id === expectedId);
    const normalizedBudget = createClassBudget(classItem, existingBudget);

    if (
      !existingBudget
      || existingBudget.name !== normalizedBudget.name
      || existingBudget.classId !== normalizedBudget.classId
      || existingBudget.type !== normalizedBudget.type
      || existingBudget.schoolYearId !== appState.activeSchoolYearId
    ) {
      await RRDatabase.put(RR_STORES.budgets, normalizedBudget);
    }
  }

  const orphanClassBudgets = budgets.filter((budget) => (
    budget.type === BUDGET_TYPES.class
    && budget.classId
    && !classIds.has(budget.classId)
  ));

  for (const budget of orphanClassBudgets) {
    await RRDatabase.remove(RR_STORES.budgets, budget.id);
  }
}

async function loadData() {
  await ensureSchoolYears();
  await migrateLegacyData(appState.activeSchoolYearId);

  const allClasses = await RRDatabase.getAll(RR_STORES.classes);
  const allStudents = await RRDatabase.getAll(RR_STORES.students);
  const allPayments = await RRDatabase.getAll(RR_STORES.payments);
  const allExpenses = await RRDatabase.getAll(RR_STORES.expenses);

  await ensureCategoryConsistency();
  const allCategories = await RRDatabase.getAll(RR_STORES.categories);

  appState.classes = allClasses.filter(isActiveYearRecord);
  appState.students = allStudents.filter(isActiveYearRecord);
  appState.payments = allPayments.filter(isActiveYearRecord);
  appState.expenses = allExpenses.filter(isActiveYearRecord);

  await ensureBudgetConsistency();
  const allBudgets = await RRDatabase.getAll(RR_STORES.budgets);
  appState.budgets = allBudgets.filter(isActiveYearRecord);
  appState.categories = allCategories.filter(isActiveYearRecord);

  if (appState.selectedClassId && !appState.classes.some((item) => item.id === appState.selectedClassId)) {
    appState.selectedClassId = null;
  }

  if (!appState.selectedClassId && appState.classes.length > 0) {
    appState.selectedClassId = [...appState.classes].sort((a, b) => compareByName(a, b, "name"))[0].id;
  }
}

function getClassBudgets() {
  return appState.budgets
    .filter((budget) => budget.type === BUDGET_TYPES.class)
    .sort((a, b) => compareByName(a, b, "name"));
}

function getSchoolBudget() {
  return appState.budgets.find((budget) => budget.type === BUDGET_TYPES.school) ?? createSchoolBudget(null);
}


function getBudgetById(budgetId) {
  return appState.budgets.find((budget) => budget.id === budgetId) ?? null;
}

function getClassById(classId) {
  return appState.classes.find((classItem) => classItem.id === classId) ?? null;
}

function getStudentById(studentId) {
  return appState.students.find((student) => student.id === studentId) ?? null;
}

function getBudgetLabel(budget) {
  if (!budget) return "Brak budżetu";
  if (budget.type === BUDGET_TYPES.school) return "Rada Rodziców";
  const classItem = getClassById(budget.classId);
  return classItem ? `Kasa klasowa ${classItem.name}` : budget.name;
}

function getSortedBudgets() {
  const schoolBudget = getSchoolBudget();
  const classBudgets = getClassBudgets();
  return [schoolBudget, ...classBudgets];
}

function isFirebaseConfigured() {
  return Boolean(appState.firebaseSync.settings || loadFirebaseSyncSettings());
}

function getCurrentRoleKey() {
  if (!isFirebaseConfigured()) return USER_ROLES.localAdmin;
  return appState.auth.role?.role || USER_ROLES.pending;
}

function getCurrentRoleLabel() {
  return ROLE_LABELS[getCurrentRoleKey()] || "Nieznana rola";
}

function getAssignedClassIds() {
  return Array.isArray(appState.auth.role?.classIds) ? appState.auth.role.classIds : [];
}

function isLocalAdminRole() {
  return getCurrentRoleKey() === USER_ROLES.localAdmin;
}


function isSchoolTreasurerRole() {
  return [USER_ROLES.schoolTreasurer, USER_ROLES.legacyAdmin].includes(getCurrentRoleKey());
}


function canViewApp() {
  if (!isFirebaseConfigured()) return true;
  if (!appState.auth.user) return false;
  return getCurrentRoleKey() !== USER_ROLES.pending;
}

function canManageUsers() {
  // Nie ma osobnej roli „administrator”. Skarbnik Rady Rodziców administruje aplikacją.
  return isLocalAdminRole() || isSchoolTreasurerRole();
}

function canManageGlobalData() {
  // Dane organizacyjne aplikacji: lata szkolne, klasy, uczniowie, kategorie, import.
  // To nie daje prawa do prywatnych finansów klasowych.
  return isLocalAdminRole() || isSchoolTreasurerRole();
}

function hasAssignedClassAccess(classId) {
  return Boolean(classId) && getAssignedClassIds().includes(classId);
}

function canManageClass(classId) {
  if (canManageGlobalData()) return true;
  return hasAssignedClassAccess(classId) && [USER_ROLES.classTreasurer, USER_ROLES.viewer].includes(getCurrentRoleKey()) === false;
}

function canViewBudgetId(budgetId) {
  const budget = getBudgetById(budgetId);
  if (!budget) return false;
  if (isLocalAdminRole()) return true;

  if (budget.type === BUDGET_TYPES.school) {
    return isSchoolTreasurerRole();
  }

  if (budget.type === BUDGET_TYPES.class) {
    return hasAssignedClassAccess(budget.classId);
  }

  return false;
}

function canManageBudgetId(budgetId) {
  const budget = getBudgetById(budgetId);
  if (!budget) return false;
  if (isLocalAdminRole()) return true;

  if (budget.type === BUDGET_TYPES.school) {
    return isSchoolTreasurerRole();
  }

  if (budget.type === BUDGET_TYPES.class) {
    return hasAssignedClassAccess(budget.classId) && [USER_ROLES.schoolTreasurer, USER_ROLES.classTreasurer, USER_ROLES.legacyAdmin].includes(getCurrentRoleKey());
  }

  return false;
}

function canManageSync() {
  if (!canViewApp()) return false;
  return [USER_ROLES.localAdmin, USER_ROLES.schoolTreasurer, USER_ROLES.classTreasurer, USER_ROLES.legacyAdmin].includes(getCurrentRoleKey());
}

function getAccessibleBudgetsForRead() {
  return getSortedBudgets().filter((budget) => canViewBudgetId(budget.id));
}

function getAccessibleBudgetsForWrite() {
  return getSortedBudgets().filter((budget) => canManageBudgetId(budget.id));
}


function getAccessiblePayments() {
  return appState.payments.filter((payment) => canViewBudgetId(payment.budgetId));
}

function getAccessibleExpenses() {
  return appState.expenses.filter((expense) => canViewBudgetId(expense.budgetId));
}

function getVisibleClasses() {
  if (isLocalAdminRole() || isSchoolTreasurerRole()) {
    return [...appState.classes].sort((a, b) => compareByName(a, b, "name"));
  }

  const assigned = new Set(getAssignedClassIds());
  return appState.classes
    .filter((classItem) => assigned.has(classItem.id))
    .sort((a, b) => compareByName(a, b, "name"));
}

function getVisibleStudents() {
  if (isLocalAdminRole() || isSchoolTreasurerRole()) {
    return [...appState.students].sort((a, b) => compareByName(a, b, "fullName"));
  }

  const assigned = new Set(getAssignedClassIds());
  return appState.students
    .filter((student) => assigned.has(student.classId))
    .sort((a, b) => compareByName(a, b, "fullName"));
}

function getRoleClassLabel(classIds) {
  if (!Array.isArray(classIds) || classIds.length === 0) return "brak przypisanych klas";
  return classIds
    .map((classId) => getClassById(classId)?.name || classId)
    .join(", ");
}

function requirePermission(condition, message) {
  if (condition) return true;
  showToast(message || "Brak uprawnień do tej operacji.");
  return false;
}

function fillBudgetSelectById(selectId) {
  const select = $(selectId);
  if (!select) return;

  const currentValue = select.value;
  const isWriteSelect = ["#paymentBudgetId", "#expenseBudgetId", "#receiptBudgetId"].includes(selectId);
  const budgets = isWriteSelect ? getAccessibleBudgetsForWrite() : getAccessibleBudgetsForRead();
  const options = budgets.map((budget) => `
    <option value="${escapeHtml(budget.id)}">${escapeHtml(getBudgetLabel(budget))}</option>
  `).join("");

  select.innerHTML = options || `<option value="">Brak dostępnych budżetów</option>`;

  if (currentValue && budgets.some((budget) => budget.id === currentValue)) {
    select.value = currentValue;
  } else if (budgets.length > 0) {
    select.value = budgets[0].id;
  } else {
    select.value = "";
  }
}


function renderSchoolYearSelect() {
  const select = $("#schoolYearSelect");
  if (!select) return;

  const years = [...appState.schoolYears].sort((a, b) => Number(b.startYear) - Number(a.startYear));
  select.innerHTML = years.map((year) => `
    <option value="${escapeHtml(year.id)}">${escapeHtml(year.name)}</option>
  `).join("");
  select.value = appState.activeSchoolYearId;

  const label = getActiveSchoolYearName();
  const dashboardYear = $("#dashboardSchoolYearName");
  if (dashboardYear) dashboardYear.textContent = label;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function sumPayments(payments) {
  return payments.reduce((sum, payment) => sum + normalizeMoney(payment.amount), 0);
}

function sumExpenses(expenses) {
  return expenses.reduce((sum, expense) => sum + normalizeMoney(expense.amount), 0);
}


function getPaymentsForBudget(budgetId) {
  return appState.payments.filter((payment) => payment.budgetId === budgetId);
}

function getPaymentsForStudentInBudget(studentId, budgetId) {
  return appState.payments.filter((payment) => payment.studentId === studentId && payment.budgetId === budgetId);
}


function getExpensesForBudget(budgetId) {
  return appState.expenses.filter((expense) => expense.budgetId === budgetId);
}

function fillDashboardBudgetFilter() {
  const select = $("#dashboardBudgetFilter");
  if (!select) return;

  const currentValue = select.value || "all";
  const options = getAccessibleBudgetsForRead().map((budget) => `
    <option value="${escapeHtml(budget.id)}">${escapeHtml(getBudgetLabel(budget))}</option>
  `).join("");

  select.innerHTML = `
    <option value="all">Wszystkie budżety</option>
    ${options}
  `;

  if (currentValue === "all" || getAccessibleBudgetsForRead().some((budget) => budget.id === currentValue)) {
    select.value = currentValue;
  } else {
    select.value = "all";
  }
}

function getDashboardBudgetFilterValue() {
  return $("#dashboardBudgetFilter")?.value || "all";
}

function isRecordInDashboardDateRange(record) {
  const date = String(record?.date ?? "");
  const dateFrom = $("#dashboardDateFrom")?.value || "";
  const dateTo = $("#dashboardDateTo")?.value || "";

  if (dateFrom && date && date < dateFrom) return false;
  if (dateTo && date && date > dateTo) return false;
  return true;
}

function isRecordInDashboardBudget(record) {
  const budgetId = getDashboardBudgetFilterValue();
  return budgetId === "all" || record.budgetId === budgetId;
}

function getDashboardPayments() {
  return getAccessiblePayments().filter((payment) => isRecordInDashboardBudget(payment) && isRecordInDashboardDateRange(payment));
}

function getDashboardExpenses() {
  return getAccessibleExpenses().filter((expense) => isRecordInDashboardBudget(expense) && isRecordInDashboardDateRange(expense));
}

function getDashboardMissingTargetBudgetId() {
  const selectedBudgetId = getDashboardBudgetFilterValue();
  if (selectedBudgetId !== "all") return selectedBudgetId;
  const accessible = getAccessibleBudgetsForRead();
  return accessible[0]?.id || getSchoolBudgetId();
}

function getExpectedPaymentRowsForBudget(budgetId) {
  const budget = getBudgetById(budgetId) ?? getSchoolBudget();
  let classes = [];

  if (budget.type === BUDGET_TYPES.class) {
    const classItem = getClassById(budget.classId);
    classes = classItem ? [classItem] : [];
  } else {
    classes = [...appState.classes].sort((a, b) => compareByName(a, b, "name"));
  }

  const rows = [];
  for (const classItem of classes) {
    const expectedAmount = budget.type === BUDGET_TYPES.class
      ? normalizeMoney(budget.defaultFee ?? classItem.classDefaultFee ?? classItem.defaultFee)
      : normalizeMoney(classItem.schoolDefaultFee ?? classItem.defaultFee);
    const students = getStudentsForClass(classItem.id).filter((student) => student.isActive);

    for (const student of students) {
      const paid = sumPayments(getPaymentsForStudentInBudget(student.id, budget.id));
      const missing = Math.max(0, expectedAmount - paid);
      rows.push({ classItem, student, expectedAmount, paid, missing, isPaid: expectedAmount > 0 && paid >= expectedAmount });
    }
  }

  return rows;
}

function summarizeExpectedRows(rows) {
  const expectedTotal = rows.reduce((sum, row) => sum + row.expectedAmount, 0);
  const paidTotal = rows.reduce((sum, row) => sum + Math.min(row.paid, row.expectedAmount), 0);
  const missingTotal = rows.reduce((sum, row) => sum + row.missing, 0);
  const paidStudents = rows.filter((row) => row.isPaid).length;

  return { expectedTotal, paidTotal, missingTotal, paidStudents, totalStudents: rows.length };
}

function getMissingSummaryForBudget(budgetId) {
  return summarizeExpectedRows(getExpectedPaymentRowsForBudget(budgetId));
}

function updateDashboardFilterInfo() {
  const info = $("#dashboardFilterInfo");
  if (!info) return;

  const budgetId = getDashboardBudgetFilterValue();
  const budgetName = budgetId === "all" ? "wszystkie budżety" : getBudgetLabel(getBudgetById(budgetId));
  const dateFrom = $("#dashboardDateFrom")?.value || "";
  const dateTo = $("#dashboardDateTo")?.value || "";
  const dateInfo = dateFrom || dateTo
    ? `Zakres dat: ${dateFrom || "od początku"} — ${dateTo || "do końca"}.`
    : "Bez ograniczenia dat.";

  info.textContent = `Filtr: ${budgetName}. ${dateInfo}`;
}

function renderDashboardBudgetList() {
  const container = $("#dashboardBudgetList");
  if (!container) return;

  const budgets = getAccessibleBudgetsForRead();
  if (budgets.length === 0) {
    container.innerHTML = `<div class="empty-state">Brak budżetów do pokazania.</div>`;
    return;
  }

  container.innerHTML = budgets.map((budget) => {
    const payments = sumPayments(getPaymentsForBudget(budget.id).filter(isRecordInDashboardDateRange));
    const expenses = sumExpenses(getExpensesForBudget(budget.id).filter(isRecordInDashboardDateRange));
    const balance = payments - expenses;
    const statusClass = balance >= 0 ? "status-ok" : "status-offline";

    return `
      <div class="dashboard-table-row">
        <div>
          <strong>${escapeHtml(getBudgetLabel(budget))}</strong>
          <span>${budget.type === BUDGET_TYPES.school ? "budżet całej szkoły" : "kasa klasowa"}</span>
        </div>
        <span>Wpłaty: ${formatMoney(payments)}</span>
        <span>Wydatki: ${formatMoney(expenses)}</span>
        <span class="status-pill ${statusClass}">Saldo: ${formatMoney(balance)}</span>
      </div>
    `;
  }).join("");
}

function renderDashboardMissingClassesList() {
  const container = $("#dashboardMissingClassesList");
  if (!container) return;

  const budgetId = getDashboardMissingTargetBudgetId();
  const budget = getBudgetById(budgetId) ?? getSchoolBudget();
  const title = $("#dashboardMissingTitle");
  if (title) title.textContent = `Kontrola wpłat dla: ${getBudgetLabel(budget)}.`;

  const rows = getExpectedPaymentRowsForBudget(budgetId);
  if (rows.length === 0) {
    container.innerHTML = `<div class="empty-state">Brak aktywnych uczniów albo brak klas do kontroli wpłat.</div>`;
    return;
  }

  const grouped = new Map();
  for (const row of rows) {
    const key = row.classItem.id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        classItem: row.classItem,
        students: 0,
        paidStudents: 0,
        expected: 0,
        paid: 0,
        missing: 0,
      });
    }

    const item = grouped.get(key);
    item.students += 1;
    item.paidStudents += row.isPaid ? 1 : 0;
    item.expected += row.expectedAmount;
    item.paid += Math.min(row.paid, row.expectedAmount);
    item.missing += row.missing;
  }

  const sorted = [...grouped.values()].sort((a, b) => b.missing - a.missing || compareByName(a.classItem, b.classItem, "name"));
  container.innerHTML = sorted.map((item) => {
    const statusClass = item.missing <= 0 ? "status-ok" : "status-warning";
    return `
      <div class="dashboard-table-row">
        <div>
          <strong>Klasa ${escapeHtml(item.classItem.name)}</strong>
          <span>Opłaceni uczniowie: ${item.paidStudents}/${item.students}</span>
        </div>
        <span>Plan: ${formatMoney(item.expected)}</span>
        <span>Wpłacono: ${formatMoney(item.paid)}</span>
        <span class="status-pill ${statusClass}">Brakuje: ${formatMoney(item.missing)}</span>
      </div>
    `;
  }).join("");
}

function renderDashboardRecentActivity() {
  const container = $("#dashboardRecentActivityList");
  if (!container) return;

  const payments = getDashboardPayments().map((payment) => ({
    kind: "payment",
    id: payment.id,
    date: payment.date,
    createdAt: payment.createdAt,
    amount: payment.amount,
    budgetId: payment.budgetId,
    label: payment.studentId ? getStudentById(payment.studentId)?.fullName : payment.payerName,
    note: payment.methodLabel || payment.method || "wpłata",
  }));

  const expenses = getDashboardExpenses().map((expense) => ({
    kind: "expense",
    id: expense.id,
    date: expense.date,
    createdAt: expense.createdAt,
    amount: expense.amount,
    budgetId: expense.budgetId,
    label: expense.description || expense.seller || expense.receiptNumber,
    note: getExpenseCategoryLabel(expense.categoryId || expense.category),
  }));

  const items = [...payments, ...expenses]
    .sort((a, b) => {
      const dateCompare = String(b.date ?? "").localeCompare(String(a.date ?? ""));
      if (dateCompare !== 0) return dateCompare;
      return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
    })
    .slice(0, 8);

  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state">Brak operacji dla aktualnego filtra.</div>`;
    return;
  }

  container.innerHTML = items.map((item) => {
    const budget = getBudgetById(item.budgetId);
    const typeLabel = item.kind === "payment" ? "Wpłata" : "Wydatek";
    const typeClass = item.kind === "payment" ? "status-ok" : "status-warning";

    return `
      <div class="dashboard-table-row">
        <div>
          <strong>${escapeHtml(typeLabel)} — ${formatMoney(item.amount)}</strong>
          <span>${escapeHtml(item.label || "bez opisu")}</span>
        </div>
        <span>Data: ${escapeHtml(item.date || "brak")}</span>
        <span>${escapeHtml(getBudgetLabel(budget))}</span>
        <span class="status-pill ${typeClass}">${escapeHtml(item.note || typeLabel)}</span>
      </div>
    `;
  }).join("");
}

function updateDashboard() {
  fillDashboardBudgetFilter();

  const activeStudents = getVisibleStudents().filter((student) => student.isActive).length;
  const filteredPayments = getDashboardPayments();
  const filteredExpenses = getDashboardExpenses();
  const totalPayments = sumPayments(filteredPayments);
  const totalExpenses = sumExpenses(filteredExpenses);
  const totalBalance = totalPayments - totalExpenses;
  const schoolPayments = canViewBudgetId(getSchoolBudgetId()) ? sumPayments(appState.payments.filter((payment) => payment.budgetId === getSchoolBudgetId() && isRecordInDashboardDateRange(payment))) : 0;
  const classPayments = sumPayments(getAccessiblePayments().filter((payment) => payment.budgetId !== getSchoolBudgetId() && isRecordInDashboardDateRange(payment)));
  const schoolExpenses = canViewBudgetId(getSchoolBudgetId()) ? sumExpenses(appState.expenses.filter((expense) => expense.budgetId === getSchoolBudgetId() && isRecordInDashboardDateRange(expense))) : 0;
  const classExpenses = sumExpenses(getAccessibleExpenses().filter((expense) => expense.budgetId !== getSchoolBudgetId() && isRecordInDashboardDateRange(expense)));
  const schoolMissing = canViewBudgetId(getSchoolBudgetId()) ? getMissingSummaryForBudget(getSchoolBudgetId()) : { missingTotal: 0, paidStudents: 0, totalStudents: 0 };
  const classMissingTotal = getClassBudgets().filter((budget) => canViewBudgetId(budget.id)).reduce((sum, budget) => sum + getMissingSummaryForBudget(budget.id).missingTotal, 0);
  const dashboardMissing = getMissingSummaryForBudget(getDashboardMissingTargetBudgetId());

  $("#totalClasses").textContent = String(getVisibleClasses().length);
  $("#activeStudents").textContent = String(activeStudents);
  $("#totalPayments").textContent = String(filteredPayments.length);
  $("#totalPaymentsAmount").textContent = formatMoney(totalPayments);
  const dashboardPaymentsSmall = $("#dashboardPaymentsSmall");
  if (dashboardPaymentsSmall) dashboardPaymentsSmall.textContent = `${filteredPayments.length} ${filteredPayments.length === 1 ? "wpłata" : "wpłat"} po filtrach`;
  $("#totalExpensesAmount").textContent = formatMoney(totalExpenses);
  $("#totalBalanceAmount").textContent = formatMoney(totalBalance);
  $("#dashboardSchoolPayments").textContent = formatMoney(schoolPayments);
  $("#dashboardClassPayments").textContent = formatMoney(classPayments);
  $("#dashboardSchoolExpenses").textContent = formatMoney(schoolExpenses);
  $("#dashboardClassExpenses").textContent = formatMoney(classExpenses);
  $("#dashboardSchoolBalance").textContent = formatMoney(schoolPayments - schoolExpenses);
  $("#dashboardClassBalance").textContent = formatMoney(classPayments - classExpenses);
  $("#dashboardSchoolMissing").textContent = formatMoney(schoolMissing.missingTotal);
  $("#dashboardClassMissing").textContent = formatMoney(classMissingTotal);
  $("#dashboardMissingAmount").textContent = formatMoney(dashboardMissing.missingTotal);
  $("#dashboardPaidStudents").textContent = `${dashboardMissing.paidStudents}/${dashboardMissing.totalStudents}`;

  const missingScope = getDashboardBudgetFilterValue() === "all"
    ? "kontrola braków dla Rady Rodziców"
    : `kontrola braków dla: ${getBudgetLabel(getBudgetById(getDashboardMissingTargetBudgetId()))}`;
  $("#dashboardMissingScope").textContent = missingScope;

  updateDashboardFilterInfo();
  renderDashboardBudgetList();
  renderDashboardMissingClassesList();
  renderDashboardRecentActivity();
}

function getStudentsForClass(classId) {
  return appState.students
    .filter((student) => student.classId === classId)
    .sort((a, b) => compareByName(a, b, "fullName"));
}

function renderClasses() {
  const classList = $("#classList");
  const classes = getVisibleClasses();

  if (classes.length === 0) {
    classList.innerHTML = `<div class="empty-state">Brak klas. Dodaj pierwszą klasę po lewej stronie.</div>`;
    return;
  }

  classList.innerHTML = classes.map((classItem) => {
    const students = getStudentsForClass(classItem.id);
    const activeCount = students.filter((student) => student.isActive).length;
    const selectedClass = classItem.id === appState.selectedClassId ? " selected" : "";
    const budget = appState.budgets.find((item) => item.classId === classItem.id);

    return `
      <div class="entity-row${selectedClass}" data-class-id="${escapeHtml(classItem.id)}">
        <div>
          <div class="entity-title"><span>${escapeHtml(classItem.name)}</span></div>
          <div class="entity-meta">
            <span>Uczniowie: ${activeCount}/${students.length}</span>
            <span>Składka: ${formatMoney(classItem.defaultFee)}</span>
            <span>${budget ? "Kasa klasowa: utworzona" : "Kasa klasowa: brak"}</span>
          </div>
        </div>
        <div class="entity-actions">
          <button class="small-button primary-action" data-action="select-class" type="button">Otwórz</button>
          <button class="small-button" data-action="edit-class" type="button">Edytuj</button>
          <button class="small-button danger-action" data-action="delete-class" type="button">Usuń</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderSelectedClass() {
  const selectedClass = getVisibleClasses().find((item) => item.id === appState.selectedClassId);
  const selectedPanel = $("#selectedClassPanel");
  const info = $("#noClassSelectedInfo");

  if (!selectedClass) {
    selectedPanel.classList.add("hidden");
    info.classList.remove("hidden");
    return;
  }

  selectedPanel.classList.remove("hidden");
  info.classList.add("hidden");

  const students = getStudentsForClass(selectedClass.id);
  const activeCount = students.filter((student) => student.isActive).length;
  const budget = appState.budgets.find((item) => item.classId === selectedClass.id);

  $("#selectedClassName").textContent = `Klasa ${selectedClass.name}`;
  $("#selectedClassMeta").textContent = `Uczniów aktywnych: ${activeCount}, wszystkich zapisanych: ${students.length}. Budżet: ${budget?.name ?? "brak"}.`;
  $("#selectedClassFee").textContent = `Składka: ${formatMoney(selectedClass.defaultFee)}`;

  renderStudents(students);
}

function renderStudents(students) {
  const studentList = $("#studentList");

  if (students.length === 0) {
    studentList.innerHTML = `<div class="empty-state">Brak uczniów w tej klasie.</div>`;
    return;
  }

  studentList.innerHTML = students.map((student) => `
    <div class="entity-row" data-student-id="${escapeHtml(student.id)}">
      <div>
        <div class="entity-title">
          <span>${escapeHtml(student.fullName)}</span>
          ${student.isActive ? "" : `<span class="inactive-badge">nieaktywny</span>`}
        </div>
        <div class="entity-meta">
          <span>${student.isActive ? "Liczony do klasy" : "Zostaje tylko w historii"}</span>
        </div>
      </div>
      <div class="entity-actions">
        <button class="small-button" data-action="edit-student" type="button">Edytuj</button>
        <button class="small-button danger-action" data-action="delete-student" type="button">Usuń</button>
      </div>
    </div>
  `).join("");
}

function renderBudgets() {
  const budgetList = $("#budgetList");
  const schoolBudget = getSchoolBudget();
  const readableBudgets = getAccessibleBudgetsForRead();
  const canReadSchoolBudget = readableBudgets.some((budget) => budget.id === schoolBudget.id);
  const classBudgets = getClassBudgets().filter((budget) => canViewBudgetId(budget.id));
  const schoolPayments = canReadSchoolBudget ? getPaymentsForBudget(schoolBudget.id) : [];
  const schoolExpenses = canReadSchoolBudget ? getExpensesForBudget(schoolBudget.id) : [];
  const schoolBalance = sumPayments(schoolPayments) - sumExpenses(schoolExpenses);
  const schoolRow = `
    <div class="entity-row budget-row budget-row-school" data-budget-id="${escapeHtml(schoolBudget.id)}">
      <div>
        <div class="entity-title">
          <span>${escapeHtml(schoolBudget.name)}</span>
          <span class="budget-badge">cała szkoła</span>
        </div>
        <div class="entity-meta">
          <span>Typ: budżet Rady Rodziców</span>
          <span>Wpłaty: ${schoolPayments.length}</span>
          <span>Wydatki: ${schoolExpenses.length}</span>
          <span>Zebrano: ${formatMoney(sumPayments(schoolPayments))}</span>
          <span>Wydano: ${formatMoney(sumExpenses(schoolExpenses))}</span>
          <span>Saldo: ${formatMoney(schoolBalance)}</span>
        </div>
      </div>
      <span class="status-pill status-ok">Aktywny</span>
    </div>
  `;

  const classRows = classBudgets.map((budget) => {
    const classItem = appState.classes.find((item) => item.id === budget.classId);
    const students = classItem ? getStudentsForClass(classItem.id) : [];
    const activeCount = students.filter((student) => student.isActive).length;
    const budgetPayments = getPaymentsForBudget(budget.id);
    const budgetExpenses = getExpensesForBudget(budget.id);
    const budgetBalance = sumPayments(budgetPayments) - sumExpenses(budgetExpenses);

    return `
      <div class="entity-row budget-row" data-budget-id="${escapeHtml(budget.id)}">
        <div>
          <div class="entity-title">
            <span>${escapeHtml(budget.name)}</span>
            <span class="budget-badge">klasa</span>
          </div>
          <div class="entity-meta">
            <span>Klasa: ${escapeHtml(classItem?.name ?? "brak")}</span>
            <span>Aktywnych uczniów: ${activeCount}</span>
            <span>Wpłaty: ${budgetPayments.length}</span>
            <span>Wydatki: ${budgetExpenses.length}</span>
            <span>Zebrano: ${formatMoney(sumPayments(budgetPayments))}</span>
            <span>Wydano: ${formatMoney(sumExpenses(budgetExpenses))}</span>
            <span>Saldo: ${formatMoney(budgetBalance)}</span>
          </div>
        </div>
        <span class="status-pill status-ok">Aktywny</span>
      </div>
    `;
  }).join("");

  const emptyInfo = classBudgets.length === 0
    ? `<div class="empty-state">Nie ma jeszcze kas klasowych. Dodaj klasę, a aplikacja utworzy jej budżet automatycznie.</div>`
    : "";

  budgetList.innerHTML = (canReadSchoolBudget ? schoolRow : "") + classRows + emptyInfo;
}

function fillBudgetSelect() {
  fillBudgetSelectById("#paymentBudgetId");
}

function fillClassSelect() {
  const select = $("#paymentClassId");
  const currentValue = select.value;
  const classes = getVisibleClasses();

  select.innerHTML = `
    <option value="">Bez klasy / darowizna</option>
    ${classes.map((classItem) => `<option value="${escapeHtml(classItem.id)}">${escapeHtml(classItem.name)}</option>`).join("")}
  `;

  if (currentValue && classes.some((classItem) => classItem.id === currentValue)) {
    select.value = currentValue;
  }
}

function fillStudentSelect() {
  const classId = $("#paymentClassId").value;
  const select = $("#paymentStudentId");
  const currentValue = select.value;
  const students = classId
    ? getStudentsForClass(classId).filter((student) => student.isActive)
    : [];

  select.innerHTML = `
    <option value="">Bez ucznia / wpłata ogólna</option>
    ${students.map((student) => `<option value="${escapeHtml(student.id)}">${escapeHtml(student.fullName)}</option>`).join("")}
  `;

  if (currentValue && students.some((student) => student.id === currentValue)) {
    select.value = currentValue;
  }
}

function syncPaymentBudgetFields() {
  const budget = getBudgetById($("#paymentBudgetId").value);
  const classSelect = $("#paymentClassId");

  if (budget?.type === BUDGET_TYPES.class) {
    classSelect.value = budget.classId || "";
    classSelect.disabled = true;
  } else {
    classSelect.disabled = false;
  }

  fillStudentSelect();
}

function renderPaymentFormSelectors() {
  fillBudgetSelect();
  fillClassSelect();
  fillCategorySelect("#paymentCategoryId", CATEGORY_TYPES.payment);
  syncPaymentBudgetFields();
}

function renderPaymentSummary() {
  const visiblePayments = getAccessiblePayments();
  const schoolPayments = visiblePayments.filter((payment) => payment.budgetId === getSchoolBudgetId());
  const classPayments = visiblePayments.filter((payment) => payment.budgetId !== getSchoolBudgetId());

  $("#paymentsCount").textContent = String(visiblePayments.length);
  $("#paymentsTotal").textContent = formatMoney(sumPayments(visiblePayments));
  $("#paymentsSchoolTotal").textContent = formatMoney(sumPayments(schoolPayments));
  $("#paymentsClassTotal").textContent = formatMoney(sumPayments(classPayments));
}

function renderPaymentList() {
  const paymentList = $("#paymentList");
  const payments = [...getAccessiblePayments()].sort((a, b) => {
    const dateCompare = String(b.date ?? "").localeCompare(String(a.date ?? ""));
    if (dateCompare !== 0) return dateCompare;
    return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
  });

  if (payments.length === 0) {
    paymentList.innerHTML = `<div class="empty-state">Nie ma jeszcze żadnych wpłat.</div>`;
    return;
  }

  paymentList.innerHTML = payments.map((payment) => {
    const budget = getBudgetById(payment.budgetId);
    const classItem = getClassById(payment.classId);
    const student = getStudentById(payment.studentId);
    const payer = student?.fullName || payment.payerName || "wpłata ogólna";

    return `
      <div class="entity-row payment-row" data-payment-id="${escapeHtml(payment.id)}">
        <div>
          <div class="entity-title">
            <span>${formatMoney(payment.amount)}</span>
            <span class="budget-badge">${escapeHtml(getBudgetLabel(budget))}</span>
          </div>
          <div class="entity-meta">
            <span>Data: ${escapeHtml(payment.date || "brak")}</span>
            <span>Kategoria: ${escapeHtml(getPaymentCategoryLabel(payment.categoryId || payment.category))}</span>
            <span>Wpłacający: ${escapeHtml(payer)}</span>
            <span>Klasa: ${escapeHtml(classItem?.name ?? "brak")}</span>
            <span>Metoda: ${escapeHtml(payment.methodLabel || payment.method || "brak")}</span>
            ${payment.notes ? `<span>Notatka: ${escapeHtml(payment.notes)}</span>` : ""}
          </div>
        </div>
        <div class="entity-actions">
          <button class="small-button" data-action="edit-payment" type="button">Edytuj</button>
          <button class="small-button danger-action" data-action="delete-payment" type="button">Usuń</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderPaymentControl() {
  const container = $("#paymentControlList");
  const budgetId = $("#paymentBudgetId")?.value || getSchoolBudgetId();
  const budget = getBudgetById(budgetId) ?? getSchoolBudget();
  let classes = [];

  if (budget.type === BUDGET_TYPES.class) {
    const classItem = getClassById(budget.classId);
    classes = classItem ? [classItem] : [];
  } else {
    classes = [...appState.classes].sort((a, b) => compareByName(a, b, "name"));
  }

  if (classes.length === 0) {
    container.innerHTML = `<div class="empty-state">Brak klas do kontroli wpłat.</div>`;
    return;
  }

  const rows = [];

  for (const classItem of classes) {
    const students = getStudentsForClass(classItem.id).filter((student) => student.isActive);
    const expectedAmount = normalizeMoney(classItem.defaultFee);

    if (students.length === 0) {
      rows.push(`
        <div class="payment-control-class">
          <h4>Klasa ${escapeHtml(classItem.name)}</h4>
          <div class="empty-state">Brak aktywnych uczniów.</div>
        </div>
      `);
      continue;
    }

    const studentRows = students.map((student) => {
      const paid = sumPayments(getPaymentsForStudentInBudget(student.id, budget.id));
      const missing = Math.max(0, expectedAmount - paid);
      let statusClass = "status-muted";
      let statusText = "Brak ustawionej składki";

      if (expectedAmount > 0 && paid >= expectedAmount) {
        statusClass = "status-ok";
        statusText = "Opłacone";
      } else if (expectedAmount > 0 && paid > 0) {
        statusClass = "status-warning";
        statusText = `Częściowo, brakuje ${formatMoney(missing)}`;
      } else if (expectedAmount > 0) {
        statusClass = "status-offline";
        statusText = `Brak wpłaty: ${formatMoney(expectedAmount)}`;
      }

      return `
        <div class="payment-control-row">
          <span>${escapeHtml(student.fullName)}</span>
          <strong>${formatMoney(paid)}</strong>
          <span class="status-pill ${statusClass}">${escapeHtml(statusText)}</span>
        </div>
      `;
    }).join("");

    rows.push(`
      <div class="payment-control-class">
        <h4>Klasa ${escapeHtml(classItem.name)} <span class="muted-inline">oczekiwana składka: ${formatMoney(expectedAmount)}</span></h4>
        <div class="payment-control-list">${studentRows}</div>
      </div>
    `);
  }

  container.innerHTML = rows.join("");
}

function renderPayments() {
  renderPaymentFormSelectors();
  renderPaymentSummary();
  renderPaymentList();
  renderPaymentControl();
}

function fillExpenseBudgetSelect() {
  fillBudgetSelectById("#expenseBudgetId");
}

function renderExpenseSummary() {
  const visibleExpenses = getAccessibleExpenses();
  const schoolExpenses = visibleExpenses.filter((expense) => expense.budgetId === getSchoolBudgetId());
  const classExpenses = visibleExpenses.filter((expense) => expense.budgetId !== getSchoolBudgetId());

  $("#expensesCount").textContent = String(visibleExpenses.length);
  $("#expensesTotal").textContent = formatMoney(sumExpenses(visibleExpenses));
  $("#expensesSchoolTotal").textContent = formatMoney(sumExpenses(schoolExpenses));
  $("#expensesClassTotal").textContent = formatMoney(sumExpenses(classExpenses));
}

function renderExpenseList() {
  const expenseList = $("#expenseList");
  const expenses = [...getAccessibleExpenses()].sort((a, b) => {
    const dateCompare = String(b.date ?? "").localeCompare(String(a.date ?? ""));
    if (dateCompare !== 0) return dateCompare;
    return String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? ""));
  });

  if (expenses.length === 0) {
    expenseList.innerHTML = `<div class="empty-state">Nie ma jeszcze żadnych wydatków.</div>`;
    return;
  }

  expenseList.innerHTML = expenses.map((expense) => {
    const budget = getBudgetById(expense.budgetId);
    const classItem = getClassById(expense.classId);
    const receipt = expense.receiptNumber ? `Paragon/faktura: ${escapeHtml(expense.receiptNumber)}` : "Brak numeru dokumentu";

    return `
      <div class="entity-row expense-row" data-expense-id="${escapeHtml(expense.id)}">
        <div>
          <div class="entity-title">
            <span>${formatMoney(expense.amount)}</span>
            <span class="budget-badge">${escapeHtml(getBudgetLabel(budget))}</span>
            <span class="category-badge">${escapeHtml(getExpenseCategoryLabel(expense.categoryId || expense.category))}</span>
          </div>
          <div class="entity-meta">
            <span>Data: ${escapeHtml(expense.date || "brak")}</span>
            <span>Klasa: ${escapeHtml(classItem?.name ?? "brak")}</span>
            <span>${receipt}</span>
            ${expense.seller ? `<span>Sprzedawca: ${escapeHtml(expense.seller)}</span>` : ""}
            ${expense.description ? `<span>Opis: ${escapeHtml(expense.description)}</span>` : ""}
          </div>
        </div>
        <div class="entity-actions">
          <button class="small-button" data-action="edit-expense" type="button">Edytuj</button>
          <button class="small-button danger-action" data-action="delete-expense" type="button">Usuń</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderExpenseBalanceList() {
  const container = $("#expenseBalanceList");
  const budgets = getAccessibleBudgetsForRead();

  container.innerHTML = budgets.map((budget) => {
    const payments = sumPayments(getPaymentsForBudget(budget.id));
    const expenses = sumExpenses(getExpensesForBudget(budget.id));
    const balance = payments - expenses;
    const statusClass = balance >= 0 ? "status-ok" : "status-offline";

    return `
      <div class="payment-control-row">
        <span>${escapeHtml(getBudgetLabel(budget))}</span>
        <span>Wpłaty: ${formatMoney(payments)}</span>
        <span>Wydatki: ${formatMoney(expenses)}</span>
        <span class="status-pill ${statusClass}">Saldo: ${formatMoney(balance)}</span>
      </div>
    `;
  }).join("");
}

function renderExpenses() {
  fillExpenseBudgetSelect();
  fillCategorySelect("#expenseCategory", CATEGORY_TYPES.expense);
  renderExpenseSummary();
  renderExpenseList();
  renderExpenseBalanceList();
}


function fillReportBudgetSelect() {
  const select = $("#reportBudgetFilter");
  if (!select) return;

  const currentValue = select.value || "all";
  const options = getAccessibleBudgetsForRead().map((budget) => `
    <option value="${escapeHtml(budget.id)}">${escapeHtml(getBudgetLabel(budget))}</option>
  `).join("");

  select.innerHTML = `<option value="all">Wszystkie budżety</option>${options}`;
  select.value = currentValue === "all" || getAccessibleBudgetsForRead().some((budget) => budget.id === currentValue) ? currentValue : "all";
}

function getReportType() {
  return $("#reportType")?.value || "full";
}

function getReportBudgetFilterValue() {
  return $("#reportBudgetFilter")?.value || "all";
}

function isRecordInReportDateRange(record) {
  const date = String(record?.date ?? "");
  const dateFrom = $("#reportDateFrom")?.value || "";
  const dateTo = $("#reportDateTo")?.value || "";

  if (dateFrom && date && date < dateFrom) return false;
  if (dateTo && date && date > dateTo) return false;
  return true;
}

function isRecordInReportBudget(record) {
  const budgetId = getReportBudgetFilterValue();
  return budgetId === "all" || record.budgetId === budgetId;
}

function getReportPayments() {
  return getAccessiblePayments()
    .filter((payment) => isRecordInReportBudget(payment) && isRecordInReportDateRange(payment))
    .sort((a, b) => String(a.date ?? "").localeCompare(String(b.date ?? "")) || String(a.createdAt ?? "").localeCompare(String(b.createdAt ?? "")));
}

function getReportExpenses() {
  return getAccessibleExpenses()
    .filter((expense) => isRecordInReportBudget(expense) && isRecordInReportDateRange(expense))
    .sort((a, b) => String(a.date ?? "").localeCompare(String(b.date ?? "")) || String(a.createdAt ?? "").localeCompare(String(b.createdAt ?? "")));
}

function getReportBudgets() {
  const budgetId = getReportBudgetFilterValue();
  const budgets = getAccessibleBudgetsForRead();
  if (budgetId === "all") return budgets;
  return budgets.filter((budget) => budget.id === budgetId);
}

function getReportMissingBudgetId() {
  const selectedBudgetId = getReportBudgetFilterValue();
  if (selectedBudgetId !== "all") return selectedBudgetId;
  const accessible = getAccessibleBudgetsForRead();
  return accessible[0]?.id || getSchoolBudgetId();
}

function getReportDateLabel() {
  const dateFrom = $("#reportDateFrom")?.value || "";
  const dateTo = $("#reportDateTo")?.value || "";
  if (!dateFrom && !dateTo) return "cały rok szkolny";
  return `${dateFrom || "od początku"} — ${dateTo || "do końca"}`;
}

function getReportBudgetLabel() {
  const budgetId = getReportBudgetFilterValue();
  return budgetId === "all" ? "wszystkie budżety" : getBudgetLabel(getBudgetById(budgetId));
}

function buildSummaryRows() {
  const payments = getReportPayments();
  const expenses = getReportExpenses();
  const paymentTotal = sumPayments(payments);
  const expenseTotal = sumExpenses(expenses);
  const balance = paymentTotal - expenseTotal;
  const missing = getMissingSummaryForBudget(getReportMissingBudgetId());

  return [
    ["Pozycja", "Wartość"],
    ["Rok szkolny", getActiveSchoolYearName()],
    ["Budżet", getReportBudgetLabel()],
    ["Zakres dat", getReportDateLabel()],
    ["Liczba klas", getVisibleClasses().length],
    ["Aktywni uczniowie", getVisibleStudents().filter((student) => student.isActive).length],
    ["Liczba wpłat", payments.length],
    ["Suma wpłat", paymentTotal],
    ["Liczba wydatków", expenses.length],
    ["Suma wydatków", expenseTotal],
    ["Saldo", balance],
    ["Braki wpłat", missing.missingTotal],
    ["Uczniowie z pełną wpłatą", `${missing.paidStudents}/${missing.totalStudents}`],
  ];
}

function buildPaymentRows() {
  const rows = [["Data", "Budżet", "Klasa", "Uczeń / wpłacający", "Kategoria", "Metoda", "Kwota", "Notatka"]];
  for (const payment of getReportPayments()) {
    const budget = getBudgetById(payment.budgetId);
    const classItem = getClassById(payment.classId);
    const student = getStudentById(payment.studentId);
    rows.push([
      payment.date || "",
      getBudgetLabel(budget),
      classItem?.name || "",
      student?.fullName || payment.payerName || "",
      getPaymentCategoryLabel(payment.categoryId || payment.category),
      payment.methodLabel || getPaymentMethodLabel(payment.method),
      normalizeMoney(payment.amount),
      payment.notes || "",
    ]);
  }
  return rows;
}

function buildExpenseRows() {
  const rows = [["Data", "Budżet", "Kategoria", "Sprzedawca", "Numer paragonu / faktury", "Rozliczył", "Kwota", "Opis"]];
  for (const expense of getReportExpenses()) {
    const budget = getBudgetById(expense.budgetId);
    rows.push([
      expense.date || "",
      getBudgetLabel(budget),
      getExpenseCategoryLabel(expense.categoryId || expense.category),
      expense.seller || "",
      expense.receiptNumber || "",
      expense.paidBy || "",
      normalizeMoney(expense.amount),
      expense.description || "",
    ]);
  }
  return rows;
}

function buildMissingRows() {
  const budgetId = getReportMissingBudgetId();
  const budget = getBudgetById(budgetId) ?? getSchoolBudget();
  const rows = [["Budżet", "Klasa", "Uczeń", "Wymagana wpłata", "Wpłacono", "Brakuje", "Status"]];

  for (const item of getExpectedPaymentRowsForBudget(budget.id)) {
    rows.push([
      getBudgetLabel(budget),
      item.classItem.name,
      item.student.fullName,
      item.expectedAmount,
      item.paid,
      item.missing,
      item.isPaid ? "opłacone" : item.paid > 0 ? "częściowo" : "brak wpłaty",
    ]);
  }

  return rows;
}

function buildBalanceRows() {
  const rows = [["Budżet", "Typ", "Wpłaty", "Wydatki", "Saldo"]];
  for (const budget of getReportBudgets()) {
    const payments = getPaymentsForBudget(budget.id).filter(isRecordInReportDateRange);
    const expenses = getExpensesForBudget(budget.id).filter(isRecordInReportDateRange);
    const paymentTotal = sumPayments(payments);
    const expenseTotal = sumExpenses(expenses);
    rows.push([
      getBudgetLabel(budget),
      budget.type === BUDGET_TYPES.school ? "Rada Rodziców" : "Kasa klasowa",
      paymentTotal,
      expenseTotal,
      paymentTotal - expenseTotal,
    ]);
  }
  return rows;
}

function getReportSheets() {
  const type = getReportType();
  const allSheets = {
    summary: { name: "Podsumowanie", rows: buildSummaryRows() },
    balances: { name: "Salda", rows: buildBalanceRows() },
    payments: { name: "Wpłaty", rows: buildPaymentRows() },
    expenses: { name: "Wydatki", rows: buildExpenseRows() },
    missing: { name: "Braki", rows: buildMissingRows() },
  };

  if (type === "full") return [allSheets.summary, allSheets.balances, allSheets.payments, allSheets.expenses, allSheets.missing];
  if (allSheets[type]) return [allSheets[type]];
  return [allSheets.summary];
}

function reportFileName(extension) {
  const year = getActiveSchoolYearName().replace(/[\\/\s]+/g, "-");
  const type = getReportType();
  const date = getTodayDate();
  return `eskarbnik_${year}_${type}_${date}.${extension}`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvEscape(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  if (/[";\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function rowsToCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(";")).join("\r\n");
}

function exportReportCsv() {
  const sheets = getReportSheets();
  const content = sheets.map((sheet) => `### ${sheet.name}\r\n${rowsToCsv(sheet.rows)}`).join("\r\n\r\n");
  const blob = new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, reportFileName("csv"));
  showToast("Raport CSV został wygenerowany.");
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function columnName(index) {
  let name = "";
  let number = index + 1;
  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }
  return name;
}

function sheetXml(rows) {
  const body = rows.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => {
      const ref = `${columnName(columnIndex)}${rowIndex + 1}`;
      if (typeof value === "number" && Number.isFinite(value)) {
        return `<c r="${ref}" t="n"><v>${value}</v></c>`;
      }
      return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
    }).join("");
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetData>${body}</sheetData></worksheet>`;
}

function crc32(bytes) {
  if (!crc32.table) {
    crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc32.table[i] = c >>> 0;
    }
  }

  let crc = 0xffffffff;
  for (const byte of bytes) crc = crc32.table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(array, offset, value) {
  array[offset] = value & 0xff;
  array[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(array, offset, value) {
  array[offset] = value & 0xff;
  array[offset + 1] = (value >>> 8) & 0xff;
  array[offset + 2] = (value >>> 16) & 0xff;
  array[offset + 3] = (value >>> 24) & 0xff;
}

function createZip(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = typeof entry.content === "string" ? encoder.encode(entry.content) : entry.content;
    const crc = crc32(dataBytes);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    writeUint32(localHeader, 0, 0x04034b50);
    writeUint16(localHeader, 4, 20);
    writeUint16(localHeader, 6, 0);
    writeUint16(localHeader, 8, 0);
    writeUint16(localHeader, 10, 0);
    writeUint16(localHeader, 12, 0);
    writeUint32(localHeader, 14, crc);
    writeUint32(localHeader, 18, dataBytes.length);
    writeUint32(localHeader, 22, dataBytes.length);
    writeUint16(localHeader, 26, nameBytes.length);
    writeUint16(localHeader, 28, 0);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    writeUint32(centralHeader, 0, 0x02014b50);
    writeUint16(centralHeader, 4, 20);
    writeUint16(centralHeader, 6, 20);
    writeUint16(centralHeader, 8, 0);
    writeUint16(centralHeader, 10, 0);
    writeUint16(centralHeader, 12, 0);
    writeUint16(centralHeader, 14, 0);
    writeUint32(centralHeader, 16, crc);
    writeUint32(centralHeader, 20, dataBytes.length);
    writeUint32(centralHeader, 24, dataBytes.length);
    writeUint16(centralHeader, 28, nameBytes.length);
    writeUint16(centralHeader, 30, 0);
    writeUint16(centralHeader, 32, 0);
    writeUint16(centralHeader, 34, 0);
    writeUint16(centralHeader, 36, 0);
    writeUint32(centralHeader, 38, 0);
    writeUint32(centralHeader, 42, offset);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  writeUint32(end, 0, 0x06054b50);
  writeUint16(end, 4, 0);
  writeUint16(end, 6, 0);
  writeUint16(end, 8, entries.length);
  writeUint16(end, 10, entries.length);
  writeUint32(end, 12, centralSize);
  writeUint32(end, 16, offset);
  writeUint16(end, 20, 0);

  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}

function safeSheetName(name, index) {
  const cleaned = String(name || `Arkusz ${index + 1}`).replace(/[\\/?*\[\]:]/g, " ").slice(0, 31).trim();
  return cleaned || `Arkusz ${index + 1}`;
}

function exportReportXlsx() {
  const sheets = getReportSheets().map((sheet, index) => ({ ...sheet, name: safeSheetName(sheet.name, index) }));
  const workbookSheets = sheets.map((sheet, index) => `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join("");
  const workbookRels = sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join("");
  const sheetOverrides = sheets.map((_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");

  const entries = [
    { name: "[Content_Types].xml", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheetOverrides}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>` },
    { name: "_rels/.rels", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { name: "xl/workbook.xml", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${workbookSheets}</sheets></workbook>` },
    { name: "xl/_rels/workbook.xml.rels", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${workbookRels}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { name: "xl/styles.xml", content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>` },
    ...sheets.map((sheet, index) => ({ name: `xl/worksheets/sheet${index + 1}.xml`, content: sheetXml(sheet.rows) })),
  ];

  const blob = createZip(entries);
  downloadBlob(blob, reportFileName("xlsx"));
  showToast("Raport Excel został wygenerowany.");
}

function tableRowsToHtml(rows) {
  return `
    <table>
      <tbody>
        ${rows.map((row, index) => `
          <tr>${row.map((cell) => index === 0 ? `<th>${escapeHtml(cell)}</th>` : `<td>${escapeHtml(typeof cell === "number" ? cell.toLocaleString("pl-PL") : cell)}</td>`).join("")}</tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function exportReportPdf() {
  const sheets = getReportSheets();
  const body = sheets.map((sheet) => `
    <section class="report-section">
      <h2>${escapeHtml(sheet.name)}</h2>
      ${tableRowsToHtml(sheet.rows)}
    </section>
  `).join("");

  const printWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!printWindow) {
    showToast("Przeglądarka zablokowała okno widoku do druku.");
    return;
  }

  printWindow.document.write(`<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(reportFileName("pdf"))}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
    h1 { margin: 0 0 4px; font-size: 22px; }
    .meta { margin: 0 0 20px; color: #4b5563; }
    .report-section { margin: 0 0 26px; page-break-inside: avoid; }
    h2 { font-size: 17px; margin: 0 0 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #d1d5db; padding: 6px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; }
    @media print { button { display: none; } body { margin: 12mm; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Drukuj / zapisz jako PDF</button>
  <h1>Raport Rady Rodziców</h1>
  <p class="meta">Rok: ${escapeHtml(getActiveSchoolYearName())}. Budżet: ${escapeHtml(getReportBudgetLabel())}. Zakres dat: ${escapeHtml(getReportDateLabel())}.</p>
  ${body}
  <script>setTimeout(() => window.print(), 500);<\/script>
</body>
</html>`);
  printWindow.document.close();
  showToast("Otworzono widok do druku. W oknie drukowania możesz wybrać „Zapisz jako PDF”.");
}

function renderReportCards() {
  const payments = getReportPayments();
  const expenses = getReportExpenses();
  const paymentTotal = sumPayments(payments);
  const expenseTotal = sumExpenses(expenses);

  $("#reportsSchoolYearName").textContent = getActiveSchoolYearName();
  $("#reportsPaymentsTotal").textContent = formatMoney(paymentTotal);
  $("#reportsExpensesTotal").textContent = formatMoney(expenseTotal);
  $("#reportsBalanceTotal").textContent = formatMoney(paymentTotal - expenseTotal);
}

function renderReportsPreview() {
  const container = $("#reportsPreview");
  const info = $("#reportsFilterInfo");
  if (!container) return;

  if (info) info.textContent = `Raport: ${getReportType()}. Budżet: ${getReportBudgetLabel()}. Zakres dat: ${getReportDateLabel()}.`;

  const sheets = getReportSheets();
  container.innerHTML = sheets.map((sheet) => {
    const previewRows = sheet.rows.slice(0, 7);
    const hiddenRows = Math.max(0, sheet.rows.length - previewRows.length);
    return `
      <div class="report-preview-section">
        <h4>${escapeHtml(sheet.name)}</h4>
        <div class="report-preview-table">
          ${previewRows.map((row, rowIndex) => `
            <div class="report-preview-row ${rowIndex === 0 ? "header-row" : ""}">
              ${row.slice(0, 4).map((cell) => `<span>${escapeHtml(typeof cell === "number" ? formatMoney(cell) : cell)}</span>`).join("")}
            </div>
          `).join("")}
        </div>
        ${hiddenRows > 0 ? `<p class="muted-note">W eksporcie będzie jeszcze ${hiddenRows} kolejnych wierszy.</p>` : ""}
      </div>
    `;
  }).join("");
}

function renderReports() {
  fillReportBudgetSelect();
  renderReportCards();
  renderReportsPreview();
}

function resetReportFilters() {
  $("#reportType").value = "full";
  $("#reportBudgetFilter").value = "all";
  $("#reportDateFrom").value = "";
  $("#reportDateTo").value = "";
  renderReports();
}

function setupReportsActions() {
  ["#reportType", "#reportBudgetFilter", "#reportDateFrom", "#reportDateTo"].forEach((selector) => {
    $(selector)?.addEventListener("change", renderReports);
  });

  $("#exportCsvButton")?.addEventListener("click", exportReportCsv);
  $("#exportXlsxButton")?.addEventListener("click", exportReportXlsx);
  $("#exportPdfButton")?.addEventListener("click", exportReportPdf);
  $("#resetReportFiltersButton")?.addEventListener("click", resetReportFilters);
}

function renderImport() {
  const preview = appState.importPreview;
  const classesCount = $("#importClassesCount");
  const studentsCount = $("#importStudentsCount");
  const paymentsCount = $("#importPaymentsCount");
  const expensesCount = $("#importExpensesCount");
  const warnings = $("#importWarnings");
  const container = $("#importPreview");
  const saveButton = $("#saveImportButton");

  if (!container) return;

  if (!preview) {
    if (classesCount) classesCount.textContent = "0";
    if (studentsCount) studentsCount.textContent = "0";
    if (paymentsCount) paymentsCount.textContent = "0";
    if (expensesCount) expensesCount.textContent = "0";
    if (warnings) {
      warnings.classList.add("hidden");
      warnings.innerHTML = "";
    }
    if (saveButton) saveButton.disabled = true;
    container.innerHTML = `<div class="empty-state">Wybierz plik Excel i kliknij „Analizuj plik”.</div>`;
    return;
  }

  if (classesCount) classesCount.textContent = String(preview.classes.length);
  if (studentsCount) studentsCount.textContent = String(preview.students.length);
  if (paymentsCount) paymentsCount.textContent = String(preview.payments.length);
  if (expensesCount) expensesCount.textContent = String(preview.expenses.length);
  if (saveButton) saveButton.disabled = preview.classes.length === 0 && preview.payments.length === 0 && preview.expenses.length === 0;

  if (warnings) {
    if (preview.warnings.length > 0) {
      warnings.classList.remove("hidden");
      warnings.innerHTML = preview.warnings.map((warning) => `<div>• ${escapeHtml(warning)}</div>`).join("");
    } else {
      warnings.classList.add("hidden");
      warnings.innerHTML = "";
    }
  }

  const classRows = preview.classes.slice(0, 12).map((classItem) => {
    const students = preview.students.filter((student) => student.classId === classItem.id).length;
    const schoolPayments = preview.payments.filter((payment) => payment.classId === classItem.id && payment.budgetId === getSchoolBudgetId()).length;
    const classBudget = preview.budgets.find((budget) => budget.classId === classItem.id);
    const classPayments = classBudget ? preview.payments.filter((payment) => payment.budgetId === classBudget.id).length : 0;
    return `
      <div class="import-preview-row">
        <strong>Klasa ${escapeHtml(classItem.name)}</strong>
        <span>Uczniowie: ${students}</span>
        <span>Wpłaty RR: ${schoolPayments}</span>
        <span>Wpłaty klasowe: ${classPayments}</span>
      </div>
    `;
  }).join("");

  const schoolPayments = preview.payments.filter((payment) => payment.budgetId === getSchoolBudgetId());
  const classPayments = preview.payments.filter((payment) => payment.budgetId !== getSchoolBudgetId());
  const schoolExpenses = preview.expenses.filter((expense) => expense.budgetId === getSchoolBudgetId());
  const classExpenses = preview.expenses.filter((expense) => expense.budgetId !== getSchoolBudgetId());
  const hiddenClasses = Math.max(0, preview.classes.length - 12);

  container.innerHTML = `
    <div class="report-preview-section">
      <h4>Podsumowanie importu</h4>
      <div class="import-preview-list">
        <div class="import-preview-row">
          <strong>Plik</strong>
          <span>${escapeHtml(preview.fileName)}</span>
          <span>Rok: ${escapeHtml(getActiveSchoolYearName())}</span>
          <span>Data wpisów: ${escapeHtml(preview.importDate)}</span>
        </div>
        <div class="import-preview-row">
          <strong>Rada Rodziców</strong>
          <span>Wpłaty: ${schoolPayments.length} / ${formatMoney(sumPayments(schoolPayments))}</span>
          <span>Wydatki: ${schoolExpenses.length} / ${formatMoney(sumExpenses(schoolExpenses))}</span>
          <span>Saldo z importu: ${formatMoney(sumPayments(schoolPayments) - sumExpenses(schoolExpenses))}</span>
        </div>
        <div class="import-preview-row">
          <strong>Kasy klasowe</strong>
          <span>Wpłaty: ${classPayments.length} / ${formatMoney(sumPayments(classPayments))}</span>
          <span>Wydatki: ${classExpenses.length} / ${formatMoney(sumExpenses(classExpenses))}</span>
          <span>Saldo z importu: ${formatMoney(sumPayments(classPayments) - sumExpenses(classExpenses))}</span>
        </div>
      </div>
    </div>

    <div class="report-preview-section">
      <h4>Klasy znalezione w Excelu</h4>
      <div class="import-preview-list">
        ${classRows || `<div class="empty-state">Nie znaleziono arkuszy klasowych.</div>`}
      </div>
      ${hiddenClasses > 0 ? `<p class="muted-note">W podglądzie ukryto jeszcze ${hiddenClasses} klas.</p>` : ""}
    </div>
  `;
}

function resetImportPreview() {
  appState.importPreview = null;
  const fileInput = $("#importFile");
  if (fileInput) fileInput.value = "";
  const importDate = $("#importDate");
  if (importDate) importDate.value = getTodayDate();
  const defaultFee = $("#importDefaultFee");
  if (defaultFee && !defaultFee.value) defaultFee.value = "10";
  const clearYear = $("#importClearYear");
  if (clearYear) clearYear.checked = false;
  renderImport();
}

function readUint16LE(view, offset) {
  return view.getUint16(offset, true);
}

function readUint32LE(view, offset) {
  return view.getUint32(offset, true);
}

function decodeUtf8Bytes(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}

function findZipEndOfCentralDirectory(view) {
  const minOffset = Math.max(0, view.byteLength - 66000);
  for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
    if (readUint32LE(view, offset) === 0x06054b50) return offset;
  }
  throw new Error("Nie znaleziono końca archiwum ZIP w pliku XLSX.");
}

async function inflateZipDeflateRaw(bytes) {
  if (!("DecompressionStream" in window)) {
    throw new Error("Ta przeglądarka nie obsługuje lokalnego rozpakowania XLSX. Użyj aktualnego Chrome/Edge i uruchom aplikację przez lokalny serwer.");
  }

  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (error) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
}

async function unzipXlsxEntries(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const endOffset = findZipEndOfCentralDirectory(view);
  const entriesCount = readUint16LE(view, endOffset + 10);
  const centralDirectoryOffset = readUint32LE(view, endOffset + 16);
  const entries = new Map();
  let pointer = centralDirectoryOffset;

  for (let index = 0; index < entriesCount; index += 1) {
    if (readUint32LE(view, pointer) !== 0x02014b50) {
      throw new Error("Uszkodzona centralna tabela ZIP w pliku XLSX.");
    }

    const compressionMethod = readUint16LE(view, pointer + 10);
    const compressedSize = readUint32LE(view, pointer + 20);
    const fileNameLength = readUint16LE(view, pointer + 28);
    const extraLength = readUint16LE(view, pointer + 30);
    const commentLength = readUint16LE(view, pointer + 32);
    const localHeaderOffset = readUint32LE(view, pointer + 42);
    const fileName = decodeUtf8Bytes(bytes.slice(pointer + 46, pointer + 46 + fileNameLength));

    if (readUint32LE(view, localHeaderOffset) !== 0x04034b50) {
      throw new Error(`Uszkodzony wpis lokalny ZIP: ${fileName}.`);
    }

    const localNameLength = readUint16LE(view, localHeaderOffset + 26);
    const localExtraLength = readUint16LE(view, localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressedData = bytes.slice(dataStart, dataStart + compressedSize);
    let data;

    if (compressionMethod === 0) {
      data = compressedData;
    } else if (compressionMethod === 8) {
      data = await inflateZipDeflateRaw(compressedData);
    } else {
      throw new Error(`Nieobsługiwany typ kompresji XLSX: ${compressionMethod}.`);
    }

    entries.set(fileName.replace(/^\//, ""), data);
    pointer += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function parseXmlDocument(xmlText) {
  const parser = new DOMParser();
  const document = parser.parseFromString(xmlText, "application/xml");
  const parserError = document.querySelector("parsererror");
  if (parserError) throw new Error("Nie udało się odczytać struktury XML w pliku XLSX.");
  return document;
}

function elementsByLocalName(node, localName) {
  return [...node.getElementsByTagName("*")].filter((element) => element.localName === localName);
}

function entryText(entries, path) {
  const entry = entries.get(path.replace(/^\//, ""));
  if (!entry) return "";
  return decodeUtf8Bytes(entry);
}

function normalizeXlsxTarget(target) {
  const clean = String(target ?? "").replace(/^\//, "");
  if (clean.startsWith("xl/")) return clean;
  return `xl/${clean}`;
}

function columnNameToIndex(columnName) {
  return String(columnName ?? "").toUpperCase().split("").reduce((sum, char) => (sum * 26) + char.charCodeAt(0) - 64, 0) - 1;
}

function parseCellRef(ref) {
  const match = String(ref ?? "").match(/^([A-Z]+)(\d+)$/i);
  if (!match) return null;
  return { col: columnNameToIndex(match[1]), row: Number(match[2]) - 1 };
}

function getXlsxCellText(cell, sharedStrings) {
  const type = cell.getAttribute("t") || "";
  if (type === "inlineStr") {
    return elementsByLocalName(cell, "t").map((node) => node.textContent || "").join("");
  }

  const valueNode = elementsByLocalName(cell, "v")[0];
  const value = valueNode?.textContent ?? "";
  if (type === "s") return sharedStrings[Number(value)] ?? "";
  return value;
}

function parseXlsxWorksheet(xmlText, sharedStrings) {
  const document = parseXmlDocument(xmlText);
  const rows = [];

  for (const cell of elementsByLocalName(document, "c")) {
    const ref = parseCellRef(cell.getAttribute("r"));
    if (!ref) continue;
    const value = getXlsxCellText(cell, sharedStrings);
    if (value === "") continue;
    if (!rows[ref.row]) rows[ref.row] = [];
    rows[ref.row][ref.col] = value;
  }

  return rows;
}

async function parseXlsxWorkbook(file) {
  const entries = await unzipXlsxEntries(await file.arrayBuffer());
  const workbookXml = entryText(entries, "xl/workbook.xml");
  const relsXml = entryText(entries, "xl/_rels/workbook.xml.rels");
  if (!workbookXml || !relsXml) throw new Error("Plik XLSX nie zawiera workbook.xml.");

  const sharedStrings = [];
  const sharedStringsXml = entryText(entries, "xl/sharedStrings.xml");
  if (sharedStringsXml) {
    const sharedDocument = parseXmlDocument(sharedStringsXml);
    for (const item of elementsByLocalName(sharedDocument, "si")) {
      sharedStrings.push(elementsByLocalName(item, "t").map((node) => node.textContent || "").join(""));
    }
  }

  const relDocument = parseXmlDocument(relsXml);
  const rels = new Map();
  for (const rel of elementsByLocalName(relDocument, "Relationship")) {
    rels.set(rel.getAttribute("Id"), normalizeXlsxTarget(rel.getAttribute("Target")));
  }

  const workbookDocument = parseXmlDocument(workbookXml);
  const sheets = [];
  for (const sheet of elementsByLocalName(workbookDocument, "sheet")) {
    const relationshipId = sheet.getAttribute("r:id") || sheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id") || sheet.getAttribute("id");
    const target = rels.get(relationshipId);
    if (!target) continue;
    const sheetXml = entryText(entries, target);
    if (!sheetXml) continue;
    sheets.push({
      name: sheet.getAttribute("name") || `Arkusz ${sheets.length + 1}`,
      rows: parseXlsxWorksheet(sheetXml, sharedStrings),
    });
  }

  return { sheets };
}

function xlsxCell(rows, rowNumber, columnName) {
  const row = rows[rowNumber - 1] || [];
  const value = row[columnNameToIndex(columnName)];
  return normalizeText(value);
}

function xlsxMoney(rows, rowNumber, columnName) {
  const value = xlsxCell(rows, rowNumber, columnName);
  if (!value) return 0;
  const normalized = String(value).replace(/\s/g, "").replace(/zł|zl|pln/gi, "").replace(",", ".");
  const number = Number(normalized);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.round(number * 100) / 100;
}

function normalizeImportedName(value) {
  return stripPolishSigns(normalizeText(value)).replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

function importedNameDistance(a, b) {
  const left = normalizeImportedName(a);
  const right = normalizeImportedName(b);
  const dp = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[left.length][right.length];
}

function findImportedStudentByName(name, students) {
  const normalized = normalizeImportedName(name);
  const exact = students.find((student) => normalizeImportedName(student.fullName) === normalized);
  if (exact) return exact;

  const candidates = students
    .map((student) => ({ student, distance: importedNameDistance(name, student.fullName) }))
    .sort((a, b) => a.distance - b.distance);

  return candidates[0]?.distance <= 2 ? candidates[0].student : null;
}

function modeMoney(values, fallback = 0) {
  const counts = new Map();
  for (const value of values.filter((item) => item > 0)) {
    const key = String(Math.round(value * 100));
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.length ? Number(sorted[0][0]) / 100 : fallback;
}

function isSchoolSheet(sheet) {
  return stripPolishSigns(sheet.name).includes("rada rodzicow");
}

function looksLikeClassSheet(sheet) {
  if (isSchoolSheet(sheet)) return false;
  const header = `${xlsxCell(sheet.rows, 5, "D")} ${xlsxCell(sheet.rows, 5, "I")}`;
  const names = Array.from({ length: 70 }, (_, index) => xlsxCell(sheet.rows, index + 8, "D")).filter(Boolean);
  return /imi[eę]\s+i\s+nazwisko/i.test(header) || names.length > 0;
}

function collectSchoolFeeCandidates(classSheets) {
  const values = [];
  for (const sheet of classSheets) {
    for (let row = 8; row <= 90; row += 1) {
      const name = xlsxCell(sheet.rows, row, "D");
      const amount = xlsxMoney(sheet.rows, row, "E");
      if (name && amount > 0) values.push(amount);
    }
  }
  return values;
}

function makeImportedPayment({ budgetId, classId = null, studentId = null, amount, date, method = "import", categoryId, note = "", sourceName = "" }) {
  return {
    id: makeId("payment"),
    schoolYearId: appState.activeSchoolYearId,
    budgetId,
    classId,
    studentId,
    amount: normalizeMoney(amount),
    date,
    method,
    categoryId,
    note,
    sourceName,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function makeImportedExpense({ budgetId, classId = null, amount, date, categoryId, description = "", receiptNumber = "", seller = "", paidBy = "" }) {
  return {
    id: makeId("expense"),
    schoolYearId: appState.activeSchoolYearId,
    budgetId,
    classId,
    amount: normalizeMoney(amount),
    date,
    categoryId,
    receiptNumber,
    seller,
    paidBy,
    description,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
}

function analyzeSchoolSheetImport(sheet, preview, importDate) {
  if (!sheet) {
    preview.warnings.push("Nie znaleziono arkusza głównego Rady Rodziców. Zaimportuję tylko arkusze klasowe.");
    return;
  }

  const schoolBudgetId = getSchoolBudgetId();
  const otherPaymentCategory = getDefaultCategoryId(CATEGORY_TYPES.payment, "other");
  const donationCategory = getDefaultCategoryId(CATEGORY_TYPES.payment, "donation");
  const openingBalance = xlsxMoney(sheet.rows, 3, "E");

  if (openingBalance > 0) {
    preview.payments.push(makeImportedPayment({
      budgetId: schoolBudgetId,
      amount: openingBalance,
      date: importDate,
      method: "import",
      categoryId: otherPaymentCategory,
      note: "Saldo początkowe przeniesione z arkusza głównego Excela.",
      sourceName: "Saldo początkowe",
    }));
  }

  for (let row = 8; row <= 120; row += 1) {
    const description = xlsxCell(sheet.rows, row, "D");
    const amount = xlsxMoney(sheet.rows, row, "E");
    if (description && amount > 0) {
      const category = findReceiptCategory(description);
      preview.expenses.push(makeImportedExpense({
        budgetId: schoolBudgetId,
        amount,
        date: importDate,
        categoryId: category.categoryId,
        description,
        paidBy: "Import z Excela",
      }));
    }

    const donor = xlsxCell(sheet.rows, row, "H");
    const donorAmount = xlsxMoney(sheet.rows, row, "I");
    if (donor && donorAmount > 0) {
      preview.payments.push(makeImportedPayment({
        budgetId: schoolBudgetId,
        amount: donorAmount,
        date: importDate,
        method: "import",
        categoryId: donationCategory,
        note: `Darczyńca: ${donor}`,
        sourceName: donor,
      }));
    }
  }
}

function analyzeClassSheetImport(sheet, preview, importDate, globalSchoolFee) {
  const className = normalizeText(sheet.name);
  const classId = makeId("class");
  const schoolBudgetId = getSchoolBudgetId();
  const schoolFeeValues = [];
  const classFeeValues = [];

  for (let row = 8; row <= 90; row += 1) {
    const schoolPayment = xlsxMoney(sheet.rows, row, "E");
    const classPayment = xlsxMoney(sheet.rows, row, "J");
    if (schoolPayment > 0) schoolFeeValues.push(schoolPayment);
    if (classPayment > 0) classFeeValues.push(classPayment);
  }

  const schoolDefaultFee = modeMoney(schoolFeeValues, globalSchoolFee);
  const classDefaultFee = modeMoney(classFeeValues, schoolDefaultFee);
  const classItem = {
    id: classId,
    schoolYearId: appState.activeSchoolYearId,
    name: className,
    defaultFee: schoolDefaultFee,
    schoolDefaultFee,
    classDefaultFee,
    notes: `Import z arkusza Excel: ${className}`,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  const classBudget = createClassBudget(classItem, null);
  classBudget.defaultFee = classDefaultFee;
  preview.classes.push(classItem);
  preview.budgets.push(classBudget);

  const students = [];
  const studentByRow = new Map();

  for (let row = 8; row <= 90; row += 1) {
    const studentName = xlsxCell(sheet.rows, row, "D");
    if (!studentName) continue;

    const student = {
      id: makeId("student"),
      schoolYearId: appState.activeSchoolYearId,
      classId,
      fullName: studentName,
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    students.push(student);
    studentByRow.set(row, student);
    preview.students.push(student);
  }

  const schoolPaymentCategory = getDefaultCategoryId(CATEGORY_TYPES.payment, "committee_fee");
  const classPaymentCategory = getDefaultCategoryId(CATEGORY_TYPES.payment, "class_fee");

  for (let row = 8; row <= 90; row += 1) {
    const student = studentByRow.get(row);
    const schoolPayment = xlsxMoney(sheet.rows, row, "E");
    if (student && schoolPayment > 0) {
      preview.payments.push(makeImportedPayment({
        budgetId: schoolBudgetId,
        classId,
        studentId: student.id,
        amount: schoolPayment,
        date: importDate,
        method: "import",
        categoryId: schoolPaymentCategory,
        note: "Wpłata na Radę Rodziców z importu Excela.",
        sourceName: student.fullName,
      }));
    }

    const classPaymentName = xlsxCell(sheet.rows, row, "I");
    const classPayment = xlsxMoney(sheet.rows, row, "J");
    if (classPaymentName && classPayment > 0) {
      const classStudent = findImportedStudentByName(classPaymentName, students);
      preview.payments.push(makeImportedPayment({
        budgetId: classBudget.id,
        classId,
        studentId: classStudent?.id ?? null,
        amount: classPayment,
        date: importDate,
        method: "import",
        categoryId: classPaymentCategory,
        note: `Wpłata klasowa z importu Excela${classStudent ? "" : ` — nie dopasowano ucznia: ${classPaymentName}`}.`,
        sourceName: classPaymentName,
      }));
    }
  }

  for (let row = 8; row <= 120; row += 1) {
    const description = xlsxCell(sheet.rows, row, "N");
    const amount = xlsxMoney(sheet.rows, row, "O");
    if (description && amount > 0) {
      const category = findReceiptCategory(description);
      preview.expenses.push(makeImportedExpense({
        budgetId: classBudget.id,
        classId,
        amount,
        date: importDate,
        categoryId: category.categoryId,
        description,
        paidBy: "Import z Excela",
      }));
    }
  }
}

async function analyzeExcelImport(event) {
  event.preventDefault();

  const file = $("#importFile")?.files?.[0] ?? null;
  if (!file) {
    showToast("Najpierw wybierz plik Excel .xlsx.");
    return;
  }

  const importDate = $("#importDate")?.value || getTodayDate();
  const fallbackFee = normalizeMoney($("#importDefaultFee")?.value || 10) || 10;
  const clearYear = Boolean($("#importClearYear")?.checked);
  const workbook = await parseXlsxWorkbook(file);
  const schoolSheet = workbook.sheets.find(isSchoolSheet) ?? null;
  const classSheets = workbook.sheets.filter(looksLikeClassSheet);
  const globalSchoolFee = modeMoney(collectSchoolFeeCandidates(classSheets), fallbackFee);
  const preview = {
    fileName: file.name,
    importDate,
    clearYear,
    classes: [],
    students: [],
    budgets: [createSchoolBudget(getSchoolBudget(), appState.activeSchoolYearId)],
    payments: [],
    expenses: [],
    warnings: [],
  };

  if (classSheets.length === 0) {
    preview.warnings.push("Nie znaleziono arkuszy klasowych z listą uczniów.");
  }

  if (!clearYear && (appState.classes.length > 0 || appState.payments.length > 0 || appState.expenses.length > 0)) {
    preview.warnings.push("Aktywny rok szkolny ma już dane. Import dopisze nowe pozycje i może utworzyć duplikaty. Zaznacz czyszczenie roku, jeżeli chcesz importować od zera.");
  }

  analyzeSchoolSheetImport(schoolSheet, preview, importDate);
  for (const sheet of classSheets) {
    analyzeClassSheetImport(sheet, preview, importDate, globalSchoolFee);
  }

  const unmatchedClassPayments = preview.payments.filter((payment) => payment.budgetId !== getSchoolBudgetId() && !payment.studentId).length;
  if (unmatchedClassPayments > 0) {
    preview.warnings.push(`Nie dopasowano ${unmatchedClassPayments} wpłat klasowych do uczniów. Zostaną zapisane przy klasie z notatką.`);
  }

  appState.importPreview = preview;
  renderImport();
  showToast("Plik Excel został przeanalizowany. Sprawdź podgląd przed importem.");
}

async function clearActiveSchoolYearDataForImport() {
  const stores = [RR_STORES.classes, RR_STORES.students, RR_STORES.budgets, RR_STORES.payments, RR_STORES.expenses];
  for (const store of stores) {
    const records = await RRDatabase.getAll(store);
    const activeRecords = records.filter((record) => record.schoolYearId === appState.activeSchoolYearId);
    for (const record of activeRecords) {
      await RRDatabase.remove(store, record.id);
    }
  }
}

async function saveExcelImport() {
  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może importować arkusze.")) return;

  const preview = appState.importPreview;
  if (!preview) {
    showToast("Najpierw przeanalizuj plik Excel.");
    return;
  }

  if (preview.clearYear) {
    const confirmed = window.confirm(`Wyczyścić dane roku ${getActiveSchoolYearName()} i zaimportować arkusz od nowa?`);
    if (!confirmed) return;
    await clearActiveSchoolYearDataForImport();
  }

  for (const classItem of preview.classes) await RRDatabase.put(RR_STORES.classes, classItem);
  for (const budget of preview.budgets) await RRDatabase.put(RR_STORES.budgets, budget);
  for (const student of preview.students) await RRDatabase.put(RR_STORES.students, student);
  for (const payment of preview.payments) await RRDatabase.put(RR_STORES.payments, payment);
  for (const expense of preview.expenses) await RRDatabase.put(RR_STORES.expenses, expense);

  appState.importPreview = null;
  await loadData();
  renderAll();
  showToast("Import z Excela został zapisany w aplikacji.");
}

function setupImportActions() {
  const importDate = $("#importDate");
  if (importDate && !importDate.value) importDate.value = getTodayDate();

  $("#importForm")?.addEventListener("submit", (event) => {
    analyzeExcelImport(event).catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się przeanalizować pliku Excel.");
    });
  });

  $("#saveImportButton")?.addEventListener("click", () => {
    saveExcelImport().catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać importu.");
    });
  });

  $("#resetImportButton")?.addEventListener("click", resetImportPreview);
}


function getDefaultFirebaseSyncSettings() {
  return {
    configText: DEFAULT_FIREBASE_CONFIG_TEXT,
    workspaceId: DEFAULT_FIREBASE_WORKSPACE_ID,
    lastSyncAt: null,
    lastSyncDirection: null,
    source: "built-in",
  };
}

function loadFirebaseSyncSettings() {
  try {
    const raw = localStorage.getItem(FIREBASE_SYNC_STORAGE_KEY);
    if (!raw) return getDefaultFirebaseSyncSettings();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return getDefaultFirebaseSyncSettings();
    return {
      configText: String(parsed.configText ?? DEFAULT_FIREBASE_CONFIG_TEXT),
      workspaceId: sanitizeWorkspaceId(parsed.workspaceId || DEFAULT_FIREBASE_WORKSPACE_ID),
      lastSyncAt: parsed.lastSyncAt || null,
      lastSyncDirection: parsed.lastSyncDirection || null,
      source: "local",
    };
  } catch (error) {
    console.warn("Nie udało się odczytać konfiguracji Firebase:", error);
    return getDefaultFirebaseSyncSettings();
  }
}

function saveFirebaseSyncSettings(settings) {
  const normalized = {
    configText: String(settings.configText ?? DEFAULT_FIREBASE_CONFIG_TEXT).trim(),
    workspaceId: sanitizeWorkspaceId(settings.workspaceId || DEFAULT_FIREBASE_WORKSPACE_ID),
    lastSyncAt: settings.lastSyncAt || null,
    lastSyncDirection: settings.lastSyncDirection || null,
    source: "local",
  };
  localStorage.setItem(FIREBASE_SYNC_STORAGE_KEY, JSON.stringify(normalized));
  appState.firebaseSync.settings = normalized;
  return normalized;
}

function clearFirebaseSyncSettings() {
  localStorage.removeItem(FIREBASE_SYNC_STORAGE_KEY);
  appState.firebaseSync.settings = getDefaultFirebaseSyncSettings();
  appState.firebaseSync.runtime = null;
  appState.firebaseSync.lastSnapshot = null;
  if (appState.auth.unsubscribe) appState.auth.unsubscribe();
  appState.auth.unsubscribe = null;
  appState.auth.user = null;
  appState.auth.role = null;
  appState.auth.isReady = true;
}

function sanitizeWorkspaceId(value) {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 80);
  return cleaned || "eskarbnik";
}

function parseFirebaseConfig(rawText) {
  const text = String(rawText ?? "").trim();
  if (!text) throw new Error("Wklej konfigurację Firebase z aplikacji webowej.");

  const keys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
  const config = {};

  for (const key of keys) {
    const pattern = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`);
    const match = text.match(pattern);
    if (match) config[key] = match[1];
  }

  const required = ["apiKey", "authDomain", "projectId", "appId"];
  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(`Brakuje pól w konfiguracji Firebase: ${missing.join(", ")}.`);
  }

  return config;
}

async function getFirebaseRuntime() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw zapisz konfigurację Firebase.");

  const config = parseFirebaseConfig(settings.configText);
  const runtimeKey = `${config.projectId}::${settings.workspaceId}`;

  if (appState.firebaseSync.runtime?.runtimeKey === runtimeKey) {
    return appState.firebaseSync.runtime;
  }

  const appModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`;
  const firestoreModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`;
  const authModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-auth.js`;
  const [appModule, firestoreModule, authModule] = await Promise.all([
    import(appModuleUrl),
    import(firestoreModuleUrl),
    import(authModuleUrl),
  ]);

  const appName = `rr-sync-${config.projectId}`;
  const existingApp = appModule.getApps().find((item) => item.name === appName);
  const firebaseApp = existingApp || appModule.initializeApp(config, appName);
  const firestore = firestoreModule.getFirestore(firebaseApp);
  const auth = authModule.getAuth(firebaseApp);

  appState.firebaseSync.runtime = {
    runtimeKey,
    config,
    firebaseApp,
    firestore,
    auth,
    doc: firestoreModule.doc,
    collection: firestoreModule.collection,
    getDoc: firestoreModule.getDoc,
    getDocs: firestoreModule.getDocs,
    setDoc: firestoreModule.setDoc,
    deleteDoc: firestoreModule.deleteDoc,
    serverTimestamp: firestoreModule.serverTimestamp,
    onAuthStateChanged: authModule.onAuthStateChanged,
    signInWithEmailAndPassword: authModule.signInWithEmailAndPassword,
    createUserWithEmailAndPassword: authModule.createUserWithEmailAndPassword,
    GoogleAuthProvider: authModule.GoogleAuthProvider,
    signInWithPopup: authModule.signInWithPopup,
    signInWithRedirect: authModule.signInWithRedirect,
    getRedirectResult: authModule.getRedirectResult,
    signOut: authModule.signOut,
  };

  return appState.firebaseSync.runtime;
}

function getFirebaseSnapshotRef(runtime, workspaceId) {
  return runtime.doc(
    runtime.firestore,
    FIREBASE_SYNC_COLLECTION,
    workspaceId,
    "snapshots",
    FIREBASE_SYNC_SNAPSHOT_ID,
  );
}

function getFirebaseClassSnapshotRef(runtime, workspaceId, classId) {
  return runtime.doc(
    runtime.firestore,
    FIREBASE_SYNC_COLLECTION,
    workspaceId,
    "classSnapshots",
    classId,
  );
}

function getFirebaseRoleRef(runtime, workspaceId, uid) {
  return runtime.doc(
    runtime.firestore,
    FIREBASE_SYNC_COLLECTION,
    workspaceId,
    FIREBASE_ROLES_COLLECTION,
    uid,
  );
}

function normalizeRoleDoc(roleDoc = {}) {
  const role = Object.values(USER_ROLES).includes(roleDoc.role) && roleDoc.role !== USER_ROLES.localAdmin
    ? roleDoc.role
    : USER_ROLES.pending;
  const classIds = Array.isArray(roleDoc.classIds) ? roleDoc.classIds.filter(Boolean) : [];

  return {
    role,
    classIds,
    email: normalizeText(roleDoc.email),
    displayName: normalizeText(roleDoc.displayName),
    createdAt: roleDoc.createdAt || null,
    updatedAt: roleDoc.updatedAt || null,
  };
}

async function loadCurrentUserRole() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  const user = appState.auth.user;
  if (!settings || !user) {
    appState.auth.role = settings ? null : { role: USER_ROLES.localAdmin, classIds: [] };
    return appState.auth.role;
  }

  const runtime = await getFirebaseRuntime();
  const ref = getFirebaseRoleRef(runtime, settings.workspaceId, user.uid);
  const snapshot = await runtime.getDoc(ref);

  appState.auth.role = snapshot.exists()
    ? normalizeRoleDoc(snapshot.data())
    : { role: USER_ROLES.pending, classIds: [], email: user.email || "" };

  return appState.auth.role;
}

async function initializeAuthListenerIfPossible() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  appState.firebaseSync.settings = settings;

  if (!settings) {
    appState.auth.user = null;
    appState.auth.role = { role: USER_ROLES.localAdmin, classIds: [] };
    appState.auth.isReady = true;
    return;
  }

  const runtime = await getFirebaseRuntime();
  try {
    await runtime.getRedirectResult(runtime.auth);
  } catch (error) {
    const friendly = getFriendlyFirebaseAuthError(error);
    console.warn("Nie udało się dokończyć logowania Google po przekierowaniu:", error);
    setAuthHelp(friendly, "error");
  }

  if (appState.auth.unsubscribe) appState.auth.unsubscribe();

  appState.auth.unsubscribe = runtime.onAuthStateChanged(runtime.auth, async (user) => {
    appState.auth.user = user;
    appState.auth.isReady = true;
    try {
      await loadCurrentUserRole();
    } catch (error) {
      console.warn("Nie udało się odczytać roli użytkownika:", error);
      appState.auth.role = { role: USER_ROLES.pending, classIds: [], email: user?.email || "" };
    }
    renderAuthStatus();
    applyPermissionState();
  });
}

function validateFirebaseUid(uid) {
  if (!uid) throw new Error("Wpisz UID użytkownika.");
  if ([".", ".."].includes(uid) || uid.includes("/")) {
    throw new Error("UID użytkownika to identyfikator z pola Status → UID po zalogowaniu, a nie e-mail, nazwa pliku ani ścieżka. Nie może zawierać znaku /.");
  }
  if (uid.length < 10) {
    throw new Error("UID wygląda za krótko. Skopiuj pełny UID z pola Status użytkownika po zalogowaniu.");
  }
}

function getRolePayloadFromForm() {
  const uid = normalizeText($("#roleUid")?.value);
  const email = normalizeText($("#roleEmail")?.value);
  const role = $("#roleType")?.value || USER_ROLES.viewer;
  const classIds = $all("#roleClassList input[type='checkbox']:checked").map((item) => item.value);

  validateFirebaseUid(uid);
  if (!Object.values(USER_ROLES).includes(role) || [USER_ROLES.pending, USER_ROLES.localAdmin].includes(role)) {
    throw new Error("Wybierz prawidłową główną rolę użytkownika.");
  }
  if (role === USER_ROLES.classTreasurer && classIds.length === 0) {
    throw new Error("Skarbnik klasy musi mieć przypisaną przynajmniej jedną klasę prywatną.");
  }

  return { uid, email, role, classIds: [USER_ROLES.classTreasurer, USER_ROLES.schoolTreasurer, USER_ROLES.legacyAdmin, USER_ROLES.viewer].includes(role) ? classIds : [] };
}


function getFriendlyFirebaseAuthError(error) {
  const code = error?.code || "";
  const message = error?.message || "";

  const mapped = {
    "auth/configuration-not-found": "Firebase Authentication nie jest włączone dla tego projektu albo konfiguracja Firebase jest z innego projektu. W Firebase Console włącz Authentication, a potem dostawcę Email/Password i/lub Google. Następnie w zakładce Synchronizacja wklej ponownie config aplikacji webowej tego samego projektu.",
    "auth/operation-not-allowed": "Ten sposób logowania nie jest włączony w Firebase Authentication. W Firebase Console włącz Authentication → Sign-in method → Email/Password albo Google.",
    "auth/unauthorized-domain": "Ta domena nie jest dopuszczona w Firebase Authentication. W Firebase Console dodaj domenę aplikacji w Authentication → Settings → Authorized domains.",
    "auth/popup-blocked": "Przeglądarka zablokowała okno logowania Google. Zezwól na wyskakujące okna dla tej strony albo użyj logowania e-mail/hasło.",
    "auth/popup-closed-by-user": "Zamknięto okno logowania Google przed zakończeniem.",
    "auth/cancelled-popup-request": "Anulowano poprzednie okno logowania Google. Spróbuj jeszcze raz.",
    "auth/account-exists-with-different-credential": "Konto z tym e-mailem istnieje już w innym sposobie logowania. Zaloguj się metodą używaną wcześniej.",
    "auth/invalid-api-key": "Nieprawidłowy apiKey w konfiguracji Firebase. Wklej pełny config aplikacji webowej z Firebase Console.",
    "auth/invalid-email": "Nieprawidłowy adres e-mail. Wpisz adres typu nazwa@domena.pl, nie nazwę pliku ani ścieżkę.",
    "auth/email-already-in-use": "Takie konto już istnieje. Użyj przycisku Zaloguj zamiast tworzyć nowe konto.",
    "auth/weak-password": "Hasło jest za słabe. Użyj minimum 6 znaków.",
    "auth/invalid-credential": "Nieprawidłowy e-mail albo hasło, albo konto nie istnieje w Firebase Authentication.",
    "auth/user-not-found": "Nie znaleziono takiego konta w Firebase Authentication. Najpierw utwórz konto albo sprawdź e-mail.",
    "auth/wrong-password": "Nieprawidłowe hasło.",
    "auth/network-request-failed": "Brak połączenia z Firebase. Sprawdź internet i konfigurację projektu.",
  };

  return mapped[code] || message || "Nie udało się wykonać operacji Firebase Authentication.";
}

function isValidEmailAddress(email) {
  return /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(String(email || "").trim());
}

function getLoginPasswordValues() {
  return {
    password: String($("#loginPassword")?.value || ""),
    passwordConfirm: String($("#loginPasswordConfirm")?.value || ""),
  };
}

function isSmallTouchDevice() {
  return window.matchMedia("(max-width: 780px)").matches
    || window.matchMedia("(pointer: coarse)").matches
    || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function setAuthHelp(message, mode = "info") {
  const box = $("#authHelpBox");
  if (!box) return;
  box.textContent = message;
  box.className = mode === "error" ? "warning-box" : "info-box";
}

function getFirebaseAuthSetupHint() {
  return "Kolejność: Firebase Console → Authentication → Get started → Sign-in method → włącz Email/Password i Google. W Authorized domains dopisz domenę hostingu. Config projektu eskarbnik-fa364 jest już wpisany w kod aplikacji; w zakładce Synchronizacja możesz go tylko nadpisać, jeśli zmienisz projekt.";
}

async function signInUser(event) {
  event?.preventDefault();
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw skonfiguruj Firebase w zakładce Synchronizacja.");

  const email = normalizeText($("#loginEmail")?.value);
  const password = String($("#loginPassword")?.value || "");
  if (!email || !password) throw new Error("Wpisz e-mail i hasło.");
  if (!isValidEmailAddress(email)) throw new Error("W polu E-mail wpisz prawdziwy adres e-mail, np. skarbnik@szkola.pl. Nie wpisuj nazwy pliku ani ścieżki.");

  const runtime = await getFirebaseRuntime();
  try {
    await runtime.signInWithEmailAndPassword(runtime.auth, email, password);
  } catch (error) {
    throw new Error(getFriendlyFirebaseAuthError(error));
  }
  setAuthHelp("Zalogowano. Teraz skopiuj swój UID ze statusu albo użyj przycisku „Wstaw mój UID” przy nadawaniu roli.");
  showToast("Zalogowano.");
}

async function createAuthAccount(event) {
  event?.preventDefault();
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw skonfiguruj Firebase w zakładce Synchronizacja.");

  const email = normalizeText($("#loginEmail")?.value);
  const { password, passwordConfirm } = getLoginPasswordValues();
  if (!email || password.length < 6) throw new Error("Wpisz e-mail i hasło o długości minimum 6 znaków.");
  if (!passwordConfirm) throw new Error("Powtórz hasło w drugim polu.");
  if (password !== passwordConfirm) throw new Error("Hasła nie są identyczne. Popraw pole „Powtórz hasło”.");
  if (!isValidEmailAddress(email)) throw new Error("W polu E-mail wpisz prawdziwy adres e-mail, np. skarbnik@szkola.pl. Nie wpisuj nazwy pliku ani ścieżki.");

  const runtime = await getFirebaseRuntime();
  try {
    await runtime.createUserWithEmailAndPassword(runtime.auth, email, password);
  } catch (error) {
    throw new Error(getFriendlyFirebaseAuthError(error));
  }
  setAuthHelp("Konto e-mail/hasło zostało utworzone. Pierwszy użytkownik powinien kliknąć „Ustaw bieżące konto jako skarbnika Rady”. Kolejne role nadaje skarbnik Rady.");
  showToast("Konto zostało utworzone. Teraz nadaj mu rolę skarbnika Rady albo poproś skarbnika Rady o rolę.");
}

async function signInWithGoogleUser() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw skonfiguruj Firebase w zakładce Synchronizacja.");

  const runtime = await getFirebaseRuntime();
  const provider = new runtime.GoogleAuthProvider();
  provider.addScope("email");
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    if (isSmallTouchDevice()) {
      setAuthHelp("Za chwilę nastąpi przekierowanie do Google. Po powrocie aplikacja dokończy logowanie automatycznie.");
      await runtime.signInWithRedirect(runtime.auth, provider);
      return;
    }

    await runtime.signInWithPopup(runtime.auth, provider);
  } catch (error) {
    const code = error?.code || "";
    if (["auth/popup-blocked", "auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(code)) {
      setAuthHelp("Okno Google nie zostało poprawnie otwarte. Przełączam na logowanie przez przekierowanie.");
      await runtime.signInWithRedirect(runtime.auth, provider);
      return;
    }
    throw new Error(getFriendlyFirebaseAuthError(error));
  }

  setAuthHelp("Zalogowano przez Google. Jeżeli to pierwsze konto, kliknij „Ustaw bieżące konto jako skarbnika Rady”. Google tworzy użytkownika automatycznie przy pierwszym logowaniu.");
  showToast("Zalogowano przez Google.");
}

async function signOutUser() {
  const runtime = await getFirebaseRuntime();
  await runtime.signOut(runtime.auth);
  appState.auth.role = null;
  showToast("Wylogowano.");
}

async function saveUserRole() {
  if (!requirePermission(canManageUsers(), "Tylko skarbnik Rady Rodziców może nadawać role.")) return;
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw skonfiguruj Firebase.");

  const payload = getRolePayloadFromForm();
  const runtime = await getFirebaseRuntime();
  await runtime.setDoc(getFirebaseRoleRef(runtime, settings.workspaceId, payload.uid), {
    role: payload.role,
    email: payload.email,
    classIds: payload.classIds,
    updatedAt: nowIso(),
    updatedBy: appState.auth.user?.uid || "local",
  }, { merge: true });

  if (appState.auth.user?.uid === payload.uid) await loadCurrentUserRole();
  resetRoleForm();
  await renderUsersPanel();
  renderAuthStatus();
  applyPermissionState();
  const roleLabel = ROLE_LABELS[payload.role] || payload.role;
  const classPart = payload.classIds.length ? ` + dostęp do klas: ${getRoleClassLabel(payload.classIds)}` : "";
  showToast(`Uprawnienia zapisane: ${roleLabel}${classPart}.`);
}

async function setCurrentUserAsFirstAdmin() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw skonfiguruj Firebase.");
  if (!appState.auth.user) throw new Error("Najpierw się zaloguj.");

  const confirmed = window.confirm("Ustawić bieżące konto jako skarbnika Rady Rodziców tego obszaru synchronizacji? Używaj tego tylko przy pierwszej konfiguracji aplikacji. Jeżeli jesteś też skarbnikiem klasy, po nadaniu roli edytuj swoje konto i zaznacz odpowiednią klasę prywatną.");
  if (!confirmed) return;

  const runtime = await getFirebaseRuntime();
  await runtime.setDoc(getFirebaseRoleRef(runtime, settings.workspaceId, appState.auth.user.uid), {
    role: USER_ROLES.schoolTreasurer,
    email: appState.auth.user.email || "",
    classIds: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    updatedBy: appState.auth.user.uid,
  }, { merge: true });

  await loadCurrentUserRole();
  await renderUsersPanel();
  renderAuthStatus();
  applyPermissionState();
  showToast("Bieżące konto ma rolę skarbnika Rady Rodziców. Jeżeli prowadzisz też klasę, edytuj swoje konto i zaznacz klasę prywatną.");
}

async function removeUserRole() {
  if (!requirePermission(canManageUsers(), "Tylko skarbnik Rady Rodziców może usuwać role.")) return;
  const uid = normalizeText($("#roleUid")?.value);
  if (!uid) throw new Error("Wpisz UID użytkownika, którego rolę chcesz usunąć.");
  const confirmed = window.confirm("Usunąć rolę tego użytkownika? Bez roli nie będzie mógł pracować w aplikacji Firebase.");
  if (!confirmed) return;

  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  const runtime = await getFirebaseRuntime();
  await runtime.deleteDoc(getFirebaseRoleRef(runtime, settings.workspaceId, uid));

  if (appState.auth.user?.uid === uid) await loadCurrentUserRole();
  resetRoleForm();
  await renderUsersPanel();
  renderAuthStatus();
  applyPermissionState();
  showToast("Rola została usunięta.");
}

async function getAllUserRoles() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) return [];
  const runtime = await getFirebaseRuntime();
  const rolesCollection = runtime.collection(
    runtime.firestore,
    FIREBASE_SYNC_COLLECTION,
    settings.workspaceId,
    FIREBASE_ROLES_COLLECTION,
  );
  const snapshot = await runtime.getDocs(rolesCollection);
  return snapshot.docs
    .map((doc) => ({ uid: doc.id, ...normalizeRoleDoc(doc.data()) }))
    .sort((a, b) => compareByName(a, b, "email"));
}

function resetRoleForm() {
  if (!$("#roleUid")) return;
  $("#roleUid").value = "";
  $("#roleEmail").value = "";
  $("#roleType").value = USER_ROLES.viewer;
  $all("#roleClassList input[type='checkbox']").forEach((item) => { item.checked = false; });
}

function fillRoleClassList() {
  const box = $("#roleClassList");
  if (!box) return;
  if (appState.classes.length === 0) {
    box.innerHTML = `<div class="empty-state small-empty">Brak klas w aktywnym roku szkolnym.</div>`;
    return;
  }
  box.innerHTML = [...appState.classes]
    .sort((a, b) => compareByName(a, b, "name"))
    .map((classItem) => `
      <label class="checkbox-line compact-checkbox">
        <input type="checkbox" value="${escapeHtml(classItem.id)}">
        <span>${escapeHtml(classItem.name)}</span>
      </label>
    `).join("");
}

async function renderUsersPanel() {
  fillRoleClassList();

  const loginStatus = $("#loginStatusText");
  const roleStatus = $("#roleStatusText");
  const currentUid = $("#currentUserUid");
  const currentEmail = $("#currentUserEmail");
  const currentRole = $("#currentUserRole");
  const roleList = $("#userRolesList");

  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  const user = appState.auth.user;

  if (loginStatus) {
    loginStatus.textContent = settings ? (user ? "Zalogowano" : "Brak logowania") : "Tryb lokalny";
    loginStatus.className = user || !settings ? "status-pill status-ok" : "status-pill status-muted";
  }

  if (roleStatus) {
    roleStatus.textContent = getCurrentRoleLabel();
    roleStatus.className = canViewApp() ? "status-pill status-ok" : "status-pill status-offline";
  }

  if (currentUid) currentUid.textContent = user?.uid || "brak";
  if (currentEmail) currentEmail.textContent = user?.email || (settings ? "niezalogowany" : "tryb lokalny");
  if (currentRole) currentRole.textContent = `${getCurrentRoleLabel()}${getAssignedClassIds().length ? ` — prywatne klasy: ${getRoleClassLabel(getAssignedClassIds())}` : ""}`;

  if (!roleList) return;

  if (!settings) {
    roleList.innerHTML = `<div class="empty-state">Role działają po skonfigurowaniu Firebase i zalogowaniu użytkowników.</div>`;
    return;
  }

  if (!canManageUsers()) {
    roleList.innerHTML = `<div class="empty-state">Listę ról widzi tylko skarbnik Rady Rodziców.</div>`;
    return;
  }

  try {
    const roles = await getAllUserRoles();
    roleList.innerHTML = roles.length === 0
      ? `<div class="empty-state">Brak zapisanych ról. Ustaw pierwszego skarbnika Rady Rodziców.</div>`
      : roles.map((roleItem) => `
        <div class="entity-row user-role-row" data-role-uid="${escapeHtml(roleItem.uid)}">
          <div>
            <div class="entity-title">${escapeHtml(roleItem.email || roleItem.uid)}</div>
            <div class="entity-meta">
              <span>Rola: ${escapeHtml(ROLE_LABELS[roleItem.role] || roleItem.role)}</span>
              <span>UID: ${escapeHtml(roleItem.uid)}</span>
              ${[USER_ROLES.classTreasurer, USER_ROLES.schoolTreasurer, USER_ROLES.viewer, USER_ROLES.legacyAdmin].includes(roleItem.role) && roleItem.classIds?.length ? `<span>Klasy prywatne: ${escapeHtml(getRoleClassLabel(roleItem.classIds))}</span>` : ""}
            </div>
          </div>
          <div class="entity-actions">
            <button class="small-button" data-action="edit-role" type="button">Edytuj</button>
          </div>
        </div>
      `).join("");
  } catch (error) {
    console.warn(error);
    roleList.innerHTML = `<div class="empty-state">Nie udało się odczytać listy ról. Sprawdź Firebase i uprawnienia.</div>`;
  }
}

function renderAuthStatus() {
  const authStatus = $("#authStatus");
  if (authStatus) {
    const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
    if (!settings) {
      authStatus.textContent = "Tryb lokalny";
      authStatus.className = "status-pill status-ok";
    } else if (!appState.auth.user) {
      authStatus.textContent = "Niezalogowany";
      authStatus.className = "status-pill status-offline";
    } else {
      authStatus.textContent = getCurrentRoleLabel();
      authStatus.className = canViewApp() ? "status-pill status-ok" : "status-pill status-offline";
    }
  }

  renderUsersPanel();
}

function applyPermissionState() {
  const isLoggedOrLocal = !isFirebaseConfigured() || Boolean(appState.auth.user);
  const canGlobal = canManageGlobalData();
  const canUsers = canManageUsers();
  const canAnyBudget = getAccessibleBudgetsForWrite().length > 0;

  $all("[data-permission='global-write']").forEach((button) => { button.disabled = !canGlobal; });
  $all("[data-permission='user-admin']").forEach((button) => { button.disabled = !canUsers; });
  $all("[data-permission='budget-write']").forEach((button) => { button.disabled = !canAnyBudget; });
  $all("[data-sync-action]").forEach((button) => {
    button.disabled = appState.firebaseSync.isBusy || (button.dataset.permission === "global-write" && !canManageSync());
  });
  $all("[data-auth-required]").forEach((item) => { item.classList.toggle("disabled-panel", !isLoggedOrLocal); });

  const warning = $("#permissionWarning");
  if (warning) {
    warning.classList.toggle("hidden", canViewApp());
  }
}

function fillCurrentUserIntoRoleForm() {
  if (!appState.auth.user) {
    showToast("Najpierw zaloguj konto, którego UID chcesz wstawić.");
    return;
  }
  const uidInput = $("#roleUid");
  const emailInput = $("#roleEmail");
  if (uidInput) uidInput.value = appState.auth.user.uid;
  if (emailInput && !emailInput.value) emailInput.value = appState.auth.user.email || "";
  showToast("Wstawiono UID aktualnie zalogowanego użytkownika.");
}

function setupAuthActions() {
  $("#loginForm")?.addEventListener("submit", (event) => {
    signInUser(event).catch((error) => {
      console.error(error);
      setAuthHelp(error.message || "Nie udało się zalogować.", "error");
      showToast(error.message || "Nie udało się zalogować.");
    });
  });

  $("#createAccountButton")?.addEventListener("click", () => {
    createAuthAccount().catch((error) => {
      console.error(error);
      setAuthHelp(error.message || "Nie udało się utworzyć konta.", "error");
      showToast(error.message || "Nie udało się utworzyć konta.");
    });
  });

  $("#googleLoginButton")?.addEventListener("click", () => {
    signInWithGoogleUser().catch((error) => {
      console.error(error);
      setAuthHelp(error.message || "Nie udało się zalogować przez Google.", "error");
      showToast(error.message || "Nie udało się zalogować przez Google.");
    });
  });

  $("#showAuthSetupButton")?.addEventListener("click", () => {
    setAuthHelp(getFirebaseAuthSetupHint());
  });

  $("#logoutButton")?.addEventListener("click", () => {
    signOutUser().catch((error) => {
      console.error(error);
      showToast("Nie udało się wylogować.");
    });
  });

  $("#setFirstAdminButton")?.addEventListener("click", () => {
    setCurrentUserAsFirstAdmin().catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się ustawić skarbnika Rady Rodziców.");
    });
  });

  $("#saveRoleButton")?.addEventListener("click", () => {
    saveUserRole().catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się zapisać roli.");
    });
  });

  $("#deleteRoleButton")?.addEventListener("click", () => {
    removeUserRole().catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się usunąć roli.");
    });
  });

  $("#resetRoleFormButton")?.addEventListener("click", resetRoleForm);
  $("#fillCurrentUidButton")?.addEventListener("click", fillCurrentUserIntoRoleForm);

  $("#userRolesList")?.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    const row = event.target.closest("[data-role-uid]");
    if (!button || !row) return;
    if (button.dataset.action !== "edit-role") return;

    const roles = await getAllUserRoles();
    const roleItem = roles.find((item) => item.uid === row.dataset.roleUid);
    if (!roleItem) return;
    $("#roleUid").value = roleItem.uid;
    $("#roleEmail").value = roleItem.email || "";
    $("#roleType").value = roleItem.role;
    $all("#roleClassList input[type='checkbox']").forEach((item) => {
      item.checked = roleItem.classIds.includes(item.value);
    });
  });
}

async function exportLocalSnapshot() {
  const stores = {};

  for (const storeName of SYNC_STORE_NAMES) {
    stores[storeName] = await RRDatabase.getAll(storeName);
  }

  return {
    appName: "eSkarbnik",
    appVersion: APP_VERSION,
    schemaVersion: 15,
    exportedAt: nowIso(),
    activeSchoolYearId: appState.activeSchoolYearId,
    stores,
  };
}

function makeEmptySnapshot() {
  const stores = {};
  for (const storeName of SYNC_STORE_NAMES) stores[storeName] = [];
  return {
    appName: "eSkarbnik",
    appVersion: APP_VERSION,
    schemaVersion: 15,
    exportedAt: nowIso(),
    activeSchoolYearId: appState.activeSchoolYearId,
    stores,
  };
}

async function exportSchoolCouncilSnapshot() {
  const source = await exportLocalSnapshot();
  const schoolBudgetIds = new Set((source.stores.budgets || [])
    .filter((budget) => budget.type === BUDGET_TYPES.school)
    .map((budget) => budget.id));

  return {
    ...source,
    schemaVersion: 15,
    privacyScope: "schoolCouncil",
    stores: {
      schoolYears: source.stores.schoolYears || [],
      classes: source.stores.classes || [],
      students: source.stores.students || [],
      budgets: (source.stores.budgets || []).filter((budget) => schoolBudgetIds.has(budget.id)),
      payments: (source.stores.payments || []).filter((payment) => schoolBudgetIds.has(payment.budgetId)),
      expenses: (source.stores.expenses || []).filter((expense) => schoolBudgetIds.has(expense.budgetId)),
      categories: source.stores.categories || [],
    },
  };
}

async function exportClassPrivateSnapshot(classId) {
  const source = await exportLocalSnapshot();
  const classBudgetIds = new Set((source.stores.budgets || [])
    .filter((budget) => budget.type === BUDGET_TYPES.class && budget.classId === classId)
    .map((budget) => budget.id));

  return {
    ...source,
    schemaVersion: 15,
    privacyScope: "classPrivate",
    classId,
    stores: {
      schoolYears: source.stores.schoolYears || [],
      classes: (source.stores.classes || []).filter((classItem) => classItem.id === classId),
      students: (source.stores.students || []).filter((student) => student.classId === classId),
      budgets: (source.stores.budgets || []).filter((budget) => classBudgetIds.has(budget.id)),
      payments: (source.stores.payments || []).filter((payment) => classBudgetIds.has(payment.budgetId) || payment.classId === classId),
      expenses: (source.stores.expenses || []).filter((expense) => classBudgetIds.has(expense.budgetId) || expense.classId === classId),
      categories: source.stores.categories || [],
    },
  };
}

function getSyncClassIdsForCurrentUser() {
  if (isLocalAdminRole()) return appState.classes.map((classItem) => classItem.id);
  return getAssignedClassIds().filter((classId) => appState.classes.some((classItem) => classItem.id === classId));
}

async function readAccessibleFirebaseSnapshots(runtime, workspaceId) {
  const snapshots = [];

  if (isSchoolTreasurerRole() || isLocalAdminRole()) {
    const schoolDoc = await runtime.getDoc(getFirebaseSnapshotRef(runtime, workspaceId));
    if (schoolDoc.exists()) snapshots.push(schoolDoc.data());
  }

  for (const classId of getSyncClassIdsForCurrentUser()) {
    const classDoc = await runtime.getDoc(getFirebaseClassSnapshotRef(runtime, workspaceId, classId));
    if (classDoc.exists()) snapshots.push(classDoc.data());
  }

  return snapshots;
}

function mergeManySnapshots(snapshots) {
  let merged = makeEmptySnapshot();
  for (const snapshot of snapshots) {
    if (!isValidSyncSnapshot(snapshot)) continue;
    merged = mergeSnapshots(merged, snapshot);
  }
  return merged;
}

function isValidSyncSnapshot(snapshot) {
  return Boolean(
    snapshot
    && typeof snapshot === "object"
    && snapshot.stores
    && typeof snapshot.stores === "object"
  );
}

function getRecordTime(record) {
  const value = record?.updatedAt || record?.createdAt || record?.date || "1970-01-01T00:00:00.000Z";
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function mergeStoreRecords(localRecords = [], cloudRecords = []) {
  const map = new Map();

  for (const record of cloudRecords) {
    if (!record?.id) continue;
    map.set(record.id, record);
  }

  for (const record of localRecords) {
    if (!record?.id) continue;
    const existing = map.get(record.id);
    if (!existing || getRecordTime(record) >= getRecordTime(existing)) {
      map.set(record.id, record);
    }
  }

  return [...map.values()];
}

function mergeSnapshots(localSnapshot, cloudSnapshot) {
  const stores = {};

  for (const storeName of SYNC_STORE_NAMES) {
    stores[storeName] = mergeStoreRecords(
      localSnapshot.stores?.[storeName] || [],
      cloudSnapshot.stores?.[storeName] || [],
    );
  }

  return {
    appName: "eSkarbnik",
    appVersion: APP_VERSION,
    schemaVersion: 15,
    exportedAt: nowIso(),
    activeSchoolYearId: localSnapshot.activeSchoolYearId || cloudSnapshot.activeSchoolYearId || null,
    stores,
  };
}

async function replaceLocalDataFromSnapshot(snapshot) {
  if (!isValidSyncSnapshot(snapshot)) {
    throw new Error("Pobrany zapis z Firebase ma nieprawidłowy format.");
  }

  await RRDatabase.clearAll();

  for (const storeName of SYNC_STORE_NAMES) {
    const records = Array.isArray(snapshot.stores?.[storeName]) ? snapshot.stores[storeName] : [];
    for (const record of records) {
      if (record?.id) await RRDatabase.put(storeName, record);
    }
  }

  if (snapshot.activeSchoolYearId) {
    localStorage.setItem(SCHOOL_YEAR_STORAGE_KEY, snapshot.activeSchoolYearId);
    appState.activeSchoolYearId = snapshot.activeSchoolYearId;
  }
}

function getSnapshotStats(snapshot) {
  const stores = snapshot?.stores || {};
  return {
    schoolYears: stores.schoolYears?.length || 0,
    classes: stores.classes?.length || 0,
    students: stores.students?.length || 0,
    budgets: stores.budgets?.length || 0,
    payments: stores.payments?.length || 0,
    expenses: stores.expenses?.length || 0,
    categories: stores.categories?.length || 0,
  };
}

function formatSnapshotStats(snapshot) {
  const stats = getSnapshotStats(snapshot);
  return `${stats.schoolYears} lat, ${stats.classes} klas, ${stats.students} uczniów, ${stats.budgets} budżetów, ${stats.payments} wpłat, ${stats.expenses} wydatków, ${stats.categories} kategorii`;
}

function getSnapshotSchoolYearName(snapshot) {
  const stores = snapshot?.stores || {};
  const years = Array.isArray(stores.schoolYears) ? stores.schoolYears : [];
  const activeYear = years.find((year) => year.id === snapshot?.activeSchoolYearId)
    ?? years.find((year) => year.isActive)
    ?? years[0]
    ?? null;

  return activeYear?.name || snapshot?.activeSchoolYearId || "nie podano";
}

function getSnapshotExportDateLabel(snapshot) {
  if (!snapshot?.exportedAt) return "nie podano";
  const date = new Date(snapshot.exportedAt);
  if (!Number.isFinite(date.getTime())) return String(snapshot.exportedAt);
  return date.toLocaleString("pl-PL");
}

function validateBackupSnapshotForImport(snapshot) {
  const errors = [];
  const warnings = [];

  if (!isValidSyncSnapshot(snapshot)) {
    errors.push("Plik nie ma poprawnej struktury kopii eSkarbnik.");
    return { errors, warnings };
  }

  if (snapshot.appName && snapshot.appName !== "eSkarbnik") {
    warnings.push(`Plik ma inną nazwę aplikacji: ${snapshot.appName}.`);
  }

  if (snapshot.schemaVersion && Number(snapshot.schemaVersion) !== 15) {
    warnings.push(`Kopia ma schemaVersion ${snapshot.schemaVersion}, a bieżąca aplikacja używa 15.`);
  }

  for (const storeName of SYNC_STORE_NAMES) {
    const records = snapshot.stores?.[storeName];
    if (records !== undefined && !Array.isArray(records)) {
      errors.push(`Sekcja ${storeName} w kopii nie jest listą rekordów.`);
    }
  }

  const stats = getSnapshotStats(snapshot);
  const totalRecords = Object.values(stats).reduce((sum, value) => sum + value, 0);
  if (totalRecords === 0) {
    warnings.push("Kopia nie zawiera żadnych rekordów do przywrócenia.");
  }

  return { errors, warnings };
}

function buildBackupImportConfirmMessage({ snapshot, currentSnapshot, fileName, warnings }) {
  const warningText = warnings.length > 0
    ? `\n\nOstrzeżenia:\n- ${warnings.join("\n- ")}`
    : "";

  return [
    "Przywrócić kopię JSON i ZASTĄPIĆ lokalne dane?",
    "",
    "Tryb importu: NADPISANIE.",
    "To nie dopisze rekordów — obecne dane w tej przeglądarce zostaną usunięte i zastąpione kopią.",
    "",
    `Plik: ${fileName || "nie podano"}`,
    `Rok w kopii: ${getSnapshotSchoolYearName(snapshot)}`,
    `Data eksportu kopii: ${getSnapshotExportDateLabel(snapshot)}`,
    `Wersja kopii: ${snapshot.appVersion || "nie podano"}`,
    `Schema kopii: ${snapshot.schemaVersion || "nie podano"}`,
    "",
    `Aktualnie lokalnie: ${formatSnapshotStats(currentSnapshot)}`,
    `Po przywróceniu: ${formatSnapshotStats(snapshot)}`,
    "",
    "Po imporcie aplikacja automatycznie przeładuje dane i odświeży widoki.",
  ].join("\n") + warningText;
}

function downloadTextFile(filename, text, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportJsonBackup() {
  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może wykonać pełną kopię danych.")) return;

  const snapshot = await exportLocalSnapshot();
  const safeYear = getActiveSchoolYearName().replace(/[^0-9a-zA-Z]+/g, "-").replace(/^-|-$/g, "") || "rok";
  const date = getTodayDate();
  downloadTextFile(
    `eskarbnik-kopia-${safeYear}-${date}.json`,
    JSON.stringify(snapshot, null, 2),
    "application/json;charset=utf-8",
  );
  showToast(`Kopia JSON została pobrana: ${formatSnapshotStats(snapshot)}.`);
}

async function importJsonBackupFromFile(file) {
  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może przywracać kopię danych.")) return;
  if (!file) return;

  const text = await file.text();
  let snapshot;
  try {
    snapshot = JSON.parse(text);
  } catch (error) {
    throw new Error("Wybrany plik nie jest poprawnym JSON.");
  }

  const validation = validateBackupSnapshotForImport(snapshot);
  if (validation.errors.length > 0) {
    throw new Error(validation.errors.join(" "));
  }

  const currentSnapshot = await exportLocalSnapshot();
  const confirmed = window.confirm(buildBackupImportConfirmMessage({
    snapshot,
    currentSnapshot,
    fileName: file.name,
    warnings: validation.warnings,
  }));
  if (!confirmed) return;

  await replaceLocalDataFromSnapshot(snapshot);
  appState.importPreview = null;
  await loadData();
  renderAll();
  showToast(`Kopia JSON została przywrócona. Wczytano: ${formatSnapshotStats(snapshot)}.`);
}

function buildDataAuditFromSnapshot(snapshot) {
  const stores = snapshot?.stores || {};
  const messages = [];
  const warnings = [];

  const schoolYears = stores.schoolYears || [];
  const classes = stores.classes || [];
  const students = stores.students || [];
  const budgets = stores.budgets || [];
  const payments = stores.payments || [];
  const expenses = stores.expenses || [];
  const categories = stores.categories || [];

  const schoolYearIds = new Set(schoolYears.map((item) => item.id));
  const classIds = new Set(classes.map((item) => item.id));
  const studentIds = new Set(students.map((item) => item.id));
  const budgetIds = new Set(budgets.map((item) => item.id));
  const categoryIds = new Set(categories.map((item) => item.id));

  if (schoolYears.length === 0) messages.push("Brak roku szkolnego w bazie.");

  for (const year of schoolYears) {
    const yearBudgets = budgets.filter((budget) => budget.schoolYearId === year.id);
    const hasSchoolBudget = yearBudgets.some((budget) => budget.type === BUDGET_TYPES.school);
    if (!hasSchoolBudget) messages.push(`Rok ${year.name || year.id} nie ma budżetu Rady Rodziców.`);
  }

  const classNameMap = new Map();
  for (const classItem of classes) {
    if (!schoolYearIds.has(classItem.schoolYearId)) messages.push(`Klasa ${classItem.name || classItem.id} ma nieistniejący rok szkolny.`);
    const classBudget = budgets.find((budget) => budget.type === BUDGET_TYPES.class && budget.classId === classItem.id);
    if (!classBudget) messages.push(`Klasa ${classItem.name || classItem.id} nie ma kasy klasowej.`);
    const duplicateKey = `${classItem.schoolYearId}::${normalizeText(classItem.name).toLowerCase()}`;
    classNameMap.set(duplicateKey, (classNameMap.get(duplicateKey) || 0) + 1);
  }
  for (const [key, count] of classNameMap.entries()) {
    if (count > 1) warnings.push(`W jednym roku szkolnym występuje zdublowana nazwa klasy: ${key.split("::")[1]}.`);
  }

  for (const student of students) {
    if (!schoolYearIds.has(student.schoolYearId)) messages.push(`Uczeń ${student.fullName || student.id} ma nieistniejący rok szkolny.`);
    if (!classIds.has(student.classId)) messages.push(`Uczeń ${student.fullName || student.id} jest przypisany do nieistniejącej klasy.`);
  }

  for (const budget of budgets) {
    if (!schoolYearIds.has(budget.schoolYearId)) messages.push(`Budżet ${budget.name || budget.id} ma nieistniejący rok szkolny.`);
    if (budget.type === BUDGET_TYPES.class && !classIds.has(budget.classId)) messages.push(`Budżet ${budget.name || budget.id} wskazuje nieistniejącą klasę.`);
  }

  for (const payment of payments) {
    if (!schoolYearIds.has(payment.schoolYearId)) messages.push(`Wpłata ${payment.id} ma nieistniejący rok szkolny.`);
    if (!budgetIds.has(payment.budgetId)) messages.push(`Wpłata ${payment.id} ma nieistniejący budżet.`);
    if (payment.classId && !classIds.has(payment.classId)) messages.push(`Wpłata ${payment.id} wskazuje nieistniejącą klasę.`);
    if (payment.studentId && !studentIds.has(payment.studentId)) messages.push(`Wpłata ${payment.id} wskazuje nieistniejącego ucznia.`);
    if (normalizeMoney(payment.amount) <= 0) warnings.push(`Wpłata ${payment.id} ma kwotę 0 zł albo ujemną.`);
    if (payment.category && !categoryIds.has(payment.category) && !getCategoryByIdOrKey(CATEGORY_TYPES.payment, payment.category)) warnings.push(`Wpłata ${payment.id} ma kategorię spoza aktualnej listy.`);
  }

  for (const expense of expenses) {
    if (!schoolYearIds.has(expense.schoolYearId)) messages.push(`Wydatek ${expense.id} ma nieistniejący rok szkolny.`);
    if (!budgetIds.has(expense.budgetId)) messages.push(`Wydatek ${expense.id} ma nieistniejący budżet.`);
    if (expense.classId && !classIds.has(expense.classId)) messages.push(`Wydatek ${expense.id} wskazuje nieistniejącą klasę.`);
    if (normalizeMoney(expense.amount) <= 0) warnings.push(`Wydatek ${expense.id} ma kwotę 0 zł albo ujemną.`);
    if (expense.category && !categoryIds.has(expense.category) && !getCategoryByIdOrKey(CATEGORY_TYPES.expense, expense.category)) warnings.push(`Wydatek ${expense.id} ma kategorię spoza aktualnej listy.`);
  }

  for (const category of categories) {
    if (!schoolYearIds.has(category.schoolYearId)) warnings.push(`Kategoria ${category.name || category.id} ma nieistniejący rok szkolny.`);
    if (![CATEGORY_TYPES.payment, CATEGORY_TYPES.expense].includes(category.type)) warnings.push(`Kategoria ${category.name || category.id} ma nieznany typ.`);
  }

  return {
    ok: messages.length === 0,
    errors: messages,
    warnings,
    stats: getSnapshotStats(snapshot),
  };
}

function renderDataAuditStatus(audit = null) {
  const container = $("#dataAuditStatus");
  if (!container) return;

  if (!audit) {
    const activeErrors = [];
    const activeClassIds = new Set(appState.classes.map((item) => item.id));
    const activeBudgetIds = new Set(appState.budgets.map((item) => item.id));
    const activeStudentIds = new Set(appState.students.map((item) => item.id));

    if (!getSchoolBudget()) activeErrors.push("brak budżetu Rady Rodziców dla aktywnego roku");
    for (const classItem of appState.classes) {
      if (!appState.budgets.some((budget) => budget.type === BUDGET_TYPES.class && budget.classId === classItem.id)) {
        activeErrors.push(`brak kasy klasowej dla klasy ${classItem.name}`);
      }
    }
    for (const student of appState.students) {
      if (!activeClassIds.has(student.classId)) activeErrors.push(`uczeń bez poprawnej klasy: ${student.fullName}`);
    }
    for (const payment of appState.payments) {
      if (!activeBudgetIds.has(payment.budgetId)) activeErrors.push(`wpłata bez poprawnego budżetu: ${payment.id}`);
      if (payment.studentId && !activeStudentIds.has(payment.studentId)) activeErrors.push(`wpłata bez poprawnego ucznia: ${payment.id}`);
    }
    for (const expense of appState.expenses) {
      if (!activeBudgetIds.has(expense.budgetId)) activeErrors.push(`wydatek bez poprawnego budżetu: ${expense.id}`);
    }

    container.className = activeErrors.length ? "audit-box audit-warning" : "audit-box audit-ok";
    container.innerHTML = activeErrors.length
      ? `<strong>Aktywny rok wymaga uwagi.</strong><p>${escapeHtml(activeErrors.slice(0, 4).join("; "))}${activeErrors.length > 4 ? "…" : ""}</p>`
      : `<strong>Aktywny rok wygląda poprawnie.</strong><p>Spójne są klasy, uczniowie, budżety, wpłaty i wydatki widoczne w aktualnym roku.</p>`;
    return;
  }

  const allMessages = [...audit.errors, ...audit.warnings];
  container.className = audit.errors.length ? "audit-box audit-error" : audit.warnings.length ? "audit-box audit-warning" : "audit-box audit-ok";
  container.innerHTML = `
    <strong>${audit.errors.length ? "Znaleziono błędy danych" : audit.warnings.length ? "Znaleziono ostrzeżenia" : "Kontrola danych OK"}</strong>
    <p>${formatSnapshotStats({ stores: {
      schoolYears: Array(audit.stats.schoolYears),
      classes: Array(audit.stats.classes),
      students: Array(audit.stats.students),
      budgets: Array(audit.stats.budgets),
      payments: Array(audit.stats.payments),
      expenses: Array(audit.stats.expenses),
      categories: Array(audit.stats.categories),
    } })}.</p>
    ${allMessages.length ? `<ul>${allMessages.slice(0, 12).map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>` : ""}
    ${allMessages.length > 12 ? `<p>Pokazano 12 z ${allMessages.length} komunikatów.</p>` : ""}
  `;
}

async function runFullDataAudit() {
  const snapshot = await exportLocalSnapshot();
  const audit = buildDataAuditFromSnapshot(snapshot);
  renderDataAuditStatus(audit);
  showToast(audit.errors.length ? "Kontrola wykazała błędy danych." : audit.warnings.length ? "Kontrola wykazała ostrzeżenia." : "Kontrola danych zakończona poprawnie.");
}

function renderSyncStatus() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  appState.firebaseSync.settings = settings;

  const configInput = $("#firebaseConfigInput");
  const workspaceInput = $("#syncWorkspaceId");
  const syncStatus = $("#syncStatusText");
  const syncLastInfo = $("#syncLastInfo");
  const syncSnapshotInfo = $("#syncSnapshotInfo");
  const settingsSyncText = $("#settingsSyncText");
  const settingsSyncStatus = $("#settingsSyncStatus");

  if (configInput && document.activeElement !== configInput) {
    configInput.value = settings?.configText || "";
  }

  if (workspaceInput && document.activeElement !== workspaceInput) {
    workspaceInput.value = settings?.workspaceId || "eskarbnik";
  }

  if (syncStatus) {
    const sourceLabel = settings?.source === "built-in" ? "Firebase: config z kodu" : "Firebase skonfigurowany lokalnie na tym urządzeniu.";
    syncStatus.textContent = settings ? sourceLabel : "Firebase nie jest jeszcze skonfigurowany.";
    syncStatus.className = settings ? "status-pill status-ok" : "status-pill status-muted";
  }

  if (syncLastInfo) {
    if (settings?.lastSyncAt) {
      syncLastInfo.textContent = `Ostatnia operacja: ${formatIsoDateToPl(settings.lastSyncAt.slice(0, 10))}, ${settings.lastSyncDirection || "synchronizacja"}.`;
    } else {
      syncLastInfo.textContent = "Brak wykonanej synchronizacji na tym urządzeniu.";
    }
  }

  if (syncSnapshotInfo) {
    syncSnapshotInfo.textContent = appState.firebaseSync.lastSnapshot
      ? `Ostatnio odczytany zapis z chmury: ${formatSnapshotStats(appState.firebaseSync.lastSnapshot)}.`
      : "Nie odczytano jeszcze zapisu z Firebase.";
  }

  if (settingsSyncText) {
    settingsSyncText.textContent = settings
      ? `${settings.source === "built-in" ? "Firebase wpisany w kodzie aplikacji" : "Firebase zapisany lokalnie"}. Obszar synchronizacji: ${settings.workspaceId}.`
      : "Firebase nie jest skonfigurowany. Dane działają tylko lokalnie.";
  }

  if (settingsSyncStatus) {
    settingsSyncStatus.textContent = settings ? "Aktywna" : "Nieaktywna";
    settingsSyncStatus.className = settings ? "status-pill status-ok" : "status-pill status-muted";
  }
}

async function saveFirebaseSyncForm() {
  const configText = $("#firebaseConfigInput").value;
  const workspaceId = sanitizeWorkspaceId($("#syncWorkspaceId").value);
  parseFirebaseConfig(configText);
  saveFirebaseSyncSettings({ configText, workspaceId });
  appState.firebaseSync.runtime = null;
  await initializeAuthListenerIfPossible();
  renderSyncStatus();
  renderAuthStatus();
  applyPermissionState();
  showToast("Konfiguracja Firebase została zapisana lokalnie.");
}

async function testFirebaseConnection() {
  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw zapisz konfigurację Firebase.");

  const runtime = await getFirebaseRuntime();
  const snapshots = await readAccessibleFirebaseSnapshots(runtime, settings.workspaceId);
  appState.firebaseSync.lastSnapshot = snapshots.length ? mergeManySnapshots(snapshots) : null;
  renderSyncStatus();
  showToast(snapshots.length ? `Połączenie działa. Dostępne zakresy: ${snapshots.length}.` : "Połączenie działa. Brak zapisu w dostępnym zakresie.");
}

async function uploadLocalSnapshotToFirebase() {
  if (!requirePermission(canManageSync(), "Nie masz uprawnień do synchronizacji danych.")) return;

  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw zapisz konfigurację Firebase.");

  const confirmed = window.confirm("Wysłać do Firebase tylko zakresy, do których masz dostęp? Dane Rady i prywatne kasy klasowe są zapisywane osobno.");
  if (!confirmed) return;

  const runtime = await getFirebaseRuntime();
  const writtenSnapshots = [];

  if (isSchoolTreasurerRole() || isLocalAdminRole()) {
    const schoolSnapshot = await exportSchoolCouncilSnapshot();
    await runtime.setDoc(getFirebaseSnapshotRef(runtime, settings.workspaceId), {
      ...schoolSnapshot,
      cloudUpdatedAt: runtime.serverTimestamp(),
    });
    writtenSnapshots.push(schoolSnapshot);
  }

  for (const classId of getSyncClassIdsForCurrentUser()) {
    const classSnapshot = await exportClassPrivateSnapshot(classId);
    await runtime.setDoc(getFirebaseClassSnapshotRef(runtime, settings.workspaceId, classId), {
      ...classSnapshot,
      cloudUpdatedAt: runtime.serverTimestamp(),
    });
    writtenSnapshots.push(classSnapshot);
  }

  if (writtenSnapshots.length === 0) throw new Error("Brak zakresu danych do wysłania.");

  appState.firebaseSync.lastSnapshot = mergeManySnapshots(writtenSnapshots);
  saveFirebaseSyncSettings({ ...settings, lastSyncAt: nowIso(), lastSyncDirection: "wysłanie dostępnych zakresów do Firebase" });
  renderSyncStatus();
  showToast("Dostępne zakresy danych zostały wysłane do Firebase.");
}

async function downloadFirebaseSnapshotToLocal() {
  if (!requirePermission(canManageSync(), "Nie masz uprawnień do synchronizacji danych.")) return;

  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw zapisz konfigurację Firebase.");

  const runtime = await getFirebaseRuntime();
  const snapshots = await readAccessibleFirebaseSnapshots(runtime, settings.workspaceId);
  if (snapshots.length === 0) throw new Error("W Firebase nie ma jeszcze zapisu w Twoim zakresie dostępu.");

  const mergedSnapshot = mergeManySnapshots(snapshots);
  const confirmed = window.confirm(`Pobrać z Firebase tylko Twój zakres dostępu i zastąpić lokalne dane?\n\nDostępny zakres zawiera: ${formatSnapshotStats(mergedSnapshot)}.`);
  if (!confirmed) return;

  await replaceLocalDataFromSnapshot(mergedSnapshot);
  appState.firebaseSync.lastSnapshot = mergedSnapshot;
  saveFirebaseSyncSettings({ ...settings, lastSyncAt: nowIso(), lastSyncDirection: "pobranie dostępnych zakresów z Firebase" });
  await loadData();
  renderAll();
  showToast("Dostępne dane z Firebase zostały wczytane lokalnie.");
}

async function mergeLocalAndFirebaseData() {
  if (!requirePermission(canManageSync(), "Nie masz uprawnień do synchronizacji danych.")) return;

  const settings = appState.firebaseSync.settings || loadFirebaseSyncSettings();
  if (!settings) throw new Error("Najpierw zapisz konfigurację Firebase.");

  const runtime = await getFirebaseRuntime();
  const cloudSnapshots = await readAccessibleFirebaseSnapshots(runtime, settings.workspaceId);
  const localSnapshots = [];

  if (isSchoolTreasurerRole() || isLocalAdminRole()) localSnapshots.push(await exportSchoolCouncilSnapshot());
  for (const classId of getSyncClassIdsForCurrentUser()) localSnapshots.push(await exportClassPrivateSnapshot(classId));

  if (localSnapshots.length === 0 && cloudSnapshots.length === 0) throw new Error("Brak danych do synchronizacji w Twoim zakresie.");

  const mergedSnapshot = mergeManySnapshots([...cloudSnapshots, ...localSnapshots]);

  if (isSchoolTreasurerRole() || isLocalAdminRole()) {
    const schoolSnapshot = { ...mergedSnapshot, stores: {
      ...mergedSnapshot.stores,
      budgets: (mergedSnapshot.stores.budgets || []).filter((budget) => budget.type === BUDGET_TYPES.school),
      payments: (mergedSnapshot.stores.payments || []).filter((payment) => getBudgetById(payment.budgetId)?.type === BUDGET_TYPES.school || (mergedSnapshot.stores.budgets || []).some((budget) => budget.id === payment.budgetId && budget.type === BUDGET_TYPES.school)),
      expenses: (mergedSnapshot.stores.expenses || []).filter((expense) => getBudgetById(expense.budgetId)?.type === BUDGET_TYPES.school || (mergedSnapshot.stores.budgets || []).some((budget) => budget.id === expense.budgetId && budget.type === BUDGET_TYPES.school)),
    }, privacyScope: "schoolCouncil" };
    await runtime.setDoc(getFirebaseSnapshotRef(runtime, settings.workspaceId), { ...schoolSnapshot, cloudUpdatedAt: runtime.serverTimestamp() });
  }

  for (const classId of getSyncClassIdsForCurrentUser()) {
    const classBudgetIds = new Set((mergedSnapshot.stores.budgets || []).filter((budget) => budget.type === BUDGET_TYPES.class && budget.classId === classId).map((budget) => budget.id));
    const classSnapshot = { ...mergedSnapshot, stores: {
      ...mergedSnapshot.stores,
      classes: (mergedSnapshot.stores.classes || []).filter((classItem) => classItem.id === classId),
      students: (mergedSnapshot.stores.students || []).filter((student) => student.classId === classId),
      budgets: (mergedSnapshot.stores.budgets || []).filter((budget) => classBudgetIds.has(budget.id)),
      payments: (mergedSnapshot.stores.payments || []).filter((payment) => classBudgetIds.has(payment.budgetId) || payment.classId === classId),
      expenses: (mergedSnapshot.stores.expenses || []).filter((expense) => classBudgetIds.has(expense.budgetId) || expense.classId === classId),
    }, privacyScope: "classPrivate", classId };
    await runtime.setDoc(getFirebaseClassSnapshotRef(runtime, settings.workspaceId, classId), { ...classSnapshot, cloudUpdatedAt: runtime.serverTimestamp() });
  }

  await replaceLocalDataFromSnapshot(mergedSnapshot);
  appState.firebaseSync.lastSnapshot = mergedSnapshot;
  saveFirebaseSyncSettings({ ...settings, lastSyncAt: nowIso(), lastSyncDirection: "synchronizacja zakresów prywatności" });
  await loadData();
  renderAll();
  showToast("Synchronizacja dostępnych zakresów zakończona.");
}

function setSyncBusy(isBusy) {
  appState.firebaseSync.isBusy = isBusy;
  $all("[data-sync-action]").forEach((button) => {
    button.disabled = isBusy || (button.dataset.permission === "global-write" && !canManageSync());
  });
}

function runSyncAction(action) {
  return async () => {
    if (appState.firebaseSync.isBusy) return;
    setSyncBusy(true);
    try {
      await action();
    } catch (error) {
      console.error(error);
      showToast(error.message || "Nie udało się wykonać operacji Firebase.");
    } finally {
      setSyncBusy(false);
      renderSyncStatus();
    }
  };
}

function setupSyncActions() {
  $("#saveFirebaseConfigButton")?.addEventListener("click", runSyncAction(saveFirebaseSyncForm));
  $("#testFirebaseButton")?.addEventListener("click", runSyncAction(testFirebaseConnection));
  $("#uploadToFirebaseButton")?.addEventListener("click", runSyncAction(uploadLocalSnapshotToFirebase));
  $("#downloadFromFirebaseButton")?.addEventListener("click", runSyncAction(downloadFirebaseSnapshotToLocal));
  $("#mergeFirebaseButton")?.addEventListener("click", runSyncAction(mergeLocalAndFirebaseData));
  $("#clearFirebaseConfigButton")?.addEventListener("click", () => {
    const confirmed = window.confirm("Usunąć lokalnie zapisaną konfigurację Firebase z tego urządzenia?");
    if (!confirmed) return;
    clearFirebaseSyncSettings();
    renderSyncStatus();
    renderAuthStatus();
    applyPermissionState();
    showToast("Lokalna konfiguracja usunięta. Aplikacja wróciła do configu Firebase wpisanego w kodzie.");
  });
}

function renderStorageStatus() {
  const classBudgets = getClassBudgets().length;
  const text = `Aktywny rok: ${getActiveSchoolYearName()}. IndexedDB: zapisano ${appState.classes.length} klas, ${appState.students.length} uczniów, ${appState.budgets.length} budżetów, ${appState.payments.length} wpłat i ${appState.expenses.length} wydatków dla tego roku. Kasy klasowe: ${classBudgets}.`;
  $("#storageStatus").textContent = text;
}

function renderAll() {
  renderSchoolYearSelect();
  updateDashboard();
  renderClasses();
  renderSelectedClass();
  renderBudgets();
  renderPayments();
  renderExpenses();
  renderCategories();
  renderReceipts();
  renderReports();
  renderImport();
  renderSyncStatus();
  renderAuthStatus();
  renderAiStatus();
  renderStorageStatus();
  renderDataAuditStatus();
  applyPermissionState();
}

function resetClassForm() {
  $("#classId").value = "";
  $("#className").value = "";
  $("#classDefaultFee").value = "";
  $("#classNotes").value = "";
  $("#classFormTitle").textContent = "Dodaj klasę";
}

function resetStudentForm() {
  $("#studentId").value = "";
  $("#studentName").value = "";
  $("#studentActive").checked = true;
  $("#studentFormTitle").textContent = "Dodaj ucznia";
}

async function saveClass(event) {
  event.preventDefault();

  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może dodawać i edytować klasy.")) return;

  const id = $("#classId").value || makeId("class");
  const name = normalizeText($("#className").value);
  const existing = appState.classes.find((item) => item.id === id);

  if (!name) {
    showToast("Podaj nazwę klasy.");
    return;
  }

  const duplicate = appState.classes.some((item) => item.id !== id && item.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    showToast("Taka klasa już istnieje.");
    return;
  }

  const classItem = {
    id,
    schoolYearId: appState.activeSchoolYearId,
    name,
    defaultFee: normalizeMoney($("#classDefaultFee").value),
    notes: normalizeText($("#classNotes").value),
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await RRDatabase.put(RR_STORES.classes, classItem);
  await RRDatabase.put(RR_STORES.budgets, createClassBudget(classItem, appState.budgets.find((budget) => budget.classId === id)));

  appState.selectedClassId = id;
  resetClassForm();
  await loadData();
  renderAll();
  showToast("Klasa i jej kasa klasowa zostały zapisane.");
}

function fillClassForm(classId) {
  const classItem = appState.classes.find((item) => item.id === classId);
  if (!classItem) return;

  $("#classId").value = classItem.id;
  $("#className").value = classItem.name;
  $("#classDefaultFee").value = classItem.defaultFee || "";
  $("#classNotes").value = classItem.notes || "";
  $("#classFormTitle").textContent = `Edytuj klasę ${classItem.name}`;
}

async function deleteClass(classId) {
  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może usuwać klasy.")) return;

  const classItem = appState.classes.find((item) => item.id === classId);
  if (!classItem) return;

  const studentsCount = getStudentsForClass(classId).length;
  const classPaymentsCount = appState.payments.filter((payment) => payment.classId === classId).length;
  const classExpensesCount = appState.expenses.filter((expense) => expense.classId === classId).length;
  const confirmed = window.confirm(`Usunąć klasę ${classItem.name} razem z uczniami (${studentsCount}), jej kasą klasową, wpłatami (${classPaymentsCount}) i wydatkami (${classExpensesCount})?`);
  if (!confirmed) return;

  await RRDatabase.removePaymentsByClass(classId);
  await RRDatabase.removeExpensesByClass(classId);
  await RRDatabase.removeStudentsByClass(classId);
  await RRDatabase.removeBudgetsByClass(classId);
  await RRDatabase.remove(RR_STORES.classes, classId);

  if (appState.selectedClassId === classId) appState.selectedClassId = null;

  resetClassForm();
  resetStudentForm();
  await loadData();
  renderAll();
  showToast("Klasa i jej kasa klasowa zostały usunięte.");
}

async function saveStudent(event) {
  event.preventDefault();

  if (!requirePermission(canManageClass(appState.selectedClassId), "Nie masz uprawnień do edycji uczniów tej klasy.")) return;

  if (!appState.selectedClassId) {
    showToast("Najpierw wybierz klasę.");
    return;
  }

  const id = $("#studentId").value || makeId("student");
  const fullName = normalizeText($("#studentName").value);
  const existing = appState.students.find((item) => item.id === id);

  if (!fullName) {
    showToast("Podaj imię i nazwisko ucznia.");
    return;
  }

  const duplicate = appState.students.some((item) => (
    item.id !== id
    && item.classId === appState.selectedClassId
    && item.fullName.toLowerCase() === fullName.toLowerCase()
  ));

  if (duplicate) {
    showToast("Taki uczeń już istnieje w tej klasie.");
    return;
  }

  const student = {
    id,
    schoolYearId: appState.activeSchoolYearId,
    classId: appState.selectedClassId,
    fullName,
    isActive: $("#studentActive").checked,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await RRDatabase.put(RR_STORES.students, student);
  resetStudentForm();
  await loadData();
  renderAll();
  showToast("Uczeń został zapisany.");
}

function fillStudentForm(studentId) {
  const student = appState.students.find((item) => item.id === studentId);
  if (!student) return;

  appState.selectedClassId = student.classId;
  $("#studentId").value = student.id;
  $("#studentName").value = student.fullName;
  $("#studentActive").checked = student.isActive;
  $("#studentFormTitle").textContent = "Edytuj ucznia";
  renderAll();
}

async function deleteStudent(studentId) {
  const student = appState.students.find((item) => item.id === studentId);
  if (!student) return;
  if (!requirePermission(canManageClass(student.classId), "Nie masz uprawnień do usunięcia ucznia z tej klasy.")) return;

  const studentPayments = appState.payments.filter((payment) => payment.studentId === studentId).length;
  const confirmed = window.confirm(`Usunąć ucznia: ${student.fullName}? Powiązane wpłaty zostaną usunięte: ${studentPayments}.`);
  if (!confirmed) return;

  await RRDatabase.removePaymentsByStudent(studentId);
  await RRDatabase.remove(RR_STORES.students, studentId);
  resetStudentForm();
  await loadData();
  renderAll();
  showToast("Uczeń został usunięty.");
}

function resetPaymentForm() {
  $("#paymentId").value = "";
  $("#paymentBudgetId").value = getSchoolBudgetId();
  $("#paymentClassId").value = "";
  $("#paymentStudentId").value = "";
  $("#paymentAmount").value = "";
  fillCategorySelect("#paymentCategoryId", CATEGORY_TYPES.payment, getDefaultCategoryId(CATEGORY_TYPES.payment, "committee_fee"));
  $("#paymentDate").value = getTodayDate();
  $("#paymentMethod").value = "cash";
  $("#paymentPayerName").value = "";
  $("#paymentNotes").value = "";
  $("#paymentFormTitle").textContent = "Dodaj wpłatę";
  renderPaymentFormSelectors();
}

function getPaymentMethodLabel(method) {
  const labels = {
    cash: "gotówka",
    transfer: "przelew",
    donation: "darowizna",
    other: "inne",
  };

  return labels[method] ?? method;
}

async function savePayment(event) {
  event.preventDefault();

  const id = $("#paymentId").value || makeId("payment");
  const budgetId = $("#paymentBudgetId").value;
  const budget = getBudgetById(budgetId);
  let classId = $("#paymentClassId").value || null;
  let studentId = $("#paymentStudentId").value || null;
  const amount = normalizeMoney($("#paymentAmount").value);
  const categoryId = $("#paymentCategoryId").value || getDefaultCategoryId(CATEGORY_TYPES.payment, "other");
  const date = $("#paymentDate").value || getTodayDate();
  const method = $("#paymentMethod").value;
  const payerName = normalizeText($("#paymentPayerName").value);
  const notes = normalizeText($("#paymentNotes").value);
  const existing = appState.payments.find((payment) => payment.id === id);

  if (!budget) {
    showToast("Wybierz budżet wpłaty.");
    return;
  }

  if (!requirePermission(canManageBudgetId(budgetId), "Nie masz uprawnień do zapisu wpłat w tym budżecie.")) return;

  if (budget.type === BUDGET_TYPES.class) {
    classId = budget.classId;
  }

  if (studentId) {
    const student = getStudentById(studentId);
    if (!student) {
      showToast("Wybrany uczeń nie istnieje.");
      return;
    }
    classId = student.classId;
  }

  if (amount <= 0) {
    showToast("Podaj kwotę większą od zera.");
    return;
  }

  if (studentId && budget.type === BUDGET_TYPES.class && classId !== budget.classId) {
    showToast("Uczeń nie należy do klasy przypisanej do tej kasy klasowej.");
    return;
  }

  if (!studentId && !payerName) {
    showToast("Wybierz ucznia albo wpisz nazwę wpłacającego/opis wpłaty.");
    return;
  }

  const payment = {
    id,
    schoolYearId: appState.activeSchoolYearId,
    budgetId,
    budgetType: budget.type,
    classId,
    studentId,
    amount,
    categoryId,
    categoryLabel: getPaymentCategoryLabel(categoryId),
    date,
    method,
    methodLabel: getPaymentMethodLabel(method),
    payerName,
    notes,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await RRDatabase.put(RR_STORES.payments, payment);
  resetPaymentForm();
  await loadData();
  renderAll();
  showToast("Wpłata została zapisana.");
}

function fillPaymentForm(paymentId) {
  const payment = appState.payments.find((item) => item.id === paymentId);
  if (!payment) return;

  $("#paymentId").value = payment.id;
  $("#paymentBudgetId").value = payment.budgetId;
  $("#paymentClassId").value = payment.classId || "";
  syncPaymentBudgetFields();
  $("#paymentStudentId").value = payment.studentId || "";
  $("#paymentAmount").value = payment.amount || "";
  fillCategorySelect("#paymentCategoryId", CATEGORY_TYPES.payment, payment.categoryId || payment.category || getDefaultCategoryId(CATEGORY_TYPES.payment, "other"));
  $("#paymentDate").value = payment.date || getTodayDate();
  $("#paymentMethod").value = payment.method || "cash";
  $("#paymentPayerName").value = payment.payerName || "";
  $("#paymentNotes").value = payment.notes || "";
  $("#paymentFormTitle").textContent = "Edytuj wpłatę";
  switchSection("payments");
  renderPaymentControl();
}

async function deletePayment(paymentId) {
  const payment = appState.payments.find((item) => item.id === paymentId);
  if (!payment) return;
  if (!requirePermission(canManageBudgetId(payment.budgetId), "Nie masz uprawnień do usunięcia tej wpłaty.")) return;

  const confirmed = window.confirm(`Usunąć wpłatę ${formatMoney(payment.amount)} z dnia ${payment.date}?`);
  if (!confirmed) return;

  await RRDatabase.remove(RR_STORES.payments, paymentId);
  await loadData();
  renderAll();
  showToast("Wpłata została usunięta.");
}


function resetExpenseForm() {
  $("#expenseId").value = "";
  $("#expenseBudgetId").value = getSchoolBudgetId();
  $("#expenseAmount").value = "";
  $("#expenseDate").value = getTodayDate();
  fillCategorySelect("#expenseCategory", CATEGORY_TYPES.expense, getDefaultCategoryId(CATEGORY_TYPES.expense, "other"));
  $("#expenseReceiptNumber").value = "";
  $("#expenseSeller").value = "";
  $("#expensePaidBy").value = "";
  $("#expenseDescription").value = "";
  $("#expenseFormTitle").textContent = "Dodaj wydatek";
  fillExpenseBudgetSelect();
}

function getPaymentCategoryLabel(category) {
  return getCategoryLabel(CATEGORY_TYPES.payment, category);
}

function getExpenseCategoryLabel(category) {
  return getCategoryLabel(CATEGORY_TYPES.expense, category);
}

function getReceiptLines(text) {
  return String(text ?? "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => normalizeText(line))
    .filter(Boolean);
}

function normalizeReceiptAmount(value) {
  const cleaned = String(value ?? "")
    .replace(/\s/g, "")
    .replace(/PLN|ZŁ|ZL/gi, "")
    .replace(/,/g, ".");
  const number = Number(cleaned);
  if (!Number.isFinite(number) || number <= 0) return null;
  return Math.round(number * 100) / 100;
}

function isReasonableReceiptAmount(amount) {
  return Number.isFinite(amount) && amount > 0 && amount < 100000;
}

function normalizeReceiptDate(day, month, year) {
  let numericYear = Number(year);
  if (numericYear < 100) numericYear += 2000;
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const date = new Date(numericYear, numericMonth - 1, numericDay);
  if (
    date.getFullYear() !== numericYear
    || date.getMonth() !== numericMonth - 1
    || date.getDate() !== numericDay
  ) return null;
  return `${numericYear}-${String(numericMonth).padStart(2, "0")}-${String(numericDay).padStart(2, "0")}`;
}

function findReceiptDate(text) {
  const normalized = String(text ?? "");
  const isoMatch = normalized.match(/(20\d{2})[.\-/](0?[1-9]|1[0-2])[.\-/](0?[1-9]|[12]\d|3[01])/);
  if (isoMatch) return normalizeReceiptDate(isoMatch[3], isoMatch[2], isoMatch[1]);

  const plMatch = normalized.match(/(0?[1-9]|[12]\d|3[01])[.\-/](0?[1-9]|1[0-2])[.\-/](20\d{2}|\d{2})/);
  if (plMatch) return normalizeReceiptDate(plMatch[1], plMatch[2], plMatch[3]);

  return "";
}

function extractAmountsFromLine(line) {
  const amounts = [];
  const amountPattern = /(?<!\d)(\d{1,5}[,.]\d{2})(?!\d)/g;
  let match;
  while ((match = amountPattern.exec(line)) !== null) {
    const amount = normalizeReceiptAmount(match[1]);
    if (isReasonableReceiptAmount(amount)) amounts.push(amount);
  }
  return amounts;
}

function findReceiptAmount(lines) {
  const keywordRules = [
    { pattern: /(do\s*zap[łl]aty|nale[żz]no[śćsc]|razem\s*pln|suma\s*pln|suma|razem|total)/i, score: 6 },
    { pattern: /(zap[łl]acono|got[óo]wka|karta|p[łl]atno[śćsc])/i, score: 4 },
  ];

  const candidates = [];
  lines.forEach((line, index) => {
    const amounts = extractAmountsFromLine(line);
    if (amounts.length === 0) return;

    const isTaxLine = /(ptu|vat|podatek|netto|brutto)/i.test(line);
    const isStrongTotalLine = /(do\s*zap[łl]aty|nale[żz]no[śćsc]|razem\s*pln|suma\s*pln|total)/i.test(line);
    if (isTaxLine && !isStrongTotalLine) return;

    const score = keywordRules.reduce((best, rule) => rule.pattern.test(line) ? Math.max(best, rule.score) : best, 1);
    amounts.forEach((amount) => candidates.push({ amount, score, index, line }));
  });

  if (candidates.length === 0) return { amount: null, confidence: 0, source: "" };

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.index !== a.index) return b.index - a.index;
    return b.amount - a.amount;
  });

  const best = candidates[0];
  return {
    amount: best.amount,
    confidence: best.score >= 6 ? 0.86 : best.score >= 4 ? 0.68 : 0.45,
    source: best.line,
  };
}

function findReceiptNumber(lines) {
  const rules = [
    /(?:nr|numer)\s*(?:paragonu|dok(?:umentu)?|wydruku|transakcji|rachunku|faktury)?\s*[:#-]?\s*([A-Z0-9\/\-.]{4,})/i,
    /(?:paragon|faktura)\s*(?:fiskalny)?\s*(?:nr|numer)?\s*[:#-]?\s*([A-Z0-9\/\-.]{4,})/i,
  ];

  for (const line of lines) {
    for (const rule of rules) {
      const match = line.match(rule);
      if (match?.[1]) return match[1].replace(/[.,;:]$/, "");
    }
  }

  return "";
}

function findReceiptSeller(lines) {
  const ignored = /^(nip|data|godz|paragon|faktura|kasa|kasjer|nr|numer|suma|razem|do zap[łl]aty|sprzeda[żz]|ptu|vat|wydruk|adres)/i;
  const candidates = lines
    .slice(0, 8)
    .filter((line) => line.length >= 3 && line.length <= 80)
    .filter((line) => !ignored.test(line))
    .filter((line) => !/\d{2}[.\-/]\d{2}[.\-/]\d{2,4}/.test(line))
    .filter((line) => !/\d{1,5}[,.]\d{2}/.test(line));

  return candidates[0] ?? "";
}

function findReceiptCategory(text) {
  const normalized = stripPolishSigns(text);
  let best = { key: "other", hits: 0 };

  for (const rule of RECEIPT_CATEGORY_KEYWORDS) {
    const hits = rule.words.reduce((sum, word) => {
      const normalizedWord = stripPolishSigns(word);
      return normalized.includes(normalizedWord) ? sum + 1 : sum;
    }, 0);
    if (hits > best.hits) best = { key: rule.key, hits };
  }

  const categoryId = getDefaultCategoryId(CATEGORY_TYPES.expense, best.key || "other")
    || getDefaultCategoryId(CATEGORY_TYPES.expense, "other");

  return {
    categoryId,
    key: best.key,
    hits: best.hits,
    confidence: best.hits > 1 ? 0.72 : best.hits === 1 ? 0.55 : 0.25,
  };
}

function analyzeReceiptText(rawText) {
  const text = String(rawText ?? "").trim();
  const lines = getReceiptLines(text);
  const amountResult = findReceiptAmount(lines);
  const categoryResult = findReceiptCategory(text);
  const warnings = [];

  if (!text) warnings.push("Brak tekstu do analizy.");
  if (!amountResult.amount) warnings.push("Nie znaleziono pewnej kwoty końcowej.");

  const result = {
    rawText: text,
    linesCount: lines.length,
    date: findReceiptDate(text),
    amount: amountResult.amount,
    amountSource: amountResult.source,
    amountConfidence: amountResult.confidence,
    receiptNumber: findReceiptNumber(lines),
    seller: findReceiptSeller(lines),
    categoryId: categoryResult.categoryId,
    categoryLabel: getExpenseCategoryLabel(categoryResult.categoryId),
    categoryConfidence: categoryResult.confidence,
    analysisSource: "local",
    warnings,
  };

  if (!result.date) result.warnings.push("Nie znaleziono daty. Ustawiono dzisiejszą datę w formularzu.");
  if (!result.receiptNumber) result.warnings.push("Nie znaleziono numeru paragonu/faktury.");
  if (!result.seller) result.warnings.push("Nie rozpoznano sprzedawcy.");

  return result;
}


function getActiveExpenseCategoriesForAi() {
  return getCategoriesByType(CATEGORY_TYPES.expense, true).map((category) => ({
    id: category.id,
    key: category.key,
    name: category.name,
  }));
}

function loadAiSettings() {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      enabled: Boolean(parsed.enabled),
      endpoint: normalizeText(parsed.endpoint) || DEFAULT_AI_ENDPOINT,
      model: normalizeText(parsed.model) || DEFAULT_AI_MODEL,
      apiKey: String(parsed.apiKey || ""),
      temperature: Number.isFinite(Number(parsed.temperature)) ? Number(parsed.temperature) : 0.1,
      savedAt: parsed.savedAt || null,
    };
  } catch (error) {
    console.warn("Nie udało się odczytać ustawień AI.", error);
    return null;
  }
}

function saveAiSettings(settings) {
  const normalized = {
    enabled: Boolean(settings.enabled),
    endpoint: normalizeText(settings.endpoint) || DEFAULT_AI_ENDPOINT,
    model: normalizeText(settings.model) || DEFAULT_AI_MODEL,
    apiKey: String(settings.apiKey || ""),
    temperature: Math.min(1, Math.max(0, Number(settings.temperature) || 0.1)),
    savedAt: nowIso(),
  };
  localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
  appState.ai.settings = normalized;
  return normalized;
}

function clearAiSettings() {
  localStorage.removeItem(AI_SETTINGS_STORAGE_KEY);
  appState.ai.settings = null;
  appState.ai.lastTest = null;
}

function isAiConfigured() {
  const settings = appState.ai.settings || loadAiSettings();
  appState.ai.settings = settings;
  return Boolean(settings?.enabled && settings.endpoint && settings.model && settings.apiKey);
}

function renderAiStatus() {
  const settings = appState.ai.settings || loadAiSettings();
  appState.ai.settings = settings;
  const configured = isAiConfigured();

  const aiEnabled = $("#aiEnabled");
  const aiEndpoint = $("#aiEndpoint");
  const aiModel = $("#aiModel");
  const aiApiKey = $("#aiApiKey");
  const aiTemperature = $("#aiTemperature");
  const aiGlobalStatus = $("#aiGlobalStatus");
  const receiptAiStatus = $("#receiptAiStatus");
  const settingsAiText = $("#settingsAiText");
  const settingsAiStatus = $("#settingsAiStatus");
  const aiTestResult = $("#aiTestResult");
  const analyzeAiButton = $("#analyzeReceiptAiButton");

  if (aiEnabled && document.activeElement !== aiEnabled) aiEnabled.checked = Boolean(settings?.enabled);
  if (aiEndpoint && document.activeElement !== aiEndpoint) aiEndpoint.value = settings?.endpoint || DEFAULT_AI_ENDPOINT;
  if (aiModel && document.activeElement !== aiModel) aiModel.value = settings?.model || DEFAULT_AI_MODEL;
  if (aiApiKey && document.activeElement !== aiApiKey) aiApiKey.value = settings?.apiKey || "";
  if (aiTemperature && document.activeElement !== aiTemperature) aiTemperature.value = String(settings?.temperature ?? 0.1);

  const statusText = configured ? `AI aktywne: ${settings.model}` : "AI: nie skonfigurowane";
  for (const el of [aiGlobalStatus, receiptAiStatus]) {
    if (!el) continue;
    el.textContent = statusText;
    el.className = configured ? "status-pill status-ok" : "status-pill status-muted";
  }

  if (settingsAiText) {
    settingsAiText.textContent = configured
      ? `AI włączone lokalnie. Model: ${settings.model}. Teksty paragonów mogą być analizowane przez API.`
      : "AI nie jest skonfigurowane. Aplikacja nadal działa lokalnie bez AI.";
  }
  if (settingsAiStatus) {
    settingsAiStatus.textContent = configured ? "Aktywne" : "Nieaktywne";
    settingsAiStatus.className = configured ? "status-pill status-ok" : "status-pill status-muted";
  }
  if (analyzeAiButton) analyzeAiButton.disabled = appState.ai.isBusy || !configured;
  if (aiTestResult && appState.ai.lastTest) {
    aiTestResult.className = appState.ai.lastTest.ok ? "ai-test-result receipt-ok-text" : "ai-test-result warning-box";
    aiTestResult.textContent = appState.ai.lastTest.message;
  }
}

function extractJsonObjectFromText(text) {
  const cleaned = String(text ?? "")
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) throw new Error("AI nie zwróciła poprawnego JSON.");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function findCategoryForAiResult(aiResult) {
  const categories = getCategoriesByType(CATEGORY_TYPES.expense, true);
  const rawId = normalizeText(aiResult.category_id);
  const rawKey = normalizeText(aiResult.category_key);
  const rawName = stripPolishSigns(aiResult.category_name || aiResult.category || "");

  if (rawId) {
    const byId = categories.find((category) => category.id === rawId);
    if (byId) return byId.id;
  }
  if (rawKey) {
    const byKey = categories.find((category) => category.key === rawKey);
    if (byKey) return byKey.id;
  }
  if (rawName) {
    const byName = categories.find((category) => stripPolishSigns(category.name) === rawName);
    if (byName) return byName.id;
  }

  return getDefaultCategoryId(CATEGORY_TYPES.expense, "other");
}

function normalizeAiReceiptResult(aiResult, rawText) {
  const localFallback = analyzeReceiptText(rawText);
  const amount = normalizeMoney(aiResult.amount ?? aiResult.kwota ?? localFallback.amount);
  const date = normalizeText(aiResult.date ?? aiResult.data) || localFallback.date || "";
  const categoryId = findCategoryForAiResult(aiResult);
  const warnings = Array.isArray(aiResult.warnings)
    ? aiResult.warnings.map((warning) => normalizeText(warning)).filter(Boolean)
    : [];

  if (!amount) warnings.push("AI nie podała poprawnej kwoty. Sprawdź formularz ręcznie.");
  if (!date) warnings.push("AI nie podała daty. Ustawiono dzisiejszą datę w formularzu.");

  return {
    rawText,
    linesCount: getReceiptLines(rawText).length,
    date,
    amount: amount || localFallback.amount,
    amountSource: normalizeText(aiResult.amount_source ?? aiResult.zrodlo_kwoty) || "odpowiedź AI",
    amountConfidence: Number(aiResult.confidence ?? aiResult.pewnosc ?? 0.78) || 0.78,
    receiptNumber: normalizeText(aiResult.receipt_number ?? aiResult.document_number ?? aiResult.numer_paragonu ?? aiResult.numer_dokumentu) || localFallback.receiptNumber,
    seller: normalizeText(aiResult.seller ?? aiResult.sprzedawca ?? aiResult.store ?? aiResult.sklep) || localFallback.seller,
    categoryId,
    categoryLabel: getExpenseCategoryLabel(categoryId),
    categoryConfidence: Number(aiResult.category_confidence ?? aiResult.confidence ?? aiResult.pewnosc ?? 0.75) || 0.75,
    description: normalizeText(aiResult.description ?? aiResult.opis),
    analysisSource: "ai",
    warnings,
  };
}

function buildAiReceiptPrompt(receiptText) {
  const categories = getActiveExpenseCategoriesForAi();
  return [
    "Jesteś modułem księgowym do aplikacji Rady Rodziców.",
    "Przeanalizuj tekst paragonu/faktury skopiowany przez OCR.",
    "Zwróć wyłącznie poprawny JSON, bez markdown i bez komentarzy.",
    "Nie zgaduj na siłę. Jeżeli czegoś nie ma, użyj pustego stringa albo dodaj ostrzeżenie.",
    "Dostępne kategorie wydatków:",
    JSON.stringify(categories),
    "Format JSON:",
    JSON.stringify({
      amount: 0,
      date: "YYYY-MM-DD",
      receipt_number: "",
      seller: "",
      category_id: "",
      category_key: "",
      category_name: "",
      description: "krótki opis wydatku po polsku",
      confidence: 0.0,
      warnings: ["ostrzeżenie po polsku, jeśli jest potrzebne"],
    }),
    "Tekst paragonu/faktury:",
    receiptText,
  ].join("\n\n");
}

async function callAiChatCompletion(prompt, settings) {
  const response = await fetch(settings.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        { role: "system", content: "Odpowiadasz wyłącznie poprawnym JSON-em." },
        { role: "user", content: prompt },
      ],
      temperature: settings.temperature ?? 0.1,
    }),
  });

  const payloadText = await response.text();
  if (!response.ok) {
    throw new Error(`API AI zwróciło błąd ${response.status}: ${payloadText.slice(0, 240)}`);
  }

  let payload;
  try {
    payload = JSON.parse(payloadText);
  } catch (_error) {
    throw new Error("Odpowiedź API AI nie jest poprawnym JSON-em technicznym.");
  }

  const content = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.text;
  if (!content) throw new Error("API AI nie zwróciło treści odpowiedzi.");
  return extractJsonObjectFromText(content);
}

async function analyzeReceiptWithAi() {
  const settings = appState.ai.settings || loadAiSettings();
  if (!settings?.enabled || !settings.apiKey) {
    showToast("Najpierw skonfiguruj i włącz AI.");
    switchSection("ai");
    return null;
  }

  const receiptText = String($("#receiptText")?.value ?? "").trim();
  if (!receiptText) {
    showToast("Wklej tekst paragonu przed analizą AI.");
    return null;
  }

  appState.ai.isBusy = true;
  renderAiStatus();
  try {
    const aiRaw = await callAiChatCompletion(buildAiReceiptPrompt(receiptText), settings);
    const result = normalizeAiReceiptResult(aiRaw, receiptText);
    appState.receiptLastAnalysisSource = "ai";
    renderReceiptAnalysis(result);
    fillReceiptExpenseFields(result);
    if (result.description && $("#receiptExpenseDescription")) {
      $("#receiptExpenseDescription").value = result.description;
    }
    showToast("AI przeanalizowała tekst. Sprawdź dane przed zapisem.");
    return result;
  } finally {
    appState.ai.isBusy = false;
    renderAiStatus();
  }
}

function saveAiSettingsForm() {
  const settings = saveAiSettings({
    enabled: $("#aiEnabled")?.checked,
    endpoint: $("#aiEndpoint")?.value,
    model: $("#aiModel")?.value,
    apiKey: $("#aiApiKey")?.value,
    temperature: $("#aiTemperature")?.value,
  });
  renderAiStatus();
  showToast(settings.enabled ? "Ustawienia AI zapisane lokalnie." : "Ustawienia AI zapisane, ale AI jest wyłączone.");
}

async function testAiConnection() {
  saveAiSettingsForm();
  const settings = appState.ai.settings;
  if (!settings?.enabled || !settings.apiKey) throw new Error("AI jest wyłączone albo brakuje klucza API.");
  appState.ai.isBusy = true;
  renderAiStatus();
  try {
    const testResult = await callAiChatCompletion('Zwróć JSON: {"ok":true,"message":"działa"}', settings);
    const ok = Boolean(testResult.ok);
    appState.ai.lastTest = {
      ok,
      message: ok ? `Test AI OK. Model: ${settings.model}.` : "AI odpowiedziała, ale wynik testu nie ma pola ok=true.",
    };
    showToast(appState.ai.lastTest.message);
  } finally {
    appState.ai.isBusy = false;
    renderAiStatus();
  }
}

function setupAiActions() {
  $("#saveAiSettingsButton")?.addEventListener("click", saveAiSettingsForm);
  $("#testAiButton")?.addEventListener("click", () => {
    testAiConnection().catch((error) => {
      console.error(error);
      appState.ai.lastTest = { ok: false, message: error.message || "Test AI nie powiódł się." };
      renderAiStatus();
      showToast("Test AI nie powiódł się.");
    });
  });
  $("#clearAiSettingsButton")?.addEventListener("click", () => {
    const confirmed = window.confirm("Usunąć lokalnie zapisane ustawienia AI i klucz API z tej przeglądarki?");
    if (!confirmed) return;
    clearAiSettings();
    renderAiStatus();
    showToast("Ustawienia AI zostały usunięte z tego urządzenia.");
  });
}

function fillReceiptBudgetSelect() {
  fillBudgetSelectById("#receiptExpenseBudgetId");
}

function fillReceiptCategorySelect(currentValue = null) {
  fillCategorySelect("#receiptExpenseCategory", CATEGORY_TYPES.expense, currentValue || getDefaultCategoryId(CATEGORY_TYPES.expense, "other"));
}

function resetReceiptAnalysis() {
  const textArea = $("#receiptText");
  if (textArea) textArea.value = "";

  const summary = $("#receiptAnalysisSummary");
  if (summary) {
    summary.className = "receipt-analysis-summary empty-state";
    summary.innerHTML = "Wklej tekst paragonu i kliknij „Analizuj tekst”.";
  }

  const budget = $("#receiptExpenseBudgetId");
  if (budget) budget.value = getSchoolBudgetId();
  const amount = $("#receiptExpenseAmount");
  if (amount) amount.value = "";
  const date = $("#receiptExpenseDate");
  if (date) date.value = getTodayDate();
  fillReceiptCategorySelect(getDefaultCategoryId(CATEGORY_TYPES.expense, "other"));
  const number = $("#receiptExpenseNumber");
  if (number) number.value = "";
  const seller = $("#receiptExpenseSeller");
  if (seller) seller.value = "";
  const description = $("#receiptExpenseDescription");
  if (description) description.value = "";
  appState.receiptLastAnalysisSource = "local";
}

function renderReceiptAnalysis(result) {
  const summary = $("#receiptAnalysisSummary");
  if (!summary) return;

  const amountText = result.amount ? formatMoney(result.amount) : "nie rozpoznano";
  const dateText = result.date ? formatIsoDateToPl(result.date) : "nie rozpoznano";
  const confidencePercent = Math.round(Math.max(result.amountConfidence || 0, result.categoryConfidence || 0) * 100);
  const sourceLabel = result.analysisSource === "ai" ? "AI" : "lokalna";
  const warnings = result.warnings.length
    ? `<ul class="receipt-warning-list">${result.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>`
    : `<p class="receipt-ok-text">Nie wykryto istotnych ostrzeżeń.</p>`;

  summary.className = "receipt-analysis-summary receipt-result-box";
  summary.innerHTML = `
    <div class="receipt-result-grid">
      <div><span>Kwota</span><strong>${escapeHtml(amountText)}</strong></div>
      <div><span>Data</span><strong>${escapeHtml(dateText)}</strong></div>
      <div><span>Numer</span><strong>${escapeHtml(result.receiptNumber || "brak")}</strong></div>
      <div><span>Sprzedawca</span><strong>${escapeHtml(result.seller || "brak")}</strong></div>
      <div><span>Kategoria</span><strong>${escapeHtml(result.categoryLabel)}</strong></div>
      <div><span>Analiza</span><strong>${escapeHtml(sourceLabel)} ${confidencePercent}%</strong></div>
    </div>
    ${result.amountSource ? `<p class="receipt-source-line">Źródło kwoty: ${escapeHtml(result.amountSource)}</p>` : ""}
    ${warnings}
  `;
}

function fillReceiptExpenseFields(result) {
  const amount = $("#receiptExpenseAmount");
  const date = $("#receiptExpenseDate");
  const number = $("#receiptExpenseNumber");
  const seller = $("#receiptExpenseSeller");
  const description = $("#receiptExpenseDescription");

  if (amount) amount.value = result.amount || "";
  if (date) date.value = result.date || getTodayDate();
  fillReceiptCategorySelect(result.categoryId);
  if (number) number.value = result.receiptNumber || "";
  if (seller) seller.value = result.seller || "";
  if (description) {
    const parts = [
      result.categoryLabel ? `Wydatek: ${result.categoryLabel}` : "Wydatek z paragonu",
      result.seller ? `sprzedawca: ${result.seller}` : "",
      result.receiptNumber ? `dokument: ${result.receiptNumber}` : "",
    ].filter(Boolean);
    description.value = parts.join(", ");
  }
}

function analyzeReceiptFromForm() {
  const text = $("#receiptText")?.value ?? "";
  const result = analyzeReceiptText(text);
  appState.receiptLastAnalysisSource = "local";
  renderReceiptAnalysis(result);
  fillReceiptExpenseFields(result);

  if (result.warnings.length) {
    showToast("Analiza zakończona, ale sprawdź ostrzeżenia.");
    return result;
  }

  showToast("Tekst paragonu został przeanalizowany lokalnie.");
  return result;
}

function canReadClipboardText() {
  return Boolean(navigator.clipboard && typeof navigator.clipboard.readText === "function");
}

async function readReceiptTextFromClipboard() {
  if (!canReadClipboardText()) {
    throw new Error("Ta przeglądarka nie pozwala odczytać schowka. Wklej tekst ręcznie w pole paragonu.");
  }

  const text = String(await navigator.clipboard.readText()).replace(/\r\n/g, "\n").trim();
  if (!text) {
    throw new Error("Schowek jest pusty. Najpierw skopiuj tekst z Obiektywu Google albo aparatu.");
  }

  return text;
}

async function pasteReceiptTextFromClipboard({ analyze = false } = {}) {
  const textArea = $("#receiptText");
  if (!textArea) return;

  try {
    const text = await readReceiptTextFromClipboard();
    textArea.value = text;
    appState.receiptLastAnalysisSource = "local";

    if (analyze) {
      analyzeReceiptFromForm();
      return;
    }

    const summary = $("#receiptAnalysisSummary");
    if (summary) {
      summary.className = "receipt-analysis-summary empty-state";
      summary.innerHTML = "Tekst wklejony ze schowka. Kliknij „Analizuj lokalnie” albo „Analizuj AI”.";
    }
    showToast("Tekst paragonu wklejony ze schowka.");
  } catch (error) {
    textArea.focus();
    showToast(error.message || "Nie udało się odczytać schowka.");
  }
}

function getSharedReceiptTextFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("shareTarget") !== "receipt") return null;

  const parts = [params.get("text"), params.get("title"), params.get("url")]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean);

  return parts.join("\n").trim();
}

function clearShareTargetUrl() {
  if (!window.history?.replaceState) return;

  const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
  window.history.replaceState(null, document.title, cleanUrl);
}

function handleSharedReceiptTextOnLaunch() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("shareTarget") !== "receipt") return;

  const sharedText = getSharedReceiptTextFromUrl();
  switchSection("receipts");

  if (!sharedText) {
    const summary = $("#receiptAnalysisSummary");
    if (summary) {
      summary.className = "receipt-analysis-summary empty-state";
      summary.innerHTML = "Aplikacja została otwarta z udostępniania, ale nie odebrała tekstu. Skopiuj tekst z Obiektywu Google i użyj przycisku „Wklej i analizuj”.";
    }
    clearShareTargetUrl();
    showToast("Nie odebrano tekstu paragonu z udostępniania.");
    return;
  }

  const textArea = $("#receiptText");
  if (textArea) textArea.value = sharedText;
  appState.receiptLastAnalysisSource = "local";
  analyzeReceiptFromForm();
  clearShareTargetUrl();
  showToast("Odebrano tekst z udostępniania i przeanalizowano lokalnie.");
}

function copyReceiptToExpenseForm() {
  const amount = normalizeMoney($("#receiptExpenseAmount")?.value);
  const budgetId = $("#receiptExpenseBudgetId")?.value || getSchoolBudgetId();
  const categoryId = $("#receiptExpenseCategory")?.value || getDefaultCategoryId(CATEGORY_TYPES.expense, "other");

  $("#expenseId").value = "";
  $("#expenseBudgetId").value = budgetId;
  $("#expenseAmount").value = amount || "";
  $("#expenseDate").value = $("#receiptExpenseDate")?.value || getTodayDate();
  fillCategorySelect("#expenseCategory", CATEGORY_TYPES.expense, categoryId);
  $("#expenseReceiptNumber").value = normalizeText($("#receiptExpenseNumber")?.value);
  $("#expenseSeller").value = normalizeText($("#receiptExpenseSeller")?.value);
  $("#expensePaidBy").value = "";
  $("#expenseDescription").value = normalizeText($("#receiptExpenseDescription")?.value) || "Wydatek z paragonu";
  $("#expenseFormTitle").textContent = "Dodaj wydatek z paragonu";
  switchSection("expenses");
  showToast("Dane z paragonu przeniesiono do formularza wydatku.");
}

async function saveReceiptExpense(event) {
  event.preventDefault();

  const budgetId = $("#receiptExpenseBudgetId")?.value;
  const budget = getBudgetById(budgetId);
  const amount = normalizeMoney($("#receiptExpenseAmount")?.value);
  const date = $("#receiptExpenseDate")?.value || getTodayDate();
  const categoryId = $("#receiptExpenseCategory")?.value || getDefaultCategoryId(CATEGORY_TYPES.expense, "other");
  const receiptNumber = normalizeText($("#receiptExpenseNumber")?.value);
  const seller = normalizeText($("#receiptExpenseSeller")?.value);
  const description = normalizeText($("#receiptExpenseDescription")?.value) || "Wydatek z tekstu paragonu";

  if (!budget) {
    showToast("Wybierz budżet wydatku.");
    return;
  }

  if (!requirePermission(canManageBudgetId(budgetId), "Nie masz uprawnień do zapisu wydatków w tym budżecie.")) return;

  if (amount <= 0) {
    showToast("Brakuje poprawnej kwoty wydatku.");
    return;
  }

  const expense = {
    id: makeId("expense"),
    schoolYearId: appState.activeSchoolYearId,
    budgetId,
    budgetType: budget.type,
    classId: budget.type === BUDGET_TYPES.class ? budget.classId : null,
    amount,
    date,
    category: getCategoryByIdOrKey(CATEGORY_TYPES.expense, categoryId)?.key || categoryId,
    categoryId,
    categoryLabel: getExpenseCategoryLabel(categoryId),
    receiptNumber,
    seller,
    paidBy: "",
    description,
    source: appState.receiptLastAnalysisSource === "ai" ? "receipt_text_ai_assisted" : "receipt_text_local_parser",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  await RRDatabase.put(RR_STORES.expenses, expense);
  await loadData();
  renderAll();
  showToast("Wydatek z paragonu został zapisany.");
}

function renderReceipts() {
  fillReceiptBudgetSelect();
  fillReceiptCategorySelect($("#receiptExpenseCategory")?.value || getDefaultCategoryId(CATEGORY_TYPES.expense, "other"));
  if ($("#receiptExpenseDate") && !$("#receiptExpenseDate").value) {
    $("#receiptExpenseDate").value = getTodayDate();
  }
}


async function saveExpense(event) {
  event.preventDefault();

  const id = $("#expenseId").value || makeId("expense");
  const budgetId = $("#expenseBudgetId").value;
  const budget = getBudgetById(budgetId);
  const amount = normalizeMoney($("#expenseAmount").value);
  const date = $("#expenseDate").value || getTodayDate();
  const categoryId = $("#expenseCategory").value || getDefaultCategoryId(CATEGORY_TYPES.expense, "other");
  const receiptNumber = normalizeText($("#expenseReceiptNumber").value);
  const seller = normalizeText($("#expenseSeller").value);
  const paidBy = normalizeText($("#expensePaidBy").value);
  const description = normalizeText($("#expenseDescription").value);
  const existing = appState.expenses.find((expense) => expense.id === id);

  if (!budget) {
    showToast("Wybierz budżet wydatku.");
    return;
  }

  if (!requirePermission(canManageBudgetId(budgetId), "Nie masz uprawnień do zapisu wydatków w tym budżecie.")) return;

  if (amount <= 0) {
    showToast("Podaj kwotę wydatku większą od zera.");
    return;
  }

  if (!description && !seller && !receiptNumber) {
    showToast("Wpisz opis, sprzedawcę albo numer paragonu/faktury.");
    return;
  }

  const expense = {
    id,
    schoolYearId: appState.activeSchoolYearId,
    budgetId,
    budgetType: budget.type,
    classId: budget.type === BUDGET_TYPES.class ? budget.classId : null,
    amount,
    date,
    category: getCategoryByIdOrKey(CATEGORY_TYPES.expense, categoryId)?.key || categoryId,
    categoryId,
    categoryLabel: getExpenseCategoryLabel(categoryId),
    receiptNumber,
    seller,
    paidBy,
    description,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await RRDatabase.put(RR_STORES.expenses, expense);
  resetExpenseForm();
  await loadData();
  renderAll();
  showToast("Wydatek został zapisany.");
}

function fillExpenseForm(expenseId) {
  const expense = appState.expenses.find((item) => item.id === expenseId);
  if (!expense) return;

  $("#expenseId").value = expense.id;
  $("#expenseBudgetId").value = expense.budgetId;
  $("#expenseAmount").value = expense.amount || "";
  $("#expenseDate").value = expense.date || getTodayDate();
  fillCategorySelect("#expenseCategory", CATEGORY_TYPES.expense, expense.categoryId || expense.category || getDefaultCategoryId(CATEGORY_TYPES.expense, "other"));
  $("#expenseReceiptNumber").value = expense.receiptNumber || "";
  $("#expenseSeller").value = expense.seller || "";
  $("#expensePaidBy").value = expense.paidBy || "";
  $("#expenseDescription").value = expense.description || "";
  $("#expenseFormTitle").textContent = "Edytuj wydatek";
  switchSection("expenses");
}

async function deleteExpense(expenseId) {
  const expense = appState.expenses.find((item) => item.id === expenseId);
  if (!expense) return;
  if (!requirePermission(canManageBudgetId(expense.budgetId), "Nie masz uprawnień do usunięcia tego wydatku.")) return;

  const confirmed = window.confirm(`Usunąć wydatek ${formatMoney(expense.amount)} z dnia ${expense.date}?`);
  if (!confirmed) return;

  await RRDatabase.remove(RR_STORES.expenses, expenseId);
  await loadData();
  renderAll();
  showToast("Wydatek został usunięty.");
}


function resetCategoryForm() {
  const form = $("#categoryForm");
  if (!form) return;
  $("#categoryId").value = "";
  $("#categoryType").value = CATEGORY_TYPES.expense;
  $("#categoryName").value = "";
  $("#categoryActive").checked = true;
  $("#categoryFormTitle").textContent = "Dodaj kategorię";
}

function getCategoryTypeLabel(type) {
  return type === CATEGORY_TYPES.payment ? "Wpłata" : "Wydatek";
}

function renderCategoryGroup(type) {
  const categories = getCategoriesByType(type, false);
  if (categories.length === 0) {
    return `<div class="empty-state">Brak kategorii.</div>`;
  }

  return categories.map((category) => `
    <div class="entity-row category-row" data-category-id="${escapeHtml(category.id)}">
      <div>
        <div class="entity-title">
          <span>${escapeHtml(category.name)}</span>
          <span class="category-badge">${escapeHtml(getCategoryTypeLabel(category.type))}</span>
          ${category.isSystem ? `<span class="budget-badge">domyślna</span>` : ""}
          ${category.isActive ? "" : `<span class="inactive-badge">nieaktywna</span>`}
        </div>
        <div class="entity-meta">
          <span>Rok: ${escapeHtml(getActiveSchoolYearName())}</span>
          <span>Używana w: ${escapeHtml(category.type === CATEGORY_TYPES.payment ? "wpłatach" : "wydatkach")}</span>
        </div>
      </div>
      <div class="entity-actions">
        <button class="small-button" data-action="edit-category" type="button">Edytuj</button>
        <button class="small-button danger-action" data-action="delete-category" type="button">Usuń</button>
      </div>
    </div>
  `).join("");
}

function renderCategories() {
  const paymentList = $("#paymentCategoryList");
  const expenseList = $("#expenseCategoryList");
  const counter = $("#categoriesCount");
  if (!paymentList || !expenseList) return;

  paymentList.innerHTML = renderCategoryGroup(CATEGORY_TYPES.payment);
  expenseList.innerHTML = renderCategoryGroup(CATEGORY_TYPES.expense);
  if (counter) counter.textContent = String(appState.categories.length);
}

async function saveCategory(event) {
  event.preventDefault();

  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może edytować kategorie.")) return;

  const id = $("#categoryId").value || makeId("category");
  const type = $("#categoryType").value;
  const name = normalizeText($("#categoryName").value);
  const isActive = $("#categoryActive").checked;
  const existing = appState.categories.find((category) => category.id === id);

  if (!Object.values(CATEGORY_TYPES).includes(type)) {
    showToast("Wybierz typ kategorii.");
    return;
  }

  if (!name) {
    showToast("Podaj nazwę kategorii.");
    return;
  }

  const duplicate = appState.categories.some((category) => (
    category.id !== id
    && category.type === type
    && category.name.toLowerCase() === name.toLowerCase()
  ));

  if (duplicate) {
    showToast("Taka kategoria już istnieje w tym roku szkolnym.");
    return;
  }

  const category = {
    id,
    schoolYearId: appState.activeSchoolYearId,
    type,
    key: existing?.key ?? `custom_${id}`,
    name,
    isSystem: existing?.isSystem ?? false,
    isActive,
    sortOrder: existing?.sortOrder ?? 500,
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };

  await RRDatabase.put(RR_STORES.categories, category);
  resetCategoryForm();
  await loadData();
  renderAll();
  showToast("Kategoria została zapisana.");
}

function fillCategoryForm(categoryId) {
  const category = appState.categories.find((item) => item.id === categoryId);
  if (!category) return;

  $("#categoryId").value = category.id;
  $("#categoryType").value = category.type;
  $("#categoryName").value = category.name;
  $("#categoryActive").checked = category.isActive;
  $("#categoryFormTitle").textContent = `Edytuj kategorię: ${category.name}`;
  switchSection("categories");
}

function isCategoryUsed(category) {
  if (category.type === CATEGORY_TYPES.payment) {
    return appState.payments.some((payment) => payment.categoryId === category.id || payment.category === category.key);
  }
  return appState.expenses.some((expense) => expense.categoryId === category.id || expense.category === category.key);
}

async function deleteCategory(categoryId) {
  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może usuwać kategorie.")) return;

  const category = appState.categories.find((item) => item.id === categoryId);
  if (!category) return;

  if (isCategoryUsed(category)) {
    showToast("Tej kategorii nie można usunąć, bo jest używana w zapisach. Możesz ją wyłączyć.");
    return;
  }

  if (category.isSystem) {
    showToast("Domyślnej kategorii nie usuwamy. Możesz ją wyłączyć, żeby nie pojawiała się w formularzu.");
    return;
  }

  const confirmed = window.confirm(`Usunąć kategorię: ${category.name}?`);
  if (!confirmed) return;

  await RRDatabase.remove(RR_STORES.categories, categoryId);
  resetCategoryForm();
  await loadData();
  renderAll();
  showToast("Kategoria została usunięta.");
}

function setupCategoryActions() {
  const form = $("#categoryForm");
  const list = $("#categoriesPanel");
  const resetButton = $("#resetCategoryFormButton");

  form?.addEventListener("submit", (event) => {
    saveCategory(event).catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać kategorii.");
    });
  });

  resetButton?.addEventListener("click", resetCategoryForm);

  list?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = event.target.closest("[data-category-id]");
    const categoryId = row?.dataset.categoryId;
    if (!categoryId) return;

    if (button.dataset.action === "edit-category") {
      fillCategoryForm(categoryId);
      return;
    }

    if (button.dataset.action === "delete-category") {
      deleteCategory(categoryId).catch((error) => {
        console.error(error);
        showToast("Nie udało się usunąć kategorii.");
      });
    }
  });
}

function setupReceiptActions() {
  const analyzeButton = $("#analyzeReceiptButton");
  const pasteButton = $("#pasteReceiptClipboardButton");
  const pasteAnalyzeButton = $("#pasteAnalyzeReceiptClipboardButton");
  const clearButton = $("#clearReceiptButton");
  const copyButton = $("#copyReceiptToExpenseButton");
  const aiButton = $("#analyzeReceiptAiButton");
  const form = $("#receiptExpenseForm");

  pasteButton?.addEventListener("click", () => {
    pasteReceiptTextFromClipboard().catch((error) => {
      console.error(error);
      showToast("Nie udało się wkleić tekstu ze schowka.");
    });
  });
  pasteAnalyzeButton?.addEventListener("click", () => {
    pasteReceiptTextFromClipboard({ analyze: true }).catch((error) => {
      console.error(error);
      showToast("Nie udało się wkleić i przeanalizować tekstu ze schowka.");
    });
  });
  analyzeButton?.addEventListener("click", analyzeReceiptFromForm);
  aiButton?.addEventListener("click", () => {
    analyzeReceiptWithAi().catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się przeanalizować paragonu przez AI.");
    });
  });
  clearButton?.addEventListener("click", () => {
    resetReceiptAnalysis();
    showToast("Dane analizy paragonu zostały wyczyszczone.");
  });
  copyButton?.addEventListener("click", copyReceiptToExpenseForm);
  form?.addEventListener("submit", (event) => {
    saveReceiptExpense(event).catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać wydatku z paragonu.");
    });
  });
}

function setupDashboardActions() {
  const budgetFilter = $("#dashboardBudgetFilter");
  const dateFrom = $("#dashboardDateFrom");
  const dateTo = $("#dashboardDateTo");
  const resetButton = $("#resetDashboardFiltersButton");

  budgetFilter?.addEventListener("change", updateDashboard);
  dateFrom?.addEventListener("change", updateDashboard);
  dateTo?.addEventListener("change", updateDashboard);
  resetButton?.addEventListener("click", () => {
    if (budgetFilter) budgetFilter.value = "all";
    if (dateFrom) dateFrom.value = "";
    if (dateTo) dateTo.value = "";
    updateDashboard();
    showToast("Filtry pulpitu zostały wyczyszczone.");
  });
}

function setupExpenseActions() {
  $("#expenseForm").addEventListener("submit", (event) => {
    saveExpense(event).catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać wydatku.");
    });
  });

  $("#resetExpenseFormButton").addEventListener("click", resetExpenseForm);

  $("#expenseList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = event.target.closest("[data-expense-id]");
    const expenseId = row?.dataset.expenseId;
    if (!expenseId) return;

    if (button.dataset.action === "edit-expense") {
      fillExpenseForm(expenseId);
      return;
    }

    if (button.dataset.action === "delete-expense") {
      deleteExpense(expenseId).catch((error) => {
        console.error(error);
        showToast("Nie udało się usunąć wydatku.");
      });
    }
  });
}

function setupPaymentActions() {
  $("#paymentForm").addEventListener("submit", (event) => {
    savePayment(event).catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać wpłaty.");
    });
  });

  $("#resetPaymentFormButton").addEventListener("click", resetPaymentForm);

  $("#paymentBudgetId").addEventListener("change", () => {
    syncPaymentBudgetFields();
    renderPaymentControl();
  });

  $("#paymentClassId").addEventListener("change", () => {
    fillStudentSelect();
    renderPaymentControl();
  });

  $("#paymentStudentId").addEventListener("change", renderPaymentControl);

  $("#paymentList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = event.target.closest("[data-payment-id]");
    const paymentId = row?.dataset.paymentId;
    if (!paymentId) return;

    if (button.dataset.action === "edit-payment") {
      fillPaymentForm(paymentId);
      return;
    }

    if (button.dataset.action === "delete-payment") {
      deletePayment(paymentId).catch((error) => {
        console.error(error);
        showToast("Nie udało się usunąć wpłaty.");
      });
    }
  });
}

function setupClassActions() {
  $("#classForm").addEventListener("submit", (event) => {
    saveClass(event).catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać klasy.");
    });
  });

  $("#resetClassFormButton").addEventListener("click", resetClassForm);
  $("#newClassButton").addEventListener("click", () => {
    resetClassForm();
    switchSection("classes");
    $("#className").focus();
  });

  $("#classList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = event.target.closest("[data-class-id]");
    const classId = row?.dataset.classId;
    if (!classId) return;

    if (button.dataset.action === "select-class") {
      appState.selectedClassId = classId;
      resetStudentForm();
      renderAll();
      return;
    }

    if (button.dataset.action === "edit-class") {
      appState.selectedClassId = classId;
      fillClassForm(classId);
      renderAll();
      return;
    }

    if (button.dataset.action === "delete-class") {
      deleteClass(classId).catch((error) => {
        console.error(error);
        showToast("Nie udało się usunąć klasy.");
      });
    }
  });
}

function setupStudentActions() {
  $("#studentForm").addEventListener("submit", (event) => {
    saveStudent(event).catch((error) => {
      console.error(error);
      showToast("Nie udało się zapisać ucznia.");
    });
  });

  $("#resetStudentFormButton").addEventListener("click", resetStudentForm);

  $("#studentList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const row = event.target.closest("[data-student-id]");
    const studentId = row?.dataset.studentId;
    if (!studentId) return;

    if (button.dataset.action === "edit-student") {
      fillStudentForm(studentId);
      return;
    }

    if (button.dataset.action === "delete-student") {
      deleteStudent(studentId).catch((error) => {
        console.error(error);
        showToast("Nie udało się usunąć ucznia.");
      });
    }
  });
}


async function addSchoolYearFromPrompt() {
  if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może dodawać lata szkolne.")) return;

  const years = [...appState.schoolYears].sort((a, b) => Number(b.startYear) - Number(a.startYear));
  const nextStartYear = years.length > 0 ? Number(years[0].startYear) + 1 : getDefaultSchoolYearStartYear();
  const proposedName = makeSchoolYearName(nextStartYear);
  const value = window.prompt("Podaj rok szkolny w formacie RRRR/RRRR, np. 2026/2027:", proposedName);
  if (value === null) return;

  const schoolYear = parseSchoolYearInput(value);
  if (!schoolYear) {
    showToast("Nieprawidłowy format roku. Użyj np. 2026/2027.");
    return;
  }

  const exists = appState.schoolYears.some((year) => year.id === schoolYear.id);
  if (exists) {
    appState.activeSchoolYearId = schoolYear.id;
    localStorage.setItem(SCHOOL_YEAR_STORAGE_KEY, schoolYear.id);
    appState.selectedClassId = null;
    resetClassForm();
    resetStudentForm();
    resetPaymentForm();
    resetExpenseForm();
    resetCategoryForm();
    resetReceiptAnalysis();
    resetImportPreview();
    await loadData();
    renderAll();
    showToast(`Przełączono na rok ${schoolYear.name}.`);
    return;
  }

  await RRDatabase.put(RR_STORES.schoolYears, schoolYear);
  appState.activeSchoolYearId = schoolYear.id;
  localStorage.setItem(SCHOOL_YEAR_STORAGE_KEY, schoolYear.id);
  appState.selectedClassId = null;
  resetClassForm();
  resetStudentForm();
  resetPaymentForm();
  resetExpenseForm();
  resetCategoryForm();
  resetReceiptAnalysis();
  resetImportPreview();
  await loadData();
  renderAll();
  showToast(`Dodano rok szkolny ${schoolYear.name}.`);
}

function setupSchoolYearActions() {
  const select = $("#schoolYearSelect");
  const addButton = $("#addSchoolYearButton");

  select?.addEventListener("change", async () => {
    appState.activeSchoolYearId = select.value;
    localStorage.setItem(SCHOOL_YEAR_STORAGE_KEY, appState.activeSchoolYearId);
    appState.selectedClassId = null;
    resetClassForm();
    resetStudentForm();
    resetPaymentForm();
    resetExpenseForm();
    resetCategoryForm();
    resetReceiptAnalysis();
    resetImportPreview();
    await loadData();
    renderAll();
    showToast(`Przełączono rok szkolny: ${getActiveSchoolYearName()}.`);
  });

  addButton?.addEventListener("click", () => {
    addSchoolYearFromPrompt().catch((error) => {
      console.error(error);
      showToast("Nie udało się dodać roku szkolnego.");
    });
  });
}

function renderAppVersionInfo() {
  const info = $("#appVersionInfo");
  if (!info) return;
  info.textContent = `Wersja: ${APP_VERSION}. Build: ${APP_BUILD}. Cache: ${CACHE_NAME}.`;
}

async function clearBrowserAppCacheAndReload() {
  const confirmed = window.confirm("Wyczyścić cache aplikacji i przeładować najnowszą wersję z serwera? Dane finansowe, konfiguracja Firebase i kopie lokalne nie zostaną usunięte.");
  if (!confirmed) return;

  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch (error) {
    console.warn("Nie udało się wyczyścić całego cache aplikacji:", error);
  }

  window.location.replace(`./index.html?v=${encodeURIComponent(APP_CACHE_BUSTER)}&fresh=${Date.now()}`);
}

function openCacheReloadFile() {
  window.location.href = `./reload-cache.html?v=${encodeURIComponent(APP_CACHE_BUSTER)}&fresh=${Date.now()}`;
}

function setupSettingsActions() {
  renderAppVersionInfo();

  $("#refreshAppCacheButton")?.addEventListener("click", () => {
    clearBrowserAppCacheAndReload().catch((error) => {
      console.error(error);
      showToast("Nie udało się przeładować cache aplikacji.");
    });
  });

  $("#openCacheReloadFileButton")?.addEventListener("click", openCacheReloadFile);

  $("#runDataAuditButton")?.addEventListener("click", () => {
    runFullDataAudit().catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się wykonać kontroli danych.");
    });
  });

  $("#exportBackupButton")?.addEventListener("click", () => {
    exportJsonBackup().catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się pobrać kopii JSON.");
    });
  });

  $("#importBackupButton")?.addEventListener("click", () => {
    $("#importBackupInput")?.click();
  });

  $("#importBackupInput")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0] || null;
    importJsonBackupFromFile(file).catch((error) => {
      console.error(error);
      showToast(error.message || "Nie udało się przywrócić kopii JSON.");
    }).finally(() => {
      event.target.value = "";
    });
  });

  $("#clearLocalDataButton").addEventListener("click", async () => {
    if (!requirePermission(canManageGlobalData(), "Tylko skarbnik Rady Rodziców może czyścić dane lokalne.")) return;

    const confirmed = window.confirm("Na pewno usunąć lokalne lata szkolne, klasy, uczniów, budżety, kategorie, wpłaty i wydatki z tej przeglądarki?");
    if (!confirmed) return;

    await RRDatabase.clearAll();
    localStorage.removeItem(SCHOOL_YEAR_STORAGE_KEY);
    appState.schoolYears = [];
    appState.activeSchoolYearId = null;
    appState.selectedClassId = null;
    resetClassForm();
    resetStudentForm();
    resetPaymentForm();
    resetExpenseForm();
    resetCategoryForm();
    resetReceiptAnalysis();
    resetImportPreview();
    await loadData();
    renderAll();
    showToast("Dane lokalne zostały usunięte.");
  });
}

async function boot() {
  document.title = `eSkarbnik ${APP_VERSION}`;
  const versionBadge = $("#versionBadge");
  if (versionBadge) {
    versionBadge.textContent = APP_VERSION;
    versionBadge.title = `Build: ${APP_BUILD}`;
  }

  setupNavigation();
  setupDashboardActions();
  setupSchoolYearActions();
  setupConnectionStatus();
  setupInstallButton();
  setupClassActions();
  setupStudentActions();
  setupPaymentActions();
  setupExpenseActions();
  setupCategoryActions();
  setupReceiptActions();
  setupReportsActions();
  setupImportActions();
  setupSyncActions();
  setupAuthActions();
  setupAiActions();
  setupSettingsActions();

  try {
    appState.firebaseSync.settings = loadFirebaseSyncSettings();
    appState.ai.settings = loadAiSettings();
    await initializeAuthListenerIfPossible();
    await loadData();
    setDbStatus("Baza: OK", true);
    renderAll();
    resetPaymentForm();
    resetExpenseForm();
    resetCategoryForm();
    resetReceiptAnalysis();
    resetImportPreview();
    renderSyncStatus();
    renderAiStatus();
    handleSharedReceiptTextOnLaunch();
  } catch (error) {
    console.error(error);
    setDbStatus("Baza: błąd", false);
    $("#storageStatus").textContent = "Nie udało się uruchomić IndexedDB.";
    showToast("Błąd lokalnej bazy danych.");
  }

  registerServiceWorker();
  console.info(`eSkarbnik ${APP_VERSION} | ${APP_BUILD}`);
  console.info(`Cache: ${CACHE_NAME}`);
}

window.addEventListener("DOMContentLoaded", boot);
