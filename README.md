Cryptofolio

![Demo](https://github.com/Partysun/hack-cryptofolio/blob/master/.screenshots/demo.gif)

## For Developers

1. fork this repo
2. yarn
3. yarn start

Run tests `yarn test`

Run linting js: `npm run test:lint:js`
Run linting css: `npm run test:lint:css`

All Tests inside in __tests__ folder.
Smoke test is the e2e test with puppeteer.

Screenshots were auto-generated of all tested components inside .screenshots folder.

We use redux, react-router 4.

All reducers inside rootReducers.js

We use JEST, enzyme and jest snapshots for testing.

We use **standard** for js lint and **stylelint** for css.

Grep for TODO and FIXME, for not ready things...

## Tasks

- [x] Layout desktop/mobile styles
- [x] Currency format
- [x] Sync data with coinmarket:REST
- [x] Sync data with coinmarket:SOCKETS
- [x] Count % of market for every asset
- [x] Add mobile menu
- [x] Input Income Money + Open new route with personal folio
- [x] Draw graphs
- [ ] Save new Portfolio with coins data (local)
- [ ] Save new Portfolio with coins data (firebase)
- [ ] Added header with personal portfolios stats on the top of the dashboard
    page

## Roadmap

- [ ] Manage multiple portfolios
- [ ] Balanced configuration for new portfolio
- [ ] AUTH with SAN
- [ ] PWA
