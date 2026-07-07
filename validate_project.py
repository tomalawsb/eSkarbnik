from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REQUIRED_FILES = [
    "index.html",
    "style.css",
    "db.js",
    "app.js",
    "manifest.json",
    "service-worker.js",
    "reload-cache.html",
    "version.json",
    "assets/icons/icon-192.png",
    "assets/icons/icon-512.png",
    "assets/icons/maskable-icon-192.png",
    "assets/icons/maskable-icon-512.png",
    "assets/logo-eskarbnik-full.png",
    "assets/logo-eskarbnik-icon.png",
    "scripts/run_local_server.ps1",
    "scripts/upload_to_github.ps1",
    "firebase-firestore-rules-example.txt",
    "firebase.json",
    "firestore.rules",
    "firestore.bootstrap.rules",
    "firestore.indexes.json",
    ".firebaserc.example",
    ".gitignore",
    "PUBLISHING.md",
    "SECURITY_CHECKLIST.md",
    "scripts/deploy_firebase.ps1",
    "scripts/publish_to_github.ps1",
    "scripts/check_before_deploy.ps1",
    ".github/workflows/firebase-hosting.yml",
]
REQUIRED_HTML_MARKERS = [
    "id=\"classForm\"",
    "id=\"studentForm\"",
    "id=\"classList\"",
    "id=\"studentList\"",
    "id=\"budgetList\"",
    "id=\"paymentForm\"",
    "id=\"paymentBudgetId\"",
    "id=\"paymentControlList\"",
    "id=\"expenseForm\"",
    "id=\"expenseBudgetId\"",
    "id=\"expenseList\"",
    "id=\"expenseBalanceList\"",
    "data-section=\"expenses\"",
    "IndexedDB",
    "id=\"schoolYearSelect\"",
    "id=\"addSchoolYearButton\"",
    "dashboardSchoolYearName",
    "id=\"dashboardBudgetFilter\"",
    "id=\"dashboardBudgetList\"",
    "id=\"dashboardMissingClassesList\"",
    "id=\"dashboardRecentActivityList\"",
    "id=\"reportType\"",
    "id=\"reportBudgetFilter\"",
    "id=\"exportCsvButton\"",
    "id=\"exportXlsxButton\"",
    "id=\"exportPdfButton\"",
    "id=\"reportsPreview\"",
    "id=\"runDataAuditButton\"",
    "id=\"exportBackupButton\"",
    "id=\"importBackupButton\"",
    "id=\"dataAuditStatus\"",
]
REQUIRED_APP_MARKERS = [
    "SCHOOL_YEAR_STORAGE_KEY",
    "getSchoolBudgetId",
    "ensureSchoolYears",
    "migrateLegacyData",
    "createClassBudget",
    "ensureBudgetConsistency",
    "renderBudgets",
    "savePayment",
    "renderPaymentControl",
    "setupPaymentActions",
    "sumExpenses",
    "fillDashboardBudgetFilter",
    "renderDashboardBudgetList",
    "renderDashboardMissingClassesList",
    "renderDashboardRecentActivity",
    "setupDashboardActions",
    "saveExpense",
    "renderExpenseList",
    "setupExpenseActions",
    "CATEGORY_TYPES",
    "ensureCategoryConsistency",
    "renderCategories",
    "saveCategory",
    "setupCategoryActions",
    "getPaymentCategoryLabel",
    "getExpenseCategoryLabel",
    "RECEIPT_CATEGORY_KEYWORDS",
    "analyzeReceiptText",
    "findReceiptAmount",
    "findReceiptDate",
    "saveReceiptExpense",
    "setupReceiptActions",
    "renderReceipts",
    "renderReports",
    "buildSummaryRows",
    "buildPaymentRows",
    "buildExpenseRows",
    "buildMissingRows",
    "buildBalanceRows",
    "exportReportCsv",
    "exportReportXlsx",
    "exportReportPdf",
    "setupReportsActions",
    "parseXlsxWorkbook",
    "analyzeExcelImport",
    "saveExcelImport",
    "setupImportActions",
    "renderImport",
    "FIREBASE_SYNC_STORAGE_KEY",
    "parseFirebaseConfig",
    "exportLocalSnapshot",
    "replaceLocalDataFromSnapshot",
    "uploadLocalSnapshotToFirebase",
    "downloadFirebaseSnapshotToLocal",
    "mergeLocalAndFirebaseData",
    "setupSyncActions",
    "renderSyncStatus",
    "USER_ROLES",
    "initializeAuthListenerIfPossible",
    "signInUser",
    "saveUserRole",
    "setupAuthActions",
    "applyPermissionState",
    "AI_SETTINGS_STORAGE_KEY",
    "analyzeReceiptWithAi",
    "setupAiActions",
    "renderAiStatus",
    "buildDataAuditFromSnapshot",
    "runFullDataAudit",
    "exportJsonBackup",
    "importJsonBackupFromFile",
    "renderDataAuditStatus",
]
REQUIRED_DB_MARKERS = [
    "budgets",
    "payments",
    "expenses",
    "categories",
    "removeBudgetsByClass",
    "removePaymentsByClass",
    "removePaymentsByStudent",
    "removeExpensesByClass",
    "schoolYears",
    "RR_DB_VERSION = 7",
]
REQUIRED_CSS_MARKERS = [
    "button {",
    "font-weight: 400;",
    "audit-box",
]


def main() -> int:
    missing = [file for file in REQUIRED_FILES if not (ROOT / file).exists()]
    if missing:
        print("Brakuje plików:")
        for file in missing:
            print(f"- {file}")
        return 1

    with (ROOT / "manifest.json").open("r", encoding="utf-8") as handle:
        manifest = json.load(handle)

    required_manifest_keys = ["name", "short_name", "start_url", "display", "icons"]
    for key in required_manifest_keys:
        if key not in manifest:
            print(f"Brak pola w manifest.json: {key}")
            return 1

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    for marker in REQUIRED_HTML_MARKERS:
        if marker not in html:
            print(f"Brak elementu w index.html: {marker}")
            return 1

    app_js = (ROOT / "app.js").read_text(encoding="utf-8")
    for marker in REQUIRED_APP_MARKERS:
        if marker not in app_js:
            print(f"Brak logiki w app.js: {marker}")
            return 1

    db_js = (ROOT / "db.js").read_text(encoding="utf-8")
    for marker in REQUIRED_DB_MARKERS:
        if marker not in db_js:
            print(f"Brak logiki w db.js: {marker}")
            return 1

    css = (ROOT / "style.css").read_text(encoding="utf-8")
    for marker in REQUIRED_CSS_MARKERS:
        if marker not in css:
            print(f"Brak wymaganego stylu w style.css: {marker}")
            return 1

    sw = (ROOT / "service-worker.js").read_text(encoding="utf-8")
    if "./db.js" not in sw:
        print("service-worker.js nie cacheuje db.js")
        return 1

    if "v1-6-3" not in sw:
        print("service-worker.js ma nieaktualną nazwę cache")
        return 1

    firebase_json = (ROOT / "firebase.json").read_text(encoding="utf-8")
    if "firestore.rules" not in firebase_json or "hosting" not in firebase_json:
        print("firebase.json nie zawiera konfiguracji Hosting i Firestore rules")
        return 1

    rules = (ROOT / "firestore.rules").read_text(encoding="utf-8")
    for marker in ["radaRodzicowPro", "snapshots/main", "roles/{uid}", "request.auth"]:
        if marker not in rules:
            print(f"Brak wymaganego elementu w firestore.rules: {marker}")
            return 1

    publishing = (ROOT / "PUBLISHING.md").read_text(encoding="utf-8")
    for marker in ["GitHub", "Firebase", "Pierwszy skarbnik Rady"]:
        if marker not in publishing:
            print(f"Brak sekcji w PUBLISHING.md: {marker}")
            return 1

    print("OK: projekt eSkarbnik ma konfigurację publikacji GitHub/Firebase i zachowane poprzednie moduły.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
