---
name: test-craftsmanship
description: The house craft for this repo - SOLID, DRY, clean code, the Dependency Rule, code smells, and design-pattern discipline (Uncle Bob's canon) applied to test automation for UI and API. Use when writing, refactoring, or reviewing test code, or deciding how much structure a framework needs. Explains why this repo rejects the Page Object Model in favor of lightweight functional helpers.
---

# Test craftsmanship

Test code is production code. It is read far more than it is written, it outlives the
features it covers, and a flaky or unreadable suite erodes trust faster than no suite
at all. So we hold it to the same bar as the app.

This skill aggregates Robert C. Martin's craft - Clean Code, Clean Architecture, The
Clean Coder, Clean Agile, and design-pattern discipline - and applies it to tests. It
is about **structure and design, not syntax**: naming style, line length, and
formatting stay the job of the linter/formatter, not this skill. (Adapted from Uncle
Bob's books and the community `uncle-bob-craft` skill.)

## Clean code, applied to tests

- **Names reveal intent.** A test title states a behaviour ("standard_user can sign
  in"), not a mechanic ("test1"). A helper is a business verb (`login`, `addToCart`),
  never `doStuff`.
- **Small things that do one thing.** If you can extract another meaningful step from a
  function, it was doing two. Extract until you can't.
- **Few arguments.** 0-2 is comfortable, 3 is a smell, more wants an object. Never a
  boolean flag argument - `submit(true)` should be two named functions.
- **Command-Query Separation.** A function either *does* something (returns void) or
  *answers* something (returns a value/Locator) - never both. Actions command; query
  helpers answer.
- **DRY, but the right abstraction.** A duplicated flow collapses into one function; a
  duplicated locator lives in one place. But a little duplication beats the wrong
  abstraction - don't unify two things that merely look alike today.
- **Fail loudly.** Prefer an exception with a clear message over a silent fallback.
- **No comments that apologise for the code.** Make the code say it; keep comments for
  the "why", not the "what".
- **Assertions are web-first.** `await expect(locator).toX()`, never
  `expect(await locator.textContent())`. Let Playwright wait ([[playwright-locators]]).

## SOLID, in context

| Principle | In this repo |
|---|---|
| **SRP** - one reason to change | A `login` action owns the login flow; a products API client owns that endpoint; the thin `App` facade owns the driver seam. A login-screen change touches one file. |
| **OCP** - open to extension | Add a new action/query as a new function; you stop editing an ever-growing god-object. |
| **LSP** - substitutability | Anything typed `App` works anywhere an `App` is expected - including a future authenticated variant. |
| **ISP** - small interfaces | API helpers take the narrow `APIRequestContext`, not the whole `App`. Depend on exactly what you use. |
| **DIP** - depend on abstractions | Actions depend on the `App` facade, not on raw Playwright globals. The concrete `page`/`request` are injected by the `app` fixture. |

## The Dependency Rule (Clean Architecture)

Dependencies point **inward**. Business intent (the `login` action, the products
client) is the center; the Playwright driver is a detail at the edge, wrapped by the
`App` facade. Specs and actions never reach past the facade to poke `page` globals,
so swapping how we reach the browser or API changes one seam, not the suite.

## Code smells (name them in review)

| Smell | Meaning |
|---|---|
| Rigidity | A small change forces many edits. |
| Fragility | A change breaks unrelated areas. |
| Immobility | Hard to reuse a piece in another context. |
| Viscosity | Easy to hack, hard to do the right thing. |
| Needless complexity | Speculative or unused abstraction. |
| Needless repetition | DRY violated; the same idea in several places. |
| Opacity | Code is hard to understand. |

In a review, **name the smell with its file/function and propose one or two concrete
refactors** ("SRP: this parses and asserts - split it", "invert this so the spec
depends on the facade, not `page`"). "Violates SOLID" with no location or fix is not
a review.

## Design patterns: use vs misuse

- Introduce a pattern when a **real** design need appears - roughly the *third
  duplication* or the *second reason to change* - and name it so intent is clear.
- **Avoid cargo cult.** Don't add a Factory/Strategy/Screenplay layer because the repo
  "should" have one. Signs of misuse: a pattern name in every file, layers that only
  delegate without logic, abstraction that makes simple code harder to follow (the
  *needless complexity* smell).
- **Why this repo uses plain functions.** For today's small suite, a `login` function
  plus a thin `App` facade is enough and reads clearly. The **Screenplay pattern**
  (Actors/Abilities/Tasks/Questions) is the principled next step *if* this grows a
  second axis of change - many reused flows across a broad UI **and** API surface. We
  don't build it speculatively; that would be the smell, not the cure.

## Why we do NOT use the Page Object Model

The POM is the industry default, and it fights the principles above:

- **It violates SRP.** A page object accretes locators + actions + often assertions for
  a whole page - many reasons to change, and it grows into a god-object.
- **It thinks in UI, not user.** Methods describe *how* you click, not *what* the user
  achieves, so tests read as mechanics.
- **It doesn't cross interfaces.** A page object is welded to the screen, so you can't
  reuse a flow via the API. When the UI is the only abstraction, everything gets tested
  through it - slow and brittle.
- **It leans on inheritance** (a `BasePage`) where composition is looser and cleaner.

## One model, UI or API

The same `App` drives the browser or, via a typed API client, calls HTTP directly. A hybrid test
seeds state through the API (fast, reliable) and asserts through the UI. The principles
don't change between UI and API - only the collaborator does ([[playwright-api-testing]],
[[playwright-fixtures-auth]]).

## Intent-revealing API: group by role, not just name the function

Naming a function well (`login`, `addToCart`) is necessary but not sufficient - a spec
calling a dozen ungrouped helpers still reads as a flat list of mechanics. At the
fixture-composition seam (`tests/fixtures.ts`), group actions and queries into two
named collaborators the spec receives directly:

- **A commands collaborator** - named for the actor's role *in this domain*, not
  hardcoded to any one project. Its methods are the things that actor does.
- **A questions collaborator** - the things a spec asks. `verify` reads well in most
  domains and rarely needs to change.

In this repo the actor is a shopper, so it's `shop.login()`, `shop.addToCart(id)`,
`verify.stillOnCheckout()`. Port this pattern to a different app and the commands
collaborator is renamed to match *that* domain's actor - `admin.approveInvoice()` for
a back-office tool, `guest.bookRoom()` for a hotel app, `patient.scheduleVisit()` for a
healthcare portal - not copied over as `shop` regardless of what the app does. If a
suite genuinely has more than one actor role (a shopper and a warehouse admin, say),
that's a real reason for a second commands collaborator (`admin` alongside `shop`), not
a cargo-cult layer.

**`shop`/`verify` are assembled in `fixtures.ts`; they are not written there.** Each
method is a function that already exists in `src/actions/<domain>.ts`, grouped by the
domain concept it belongs to (all session actions in `login.ts`, all cart actions in
`cart.ts`, all checkout actions in `checkout.ts`, ...) - not by which spec happened to
need it first, and not as one flat `actions.ts`. `fixtures.ts` imports those functions
and assigns them onto the `shop`/`verify` objects; see below.

This is not a fluent interface (nothing chains, nothing returns `this`) and it is not
Screenplay (no Actor/Ability/Task/Question classes) - it is plain functions grouped
under two namespace objects, so **Command-Query Separation is visible at the call
site**: anything under the commands collaborator mutates, anything under `verify` only
asserts. The payoff is an **intent-revealing API** - `shop.login(); shop.addToCart(id);
verify.stillOnCheckout();` reads as a description of the actor's behaviour, not an
ordered list of driver calls. Keep extending these collaborators as you add
actions/queries; don't invent a third namespace without a real reason to (that's the
cargo-cult smell again).

## The shape to refactor toward

Generic AI-written tests inline everything - locators, actions, and assertions in the
spec. Refactor toward this layout (build it as you go - create the files the first time
you extract a real action, don't wait for permission or a "later cleanup" pass):

```
src/app.ts               the App facade + createApp: the driver seam tests depend on (DIP)
src/actions/<domain>.ts  business-intent functions grouped by domain concept, e.g.
                         login.ts (session), cart.ts (add/remove/view), checkout.ts
                         (form/place-order) - one thing each, reused (DRY)
src/api/                 typed clients (products): one place per endpoint + its shape
tests/fixtures.ts        imports the domain actions/queries and *composes* them into
                         named `shop`/`verify` collaborators injected into the spec
                         (DI) - it holds no locators or `page.` calls of its own
tests/*.spec.ts          read as intent via `shop`/`verify`; no raw locators or `page.` calls
```

**`tests/fixtures.ts` is a composition seam, not a home for logic.** If you catch
yourself writing `page.getByLabel(...)`, `page.getByRole(...)`, or any assertion body
inside `fixtures.ts`, stop - that behaviour belongs in `src/actions/<domain>.ts`
instead, next to the other actions/queries for that same domain concept. This is the
most common way a refactor drifts back toward a god-object: it satisfies "expose
`shop`/`verify` to the spec" the literal way, by writing the mechanics straight into the
fixture, and `src/` never gets created at all. Refactoring by domain, not by file that's
already open, is what keeps a login-flow change from touching a file that also holds
cart and checkout code.

## Craft checklist (before you push a test)

- Does the spec read as intent, with no raw locators or `page.` plumbing?
- Are actions and queries called through grouped, intent-named collaborators (e.g.
  `shop`/`verify`) rather than a flat list of ad hoc helper calls?
- Does `tests/fixtures.ts` only import and wire those collaborators - zero locators,
  zero `page.`/`request.` calls, zero assertion bodies written directly in it?
- Do the action/query implementations live in `src/actions/<domain>.ts`, grouped by
  domain concept (session, cart, checkout, ...) rather than dumped in one file or
  inlined wherever they were first needed?
- Is each new function one responsibility, one reason to change?
- Did a duplicated flow become a shared function, not a copy-paste?
- Are all assertions web-first, and none hiding inside an action?
- Would this still work if you swapped the UI for the API surface?
- Did you add structure only where duplication/variation justified it (no cargo cult)?
- Linter and formatter run separately and green (craft is not style).
