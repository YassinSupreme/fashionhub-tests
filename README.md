# FashionHub — Playwright E2E Test Suite

Production-quality end-to-end tests for the [FashionHub](https://pocketaces2.github.io/fashionhub/) demo app, built with [Playwright](https://playwright.dev/) and TypeScript.

## Features

| Capability | Details |
|---|---|
| **Cross-browser** | Chromium, Firefox, WebKit (Safari) |
| **Multi-environment** | local - staging - production (config file or CLI) |
| **Page Object Model** | `BasePage` -> `LoginPage` / `AccountPage` / `HomePage` / `ProductsPage` / `CartPage` / `AboutPage` |
| **Custom Fixtures** | Page objects auto-injected into tests |
| **CI/CD ready** | GitHub Actions + Jenkinsfile + Docker |

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- _(Optional)_ **Docker** for containerised runs

---

## Installation

```bash
git clone https://github.com/YassinSupreme/fashionhub-tests.git
cd fashionhub-tests
npm install
npx playwright install --with-deps
```

---

## Environment Configuration

| Priority | Method | Example |
|---|---|---|
| 1st | `BASE_URL` env var | `BASE_URL=https://staging-env/fashionhub/ npx playwright test` |
| 2nd | `TEST_ENV` env var | `TEST_ENV=staging npx playwright test` |
| 3rd | `.env` file | Copy `.env.example` -> `.env` and set values |
| 4th | Default | `https://pocketaces2.github.io/fashionhub/` (production) |

### Named environments (`TEST_ENV`)

| Name | URL |
|---|---|
| `local` | `http://localhost:4000/fashionhub/` |
| `staging` | `https://staging-env/fashionhub/` |
| `production` | `https://pocketaces2.github.io/fashionhub/` |

---

## Running Tests

```bash
# All browsers
npm test

# Single browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Single spec file
npx playwright test tests/home/home.spec.ts
npx playwright test tests/products/products.spec.ts
npx playwright test tests/cart/cart.spec.ts
npx playwright test tests/about/about.spec.ts
npx playwright test tests/account/account.spec.ts
npx playwright test tests/auth/login.spec.ts

# Specific environment
TEST_ENV=production npx playwright test
BASE_URL=https://your-env.com/fashionhub/ npx playwright test

# Watch / debug
npm run test:headed
npm run test:debug
npm run test:report
```

---

## Running the App Locally (Docker)

```bash
docker pull pocketaces2/fashionhub
docker run -p 4000:80 pocketaces2/fashionhub
# then in a new terminal:
TEST_ENV=local npx playwright test
```

---

## Running Tests with Docker

```bash
docker build -t fashionhub-tests .
docker run --rm fashionhub-tests
docker run --rm -e TEST_ENV=staging fashionhub-tests
docker run --rm -e BASE_URL=https://your-env.com/fashionhub/ fashionhub-tests

# Docker Compose
docker compose up --build
TEST_ENV=staging docker compose up --build
```

Reports are saved to `./playwright-report/` on the host.

---

## CI/CD Integration

### GitHub Actions

Workflow at `.github/workflows/playwright.yml` runs on every push, pull request, and nightly at 02:00 UTC across all three browsers. Trigger a manual run via **Actions -> Playwright Tests -> Run workflow**.

**Secrets/variables:** `BASE_URL`, `TEST_ENV`

### Jenkins

`Jenkinsfile` provides a declarative pipeline with parameters `TEST_ENV`, `BASE_URL`, `BROWSER`, a Docker agent, and HTML report publishing.

---

## Project Structure

```
fashionhub-tests/
├── src/
│   ├── pages/
│   │   ├── BasePage.ts          # Abstract base for all page objects
│   │   ├── LoginPage.ts         # Login form interactions
│   │   ├── AccountPage.ts       # Post-login / welcome page
│   │   ├── HomePage.ts          # Hero, nav, features, CTA
│   │   ├── ProductsPage.ts      # Product listing, prices, add-to-cart
│   │   ├── CartPage.ts          # Cart items, total, remove, checkout
│   │   └── AboutPage.ts         # About headings and content
│   ├── fixtures/
│   │   └── index.ts             # Extended test with auto-injected page objects
│   ├── data/
│   │   └── users.ts             # Typed test credentials
│   └── utils/
│       └── env.ts               # Environment URL resolution
├── tests/
│   ├── auth/login.spec.ts
│   ├── home/home.spec.ts
│   ├── products/products.spec.ts
│   ├── cart/cart.spec.ts
│   ├── about/about.spec.ts
│   └── account/account.spec.ts
├── .github/workflows/playwright.yml
├── playwright.config.ts
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

---

## Test Scenarios

**Total: 30 scenarios x 3 browsers = 90 test runs**

### Login (`tests/auth/login.spec.ts`)

| # | Scenario | Type |
|---|---|---|
| 1 | Valid credentials -> redirect + welcome message with username | Happy path |
| 2 | Wrong password -> stays on login page | Negative |
| 3 | Non-existent username -> stays on login page | Negative |
| 4 | Empty fields -> does not navigate away | Edge case |
| 5 | Login page loads with correct title | Smoke |

### Home (`tests/home/home.spec.ts`)

| # | Scenario | Type |
|---|---|---|
| 1 | Home page loads with the correct title | Smoke |
| 2 | Hero section is visible and contains a welcome heading | Happy path |
| 3 | "Shop Now" CTA navigates to the Products page | Happy path |
| 4 | Navigation bar contains all expected links | Happy path |
| 5 | Feature section displays three highlights | Happy path |

### Products / Clothing (`tests/products/products.spec.ts`)

| # | Scenario | Type |
|---|---|---|
| 1 | Products page loads with the correct title | Smoke |
| 2 | At least one product card is displayed | Happy path |
| 3 | Each product card shows a name and a price | Happy path |
| 4 | Product prices are formatted as currency (e.g. `$49.99`) | Happy path |
| 5 | Adding a product to the cart and verifying it appears in the cart | Happy path |

### Shopping Cart (`tests/cart/cart.spec.ts`)

| # | Scenario | Type |
|---|---|---|
| 1 | Cart page loads with the correct title | Smoke |
| 2 | Visiting the cart with no items is gracefully handled | Edge case |
| 3 | Adding a product on the products page shows it in the cart | Happy path |
| 4 | Cart displays a total amount after adding a product | Happy path |
| 5 | Removing an item decreases the cart item count | Happy path |
| 6 | Checking out triggers a confirmation dialog and stays on the cart page | Happy path |

### About (`tests/about/about.spec.ts`)

| # | Scenario | Type |
|---|---|---|
| 1 | About page loads with the correct title | Smoke |
| 2 | "About FashionHub" heading is visible | Happy path |
| 3 | All expected subsections present (Our Story, Our Vision, Our Commitment, Join Us) | Happy path |
| 4 | About section contains descriptive content paragraphs | Happy path |

### Account (`tests/account/account.spec.ts`)

| # | Scenario | Type |
|---|---|---|
| 1 | Account page shows correct title when logged in | Smoke |
| 2 | Welcome message includes the logged-in username | Happy path |
| 3 | Logout button is visible on the account page | Happy path |
| 4 | Clicking Logout redirects user away from account page | Happy path |
| 5 | Direct navigation to account page without login does not show welcome message | Access control |
