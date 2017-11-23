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

## CHANGELOG

- 2017-11-23:

  Updated history data api 

  Made prices more readable 

## Tasks

- [x] Layout desktop/mobile styles
- [x] Currency format
- [x] Sync data with coinmarket:REST
- [x] Sync data with coinmarket:SOCKETS
- [x] Count % of market for every asset
- [x] Add mobile menu
- [x] Input Income Money + Open new route with personal folio
- [x] Draw graphs
- [x] Save new Portfolio with coins data (local)
- [x] Save new Portfolio with coins data (firebase)
- [x] Update date on portfolio page, when ticket fires
- [ ] Added header with personal portfolios stats on the top of the dashboard
    page
- [x] Added icons

## Roadmap

- [x] Sync local app data with cloud
- [x] Balanced configuration for new portfolio
- [ ] Update configuration of any portfolios
- [ ] Stats
- [ ] AUTH with SAN
- [ ] PWA
