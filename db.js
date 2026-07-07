const RR_DB_NAME = "rada_rodzicow_pro";
const RR_DB_VERSION = 7;

const RR_STORES = {
  schoolYears: "schoolYears",
  classes: "classes",
  students: "students",
  budgets: "budgets",
  payments: "payments",
  expenses: "expenses",
  categories: "categories",
};

function ensureIndex(store, indexName, keyPath, options = { unique: false }) {
  if (!store.indexNames.contains(indexName)) {
    store.createIndex(indexName, keyPath, options);
  }
}

function openRRDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Ta przeglądarka nie obsługuje IndexedDB."));
      return;
    }

    const request = indexedDB.open(RR_DB_NAME, RR_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      const transaction = request.transaction;

      let schoolYearStore;
      if (!db.objectStoreNames.contains(RR_STORES.schoolYears)) {
        schoolYearStore = db.createObjectStore(RR_STORES.schoolYears, { keyPath: "id" });
      } else {
        schoolYearStore = transaction.objectStore(RR_STORES.schoolYears);
      }
      ensureIndex(schoolYearStore, "name", "name");
      ensureIndex(schoolYearStore, "startYear", "startYear");
      ensureIndex(schoolYearStore, "isActive", "isActive");
      ensureIndex(schoolYearStore, "updatedAt", "updatedAt");

      let classStore;
      if (!db.objectStoreNames.contains(RR_STORES.classes)) {
        classStore = db.createObjectStore(RR_STORES.classes, { keyPath: "id" });
      } else {
        classStore = transaction.objectStore(RR_STORES.classes);
      }
      ensureIndex(classStore, "schoolYearId", "schoolYearId");
      ensureIndex(classStore, "name", "name");
      ensureIndex(classStore, "updatedAt", "updatedAt");

      let studentStore;
      if (!db.objectStoreNames.contains(RR_STORES.students)) {
        studentStore = db.createObjectStore(RR_STORES.students, { keyPath: "id" });
      } else {
        studentStore = transaction.objectStore(RR_STORES.students);
      }
      ensureIndex(studentStore, "schoolYearId", "schoolYearId");
      ensureIndex(studentStore, "classId", "classId");
      ensureIndex(studentStore, "fullName", "fullName");
      ensureIndex(studentStore, "isActive", "isActive");

      let budgetStore;
      if (!db.objectStoreNames.contains(RR_STORES.budgets)) {
        budgetStore = db.createObjectStore(RR_STORES.budgets, { keyPath: "id" });
      } else {
        budgetStore = transaction.objectStore(RR_STORES.budgets);
      }
      ensureIndex(budgetStore, "schoolYearId", "schoolYearId");
      ensureIndex(budgetStore, "type", "type");
      ensureIndex(budgetStore, "classId", "classId");
      ensureIndex(budgetStore, "name", "name");
      ensureIndex(budgetStore, "updatedAt", "updatedAt");

      let paymentStore;
      if (!db.objectStoreNames.contains(RR_STORES.payments)) {
        paymentStore = db.createObjectStore(RR_STORES.payments, { keyPath: "id" });
      } else {
        paymentStore = transaction.objectStore(RR_STORES.payments);
      }
      ensureIndex(paymentStore, "schoolYearId", "schoolYearId");
      ensureIndex(paymentStore, "budgetId", "budgetId");
      ensureIndex(paymentStore, "classId", "classId");
      ensureIndex(paymentStore, "studentId", "studentId");
      ensureIndex(paymentStore, "date", "date");
      ensureIndex(paymentStore, "method", "method");
      ensureIndex(paymentStore, "updatedAt", "updatedAt");

      let expenseStore;
      if (!db.objectStoreNames.contains(RR_STORES.expenses)) {
        expenseStore = db.createObjectStore(RR_STORES.expenses, { keyPath: "id" });
      } else {
        expenseStore = transaction.objectStore(RR_STORES.expenses);
      }
      ensureIndex(expenseStore, "schoolYearId", "schoolYearId");
      ensureIndex(expenseStore, "budgetId", "budgetId");
      ensureIndex(expenseStore, "classId", "classId");
      ensureIndex(expenseStore, "date", "date");
      ensureIndex(expenseStore, "category", "category");
      ensureIndex(expenseStore, "receiptNumber", "receiptNumber");
      ensureIndex(expenseStore, "updatedAt", "updatedAt");

      let categoryStore;
      if (!db.objectStoreNames.contains(RR_STORES.categories)) {
        categoryStore = db.createObjectStore(RR_STORES.categories, { keyPath: "id" });
      } else {
        categoryStore = transaction.objectStore(RR_STORES.categories);
      }
      ensureIndex(categoryStore, "schoolYearId", "schoolYearId");
      ensureIndex(categoryStore, "type", "type");
      ensureIndex(categoryStore, "name", "name");
      ensureIndex(categoryStore, "isActive", "isActive");
      ensureIndex(categoryStore, "updatedAt", "updatedAt");
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Nie udało się otworzyć bazy IndexedDB."));
  });
}

const RRDatabase = (() => {
  let dbPromise = null;

  function getDb() {
    if (!dbPromise) dbPromise = openRRDatabase();
    return dbPromise;
  }

  async function getAll(storeName) {
    const db = await getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => reject(request.error);
    });
  }

  async function put(storeName, value) {
    const db = await getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  async function remove(storeName, id) {
    const db = await getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async function removeByIndex(storeName, indexName, value) {
    const db = await getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.openCursor(IDBKeyRange.only(value));

      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        cursor.delete();
        cursor.continue();
      };

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  function removeStudentsByClass(classId) {
    return removeByIndex(RR_STORES.students, "classId", classId);
  }

  function removeBudgetsByClass(classId) {
    return removeByIndex(RR_STORES.budgets, "classId", classId);
  }

  function removePaymentsByClass(classId) {
    return removeByIndex(RR_STORES.payments, "classId", classId);
  }

  function removePaymentsByStudent(studentId) {
    return removeByIndex(RR_STORES.payments, "studentId", studentId);
  }

  function removeExpensesByClass(classId) {
    return removeByIndex(RR_STORES.expenses, "classId", classId);
  }

  function removeExpensesByBudget(budgetId) {
    return removeByIndex(RR_STORES.expenses, "budgetId", budgetId);
  }

  async function clearAll() {
    const db = await getDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([
        RR_STORES.schoolYears,
        RR_STORES.classes,
        RR_STORES.students,
        RR_STORES.budgets,
        RR_STORES.payments,
        RR_STORES.expenses,
        RR_STORES.categories,
      ], "readwrite");
      transaction.objectStore(RR_STORES.schoolYears).clear();
      transaction.objectStore(RR_STORES.classes).clear();
      transaction.objectStore(RR_STORES.students).clear();
      transaction.objectStore(RR_STORES.budgets).clear();
      transaction.objectStore(RR_STORES.payments).clear();
      transaction.objectStore(RR_STORES.expenses).clear();
      transaction.objectStore(RR_STORES.categories).clear();

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  return {
    getAll,
    put,
    remove,
    removeStudentsByClass,
    removeBudgetsByClass,
    removePaymentsByClass,
    removePaymentsByStudent,
    removeExpensesByClass,
    removeExpensesByBudget,
    clearAll,
  };
})();
