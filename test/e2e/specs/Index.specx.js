module.exports = {
  'Show Login Panel' : function (browser) {
    browser
      .page.index().showPageRoot()
      .page.index().indexDivShouldBeVIsible()
      .page.loginPanel().loginPanelShouldBeVisible()
      .page.loginPanel().facebookLoginShouldBeVisiblee()
      .page.loginPanel().googlePlusLoginShouldBeVisiblee()
      .end()
  },
}