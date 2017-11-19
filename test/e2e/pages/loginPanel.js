module.exports = function (browser) {
  this.loginPanelShouldBeVisible = () => {
    return browser.assert.elementPresent('.login-panel')
  }
  this.facebookLoginShouldBeVisiblee = () => {
    return browser.assert.containsText('.facebook-login', 'Facebook Login')
  }
  this.googlePlusLoginShouldBeVisiblee = () => {
    return browser.assert.containsText('.google-plus-login', 'Google Login')
  }
}