describe('main menu', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#test@savweb:file/index/!index.html')
  })
  it('passes menu', () => {
    cy.iframe().within(() => {
      cy.get('#immortal-shop').should('be.visible');

      // Check dark light mode switch
      cy.get('div#q-app').should('be.visible').parent().should('have.class', 'body--dark')
      const button = cy.get('#immortal-shop').find('button').contains('dark_mode').should('be.visible').click()
      cy.get('div#q-app').should('be.visible').parent().should('have.class', 'body--light')
      button.click()
      cy.get('div#q-app').should('be.visible').parent().should('have.class', 'body--dark')

      cy.get('#immortal-shop').find('button').contains('menu').click().wait(1000).click()
    });
  })
})