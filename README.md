# qa-playwright-demo

Automated UI (end to end) and API tests written with Playwright and TypeScript, running in GitHub Actions. The tests target two public sites made for testing practice, so there is nothing to install besides Node and nothing secret in the repository.

> Built with AI assistance, reviewed by me. This is a personal learning project, not professional experience.

## What it tests

| Area | Target | Tests |
|---|---|---|
| UI | https://www.saucedemo.com | login (valid, locked user, wrong password, empty, protected page, logout), cart, price sorting, checkout (happy path and validation), one known bug |
| API | https://restful-booker.herokuapp.com | auth, create/read/update/delete booking, negative cases (no token, missing id, missing fields) |

25 tests in total, Chromium only. The test plan is in [`docs/plano-de-testes.md`](docs/plano-de-testes.md) (Portuguese) and a sample bug report is in [`docs/bug-report-exemplo.md`](docs/bug-report-exemplo.md) (English, about `problem_user` showing the same placeholder image for every product).

## Run it

```bash
npm ci
npx playwright install chromium
npx playwright test
```

Then open the HTML report with `npx playwright show-report`.

## Structure

```
pages/       Page Objects (login, inventory, cart, checkout)
fixtures/    Test data (public demo users, fictional booking data)
tests/ui/    UI specs
tests/api/   API specs
docs/        Test plan and bug report example
.github/workflows/tests.yml   CI: runs the suite and uploads the HTML report
```

## Decisions

- **Simple Page Object Model.** Selectors live in `pages/`, so a UI change is fixed in one place and the specs read like steps.
- **Independent tests.** Each UI test logs in again; each API test creates its own booking. Tests can run in parallel and in any order.
- **`data-test` selectors** for the UI, which are more stable than CSS classes or text.
- **Known bug as `test.fail()`.** The `problem_user` image bug keeps the suite green while it exists and flags when it gets fixed.
- **Demo credentials in code.** `secret_sauce` and `admin/password123` are published by the sites themselves, and the code says so. No real secrets are used.

## Limitations

- Both sites are shared public services. They can be slow, down, or reset, which may fail a run for reasons unrelated to the code. CI retries failed tests once.
- restful-booker does not follow common API conventions: wrong credentials return `200` with a reason (not `401`), and an invalid booking returns `500` (not `400`). The tests assert what the API really does and say so in comments.
- Chromium only. No performance, security, accessibility or visual tests.
- The CI workflow was written but, at the time of writing, not yet run on GitHub. The suite was run locally.

## Em português (resumo)

Projeto de estudo com testes automatizados de interface e de API usando Playwright e TypeScript, em dois sites públicos feitos para prática (saucedemo e restful-booker). São 25 testes, rodam no GitHub Actions e geram relatório HTML. Para rodar: `npm ci`, `npx playwright install chromium`, `npx playwright test`. Foi feito com apoio de IA e revisado por mim. É um projeto pessoal de aprendizado, não experiência profissional. Plano de testes em `docs/plano-de-testes.md`.

## License

MIT
