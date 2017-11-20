module.exports = function (browser) {
  this.showPageRoot = () => {
    return browser
      .url(browser.launchUrl)
      .waitForElementVisible('#app', 5000)
  }
  this.indexDivShouldBeVIsible = () => {
    return browser
      assert.elementPresent('.index-page')
  }
}