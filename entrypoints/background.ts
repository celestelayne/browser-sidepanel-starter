export default defineBackground(() => {
browser.sidePanel
    .setPanelBehavior({
      openPanelOnActionClick: true,
    })
    .catch((error) => {
      console.error('Side panel setup failed:', error);
    });
});
