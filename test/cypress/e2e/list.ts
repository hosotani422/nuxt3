Cypress.on(`uncaught:exception`, () => false);

describe(`list`, () => {
  beforeEach(() => {
    cy.visit(`/list0000000000000`);
    cy.get(`[data-testid="MainConf"]`).click();
    cy.get(`[data-testid="ConfBackupUpload"]`).selectFile(`./test/memotea.bak`);
    cy.get(`[data-testid="MainList"]`).click();
  });
  it(`route`, () => {
    cy.get(`[data-testid="ListLeft"]`).click();
    cy.get(`[data-testid="ListRoot"]`).should(`not.exist`);
  });
  it(`create`, () => {
    cy.get(`[data-testid="ListPlus"]`).click();
    cy.get(`[data-testid="DialogText"]`).type(`list4`);
    cy.get(`[data-testid="DialogOk"]`).click();
    cy.get(`[data-testid="ListItem"]`).should(`have.length`, 4);
  });
  it(`clone`, () => {
    cy.get(`[data-testid="ListItem"]`).first().trigger(`touchstart`);
    cy.wait(1000);
    cy.get(`[data-testid="ListItem"]`).first().trigger(`touchend`);
    cy.get(`[data-testid="ListClone"]`).click();
    cy.get(`[data-testid="ListItem"]`).should(`have.length`, 4);
  });
  it(`edit`, () => {
    cy.get(`[data-testid="ListItem"]`).first().click();
    cy.get(`[data-testid="MainTitle"]`).type(`{backspace}0`);
    cy.get(`[data-testid="MainList"]`).click();
    cy.get(`[data-testid="ListTask"]`).first().should(`have.text`, `list0`);
  });
  it(`remove`, () => {
    cy.get(`[data-testid="ListItem"]`).eq(1).trigger(`touchstart`);
    cy.wait(1000);
    cy.get(`[data-testid="ListItem"]`).eq(1).trigger(`touchend`);
    cy.get(`[data-testid="ListTrash"]`).click();
    cy.get(`[data-testid="DialogOk"]`).click();
    cy.get(`[data-testid="ListItem"]`).should(`have.length`, 2);
    cy.get(`[data-testid="NoticeBack"]`).click();
    cy.get(`[data-testid="ListItem"]`).should(`have.length`, 3);
  });
  it(`current`, () => {
    cy.get(`[data-testid="ListItem"]`).first().trigger(`touchstart`);
    cy.wait(1000);
    cy.get(`[data-testid="ListItem"]`).first().trigger(`touchend`);
    cy.get(`[data-testid="ListClone"]`).should(`exist`);
    cy.get(`[data-testid="ListTrash"]`).should(`not.exist`);
  });
  it(`trash`, () => {
    cy.get(`[data-testid="ListItem"]`).last().trigger(`touchstart`);
    cy.wait(1000);
    cy.get(`[data-testid="ListItem"]`).last().trigger(`touchend`);
    cy.get(`[data-testid="ListClone"]`).should(`not.exist`);
    cy.get(`[data-testid="ListTrash"]`).should(`not.exist`);
  });
});
