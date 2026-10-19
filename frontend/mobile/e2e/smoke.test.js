describe('Écran initial', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('affiche le conteneur de l’écran d’accueil', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
