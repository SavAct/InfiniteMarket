describe('buy', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#/_browser_')
  })

  it('passes buy item by url', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('main.q-page input[aria-label="Category"]').should('be.visible').wait(1000).click()
      cy.get('div').contains('Jewelry').should('be.visible').click()
      cy.get('i.q-icon').contains('search').click()
      cy.get('main.q-page div.q-card').first().click()
      cy.get('main.q-page div.q-chip__content').contains('World Wide').click()
      cy.get('main.q-page div').contains('Accept payments of').next().click()
      cy.get('main.q-page div').contains('Buy').click()
    })
    // Change savweb browser url  
    // cy.wait(200).get('input[type="text"]').should('be.visible').clear().invoke('val', '#test@savweb:file/index/!index.html/buy?id=0&category=792915009393917952&to=ww&pcs=').type('1').type('{enter}')
    
    cy.iframe().within(() => {  
      // .contains('Buy')
      cy.get('div.q-toolbar__title').contains('Buy').should('be.visible')
      // Open account card
      cy.get('main.q-page div.q-item.q-item--clickable').first().click()
      // Select network
      // cy.get('main.q-page div.q-item.q-item--clickable').next().find('div').contains('arrow_drop_down').click().type('l{enter}').wait(200)
      // Enter account name
      cy.get('main.q-page div.q-item.q-item--clickable').next().find('input[type="text"]').first().type('savact{enter}').wait(2000)
      // Enter address
      cy.get('main.q-page div.q-item.q-item--clickable').eq(1).click()
      cy.get('main.q-page input[type="text"]').eq(1).type('Sav')
      cy.get('main.q-page input[type="text"]').eq(3).type('Act')
      cy.get('main.q-page input[type="text"]').eq(4).type('Sun street 12')
      cy.get('main.q-page input[type="text"]').eq(6).type('Crater')
      cy.get('main.q-page input[type="text"]').eq(7).type('Front side')
      cy.get('main.q-page input[type="text"]').eq(8).type('12345')
      cy.get('main.q-page input[type="text"]').eq(9).type('With onions, please')
      cy.get('main.q-page div').contains('Country').parent().parent().parent().find('i.q-icon.q-select__dropdown-icon').click()
      cy.get('div').contains('United').should('be.visible').click()

      // Continue
      cy.get('main.q-page button').contains('Continue').click()

      // Contact step
      cy.get('main.q-page textarea[aria-label]').invoke('val').as('encBuyData').then((text) => {
        expect(text).to.not.be.empty;
      });
      cy.get('main.q-page i.q-icon.q-select__dropdown-icon').first().click().type('{downArrow}{downArrow}{enter}')
      // Continue
      cy.get('main.q-page span').contains('Got a response').click()

      // Seller confirmed
      cy.get('main.q-page div.q-checkbox__inner').click()
      // Send payment
      cy.get('main.q-page span').contains('Send Payment').click()
    })

    // Create eosio key
    cy.get('main.q-page div.q-checkbox').first().next().find('button').should('be.visible').click()
    cy.get('.q-dialog div.q-checkbox').first().should('be.visible').click()
    cy.get('.q-dialog i.q-icon').contains('rotate_left').should('be.visible').click()
    cy.get('.q-dialog .q-card__actions button').first().should('be.visible').click()

    // Set to already paid
    cy.get('main.q-page button.q-btn--dense span.q-btn__content').contains('rans').should('be.visible').last().click()

    cy.iframe().within(() => {  
      cy.get('div.q-toolbar__title').contains('Buy').should('be.visible')
      cy.get('div.q-notification__message').contains('Looks fine. Now continue to inform the seller.').should('exist').should('be.visible')
      cy.get('span').contains('Continue').should('be.visible').click()
      cy.get('span').contains('Informing is done').should('exist').should('be.visible').click()
    })
  })

  // it('passes buy item by url with pgp key', () => {  
  //   // Wait for loading page
  //   cy.iframe().within(() => {  
  //     cy.get('div#q-app').should('be.visible').parent().should('be.visible')
  //     cy.get('main.q-page input[aria-label="Category"]').should('be.visible').wait(500).click().type('{downArrow}{downArrow}{enter}')
  //     cy.get('main.q-page div.q-card').first().click()
  //     cy.get('main.q-page div.q-chip__content').contains('World Wide').click()
  //     cy.get('main.q-page div').contains('Accept payments of').next().click()
  //     cy.get('main.q-page div').contains('Buy').click()
  //   })
  //   // Change savweb browser url  
  //   // cy.wait(200).get('input[type="text"]').should('be.visible').clear().invoke('val', '#test@savweb:file/index/!index.html/buy?id=0&category=792915009393917952&to=ww&pcs=').type('1').type('{enter}')
    
  //   cy.iframe().within(() => {  
  //     // .contains('Buy')
  //     cy.get('div.q-toolbar__title').contains('Buy').should('be.visible')
  //     // Open account card
  //     cy.get('main.q-page div.q-item.q-item--clickable').first().click()
  //     // Select network
  //     // cy.get('main.q-page div.q-item.q-item--clickable').next().find('div').contains('arrow_drop_down').click().type('l{enter}').wait(200)
  //     // Enter account name
  //     cy.get('main.q-page div.q-item.q-item--clickable').next().find('input[type="text"]').first().type('savact{enter}').wait(2000)
  //     // Enter public key
  //     cy.get('main.q-page textarea[aria-label="Public PGP Key"]').clear().invoke('val', publicKey_buyer).type('{enter}')
  //     // Enter address
  //     cy.get('main.q-page div.q-item.q-item--clickable').eq(2).click()
  //     cy.get('main.q-page input[type="text"]').eq(1).type('Sav')
  //     cy.get('main.q-page input[type="text"]').eq(3).type('Act')
  //     cy.get('main.q-page input[type="text"]').eq(4).type('Sun street 12')
  //     cy.get('main.q-page input[type="text"]').eq(6).type('Crater')
  //     cy.get('main.q-page input[type="text"]').eq(7).type('Front side')
  //     cy.get('main.q-page input[type="text"]').eq(8).type('12345')
  //     cy.get('main.q-page input[type="text"]').eq(9).type('With onions, please')
  //     cy.get('main.q-page div').contains('Country').parent().parent().parent().find('i.q-icon.q-select__dropdown-icon').click().type('{downArrow}{downArrow}{enter}')
  //     // Continue
  //     cy.get('main.q-page button').contains('Continue').click()

  //     // Contact step
  //     cy.get('main.q-page textarea[aria-label="Encrypted data"]').invoke('val').as('encBuyData').then((text) => {
  //       expect(text).to.not.be.empty;
  //     });
  //     cy.get('main.q-page i.q-icon.q-select__dropdown-icon').first().click().type('{downArrow}{downArrow}{enter}')
  //     // Continue
  //     cy.get('main.q-page span').contains('Got a response').click()

  //     // Go to message
  //     cy.get('i.q-icon').contains('drafts').click()
  //     cy.get('main.q-page textarea[aria-label="Customer message"]').clear().invoke('val', initialBuyMessage).type('{enter}')
  //     cy.get('main.q-page button.q-btn.q-btn--standard').click()
  //     cy.get('div[role="dialog"]').should('be.visible').find('input[type="password"]').clear()
  //     cy.get('div[role="dialog"]').find('textarea[aria-label="Private PGP Key"]').clear().invoke('val', privateKey_UserTwo).type('{enter}')
  //     cy.get('div[role="dialog"]').find('span').contains('Use this key').click()

  //   })
  // })
})