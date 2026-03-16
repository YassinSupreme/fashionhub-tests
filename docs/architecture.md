# FashionHub Test Suite — Architecture Diagram

## 🏗️ Overall Architecture

```mermaid
graph TB
    subgraph APP["🌐 Application Under Test"]
        FH["FashionHub<br/>GitHub Pages<br/>pocketaces2.github.io/fashionhub"]
    end

    subgraph LAYERS["📐 Test Layers"]
        direction TB
        U["🔬 Unit Tests<br/><b>Vitest</b><br/>25 tests · 103ms<br/>tests/unit/"]
        E["🎭 E2E Tests<br/><b>Playwright</b><br/>39 tests · ~10s<br/>tests/{page}/"]
        B["🥒 BDD Tests<br/><b>Cucumber</b><br/>33 scenarios<br/>tests/{page}/*.feature"]
    end

    subgraph CI["⚙️ CI/CD — GitHub Actions"]
        S["🚦 Smoke Gate<br/>on every PR<br/>@smoke only"]
        SH["🔀 Sharded E2E<br/>4 shards × 3 browsers<br/>12 parallel jobs"]
        N["🌙 Nightly<br/>Full regression<br/>02:00 UTC"]
    end

    FH --> E
    FH --> B
    E --> CI
    B --> CI
    U --> CI
```

---

## 📁 Folder Structure

```mermaid
graph LR
    ROOT["📦 fashionhub-tests/"]

    ROOT --> SRC["src/"]
    ROOT --> TESTS["tests/"]
    ROOT --> PW["playwright/"]
    ROOT --> CFG["Config files"]

    SRC --> PAGES["pages/ — Page Objects<br/>LoginPage · AccountPage<br/>HomePage · ProductsPage<br/>CartPage · AboutPage"]
    SRC --> FIX["fixtures/ — Extended test fixtures<br/>index.ts"]
    SRC --> DATA["data/ — Test credentials<br/>users.ts"]
    SRC --> UTILS["utils/ — Helpers<br/>bdd.ts · env.ts"]
    SRC --> FAC["factories/ — Test data<br/>index.ts"]

    TESTS --> AUTH["auth/<br/>login.spec.ts<br/>login.feature"]
    TESTS --> HOME["home/<br/>home.spec.ts<br/>home.feature"]
    TESTS --> PROD["products/<br/>products.spec.ts<br/>products.feature"]
    TESTS --> CART["cart/<br/>cart.spec.ts<br/>cart.feature"]
    TESTS --> ABOUT["about/<br/>about.spec.ts<br/>about.feature"]
    TESTS --> ACC["account/<br/>account.spec.ts<br/>account.feature"]
    TESTS --> PERF["performance/<br/>login.perf.spec.ts"]
    TESTS --> BDD["bdd/<br/>support/ · step_definitions/"]
    TESTS --> UNIT["unit/<br/>env.test.ts<br/>factories.test.ts<br/>users.test.ts"]

    PW --> GS["global-setup.ts<br/>Login once → saves session"]
    PW --> AUTH2[".auth/user.json<br/>(gitignored)"]

    CFG --> PC["playwright.config.ts"]
    CFG --> VC["vitest.config.ts"]
    CFG --> CU["cucumber.js"]
    CFG --> ES["eslint.config.js"]
    CFG --> PR[".prettierrc"]
    CFG --> NV[".nvmrc  v24.1.0"]
```

---

## 🧱 Component Relationships

```mermaid
graph TD
    subgraph POM["Page Object Model (src/pages/)"]
        BP["BasePage<br/>navigate() ← 2-retry logic<br/>getTitle() · getCurrentUrl()"]
        LP["LoginPage"] --> BP
        AP["AccountPage"] --> BP
        HP["HomePage"] --> BP
        PP["ProductsPage"] --> BP
        CP["CartPage"] --> BP
        ABP["AboutPage"] --> BP
    end

    subgraph FIXTURES["Fixtures (src/fixtures/)"]
        FX["Extended test<br/>loginPage · accountPage<br/>homePage · productsPage<br/>cartPage · aboutPage"]
    end

    subgraph BDD_LAYER["BDD Layer (tests/bdd/)"]
        WORLD["CucumberWorld<br/>manages browser + POMs"]
        HOOKS["hooks.ts<br/>screenshot on failure<br/>timeout: 20s"]
        STEPS["common.steps.ts<br/>reuses POM methods"]
    end

    POM --> FIXTURES
    POM --> BDD_LAYER
    FIXTURES --> SPECS["Playwright Specs<br/>beforeEach: navigate<br/>afterEach: screenshot on failure"]
```

---

## 🔄 CI/CD Pipeline

```mermaid
flowchart LR
    PR["Pull Request"] --> SMOKE["🚦 Smoke Gate<br/>@smoke tests only<br/>chromium · ~30s"]
    PUSH["Push to main"] --> MATRIX["🔀 Matrix: 3 browsers<br/>× 4 shards = 12 jobs"]
    CRON["⏰ Nightly 02:00"] --> MATRIX

    SMOKE -->|pass| MERGE["✅ Ready to Merge"]
    SMOKE -->|fail| BLOCK["❌ Blocked"]

    MATRIX --> REPORTS["📊 Artifacts<br/>playwright-report-*<br/>test-results-*"]

    DEP["📦 Dependabot"] -->|weekly PRs| PR
```

---

## 🏷️ Test Tag Strategy

```mermaid
graph LR
    ALL["All Tests (39 E2E + 33 BDD)"]

    ALL --> SMOKE_T["@smoke<br/>10 BDD · ~6 E2E<br/>Page loads + basic visibility<br/><i>Runs on every PR</i>"]
    ALL --> REG_T["@regression<br/>Full user flows + edge cases<br/>Invalid credentials<br/>Add/remove cart items<br/><i>Runs nightly & on main push</i>"]
```

---

## ⚡ npm Scripts Reference

| Command | What it runs |
|---|---|
| `npm run test:unit` | Vitest — 25 unit tests (103ms) |
| `npm run test:smoke` | Playwright `@smoke` only |
| `npm test` | Full Playwright suite |
| `npm run test:bdd` | All 33 Cucumber scenarios |
| `npm run test:bdd:smoke` | Cucumber `@smoke` scenarios |
| `npm run test:bdd:regression` | Cucumber `@regression` scenarios |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier write |
