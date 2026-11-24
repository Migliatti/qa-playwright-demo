# Bug report (example)

Real behavior observed on a public practice site. Observed on 2026-11-24.

| Field | Value |
|---|---|
| ID | BUG-001 |
| Title | `problem_user` sees the same placeholder image for all six products |
| Environment | https://www.saucedemo.com, Chromium (Playwright 1.x, headless), desktop viewport |
| Severity | Medium (the page works, but users cannot tell products apart by image) |
| Priority | Medium |
| Status | Open (demo site is intentionally buggy for practice) |

## Steps to reproduce

1. Open https://www.saucedemo.com.
2. Log in with `problem_user` and the public demo password shown on the login page.
3. Look at the product list (`/inventory.html`).

## Expected result

Each of the 6 products shows its own image, as with `standard_user` (backpack, bike light, T-shirt, jacket, onesie, red T-shirt).

## Actual result

All 6 products use the same image file (`sl-404-....jpg`, a "not found" placeholder). With `standard_user` the 6 `src` values are different.

## Evidence

Image `src` attributes read from the page with Playwright:

- `standard_user`: 6 different files (`sauce-backpack-...`, `bike-light-...`, `bolt-shirt-...`, `sauce-pullover-...`, `red-onesie-...`, `red-tatt-...`).
- `problem_user`: 6 times the same file (`sl-404-....jpg`).

## Automated check

`tests/ui/problem-user.spec.ts` asserts that the 6 images are different. It is marked with `test.fail()`, so the suite stays green while the bug exists and signals when it is fixed.

## Notes

The site is built to contain defects for testing practice, so this is expected behavior of the demo and not a report to any vendor.
