/* eslint-env jasmine */
const puppeteer = require('puppeteer')

let browser = null
let page = null
let mobilePage = null

beforeAll(async() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
  const launchOptions = process.env.CI
    ? {}
    : {headless: true, slowMo: 5, ignoreHTTPSErrors: true}

  // Workaround till https://github.com/GoogleChrome/puppeteer/issues/290 is fixed
  if (process.env.LAUNCH_CHROME_NO_SANDBOX) {
    console.warn('Launching Chrome with "--no-sandbox" option. ' +
      'This is not recommended due to security reasons!')
    Object.assign(launchOptions, { args: ['--no-sandbox'] })
  }

  browser = await puppeteer.launch(launchOptions)
  page = await browser.newPage()
  await page.setViewport({
    width: 1024,
    height: 768
  })
  mobilePage = await browser.newPage()
  await mobilePage.setViewport({
    width: 412,
    height: 732,
    isMobile: true
  })
})

afterAll(async () => {
  await browser.close()
})

/* eslint-disable no-use-before-define */
test('Landing page loads', async () => {
  await page.goto('http://localhost:3000')
  await page.screenshot({path: '.screenshots/market-list.png'})
  await mobilePage.goto('http://localhost:3000')
  await mobilePage.screenshot({path: '.screenshots/market-list-mobile.png'})
})

test('AssetsList', async () => {
  await page.goto('http://localhost:3000')
  await mobilePage.goto('http://localhost:3000')

  // AssetItem
  const assetItem = await page.$('.assets-item')
  const assetItemMobile = await mobilePage.$('.assets-item')
  await assetItem.screenshot({path: '.screenshots/asset-item-desktop.png'})
  await assetItemMobile.screenshot({path: '.screenshots/asset-item-mobile.png'})

  // AssetList
  const assetList = await page.$('.assets-list')
  const assetListMobile = await mobilePage.$('.assets-list')
  await assetList.screenshot({path: '.screenshots/asset-list-desktop.png'})
  await assetListMobile.screenshot({path: '.screenshots/asset-list-mobile.png'})
})
/* eslint-enable no-use-before-define */
