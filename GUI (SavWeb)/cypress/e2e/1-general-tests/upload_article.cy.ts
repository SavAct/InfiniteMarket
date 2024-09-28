describe('upload article', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#/_browser_')
  })

  it('passes request and sell a product', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      // Go to sell page
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('i.q-icon').contains('storefront').should('be.visible').click()
      // Enter Data
      cy.get('main.q-page input[type="text"]').eq(0).should('be.visible').type('Test article')

      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="Category"]').should('be.visible').type('Home &')
      cy.get('div.q-item__label span').contains('Home & Garden').should('be.visible').click()
      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="Category"]').type('{downarrow}{downarrow}{downarrow}').wait(200).type('{enter}')

      cy.get('main.q-page textarea[aria-label="Description"]').should('be.visible').click()
      cy.get('main.q-page textarea[aria-label="Description"]').invoke('val', description).trigger('input')
      cy.get('main.q-page input[type="text"]').eq(1).should('be.visible').type('https://fastly.picsum.photos/id/871/500/300.jpg?hmac=74Pz3kCQ8dCVp8ihNWX_ahnHbN4FFdJZHWR1JzB3GfI{enter}')
      cy.get('main.q-page input[type="text"]').eq(1).should('be.visible').type('https://fastly.picsum.photos/id/650/500/300.jpg?hmac=zuXsO_vtmIqXF6CombRVztqIF9pL1yNwjkSt0m5AWU4').parent().parent().parent().next().find('button.q-btn').click()
      cy.get('main.q-page div[role="img"].q-img').should('have.length', 2)
      cy.get('main.q-page input[type="text"]').eq(2).should('be.visible').type('Cave').parent().parent().parent().next().find('button.q-btn').click()
      cy.get('main.q-page input[type="text"]').eq(2).should('be.visible').type('Forrest{enter}')

      // Quantity option per order
      cy.get('main.q-page div.q-btn-group span.block').contains('Multiple').should('be.visible').click()
      cy.get('main.q-page div').contains('(Different price levels depending on quantity)').parent().next().find('input[aria-label="Quantity"][type="number"]').eq(0).should('be.visible').parent().parent().parent().parent().parent().next().find('input[aria-label="Price from 1 article"]').clear().type('3')
      cy.get('main.q-page div').contains('(Different price levels depending on quantity)').parent().next().find('input[aria-label="Quantity"][type="number"]').eq(1).should('be.visible').clear().type('5').parent().parent().parent().parent().parent().next().find('input[aria-label="Price from 5 articles"]').clear().type('10')
      cy.get('main.q-page .q-field__messages div').contains('3.00 USD per article').should('be.visible')
      cy.get('main.q-page .q-field__messages div').contains('2.00 USD per article').should('be.visible')
      cy.get('main.q-page button.q-btn span.block').contains('Add quantity discount').should('be.visible').click()
      cy.get('main.q-page div').contains('(Different price levels depending on quantity)').parent().next().find('input[aria-label="Quantity"][type="number"]').eq(2).should('be.visible').clear().type('100').parent().parent().parent().parent().parent().next().find('input[aria-label="Price from 100 articles"]').clear().type('95.55')
      cy.get('main.q-page .q-field__messages div').contains('0.96 USD per article').should('be.visible')
      cy.get('main.q-page input[type="checkbox"]').eq(0).parent().should('be.visible').click()
      cy.get('main.q-page input[type="number"][aria-label="Max quantity"]').should('be.visible').clear().type('500')
      cy.get('main.q-page div[aria-label="Items are available from now on"][aria-checked="true"]').should('be.visible')
      
      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="From region"]').should('be.visible').click().type('Ger').wait(200).type('{downarrow}{enter}')
      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="Explicit exclude regions"]').should('be.visible').click().type('State').wait(100).type('{downarrow}{downarrow}{enter}')
      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="Ship to regions"]').should('be.visible').click().type('Eu').wait(100).type('{downarrow}{enter}')
      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="Explicit exclude regions"]').should('be.visible').click().type('Ger').wait(100).type('{downarrow}{enter}')
      cy.get('main.q-page input[type="search"][role="combobox"][aria-label="Ship to regions"]').should('be.visible').click().type('Jap').wait(100).type('{downarrow}{enter}')
      
      cy.get('main.q-page input[aria-label="Max shipping preparation time"]').should('be.visible').clear().type('1').parent().next().find('span').contains('days').click()
      cy.get('div[role="listbox"] div[role="option"].q-item span').contains('weeks').should('be.visible').click()
      cy.get('main.q-page input[aria-label="Delivery price"][type="number"]').should('have.length', 2).eq(0).should('be.visible').clear().type('4.50')
      cy.get('main.q-page input[aria-label="Delivery price"][type="number"]').eq(1).should('be.visible').clear().type('20')
      cy.get('main.q-page input[aria-label="Max delivery duration"][type="number"]').eq(1).should('be.visible').clear().type('16')
      
      cy.get('main.q-page input[type="checkbox"]').eq(2).parent().should('be.visible').click()
      cy.get('main.q-page textarea[aria-label="Note"]').should('be.visible').click()
      cy.get('main.q-page textarea[aria-label="Note"]').invoke('val', SellerNote).trigger('input')

      // Login user
      cy.get('main.q-page button.q-btn span.block').contains('Login user').should('be.visible').click()
    })
    cy.get('div[role="dialog"] div.q-card__section').contains('Page requests user account').should('be.visible').parent().find('button.q-btn span.block').first().contains('Cancel').should('be.visible').click()
    cy.iframe().within(() => { 
      cy.get('main.q-page input[aria-label="Seller account name"][type="text"]').should('be.visible').clear().should('be.empty').wait(300).type('user.two')
      cy.get('main.q-page button.q-btn span.block').contains('Send').should('be.visible').click()
    })
    cy.get('div[role="dialog"] div.q-card__section').contains('Sign transaction on chain lamington').should('be.visible').parent().find('button.q-btn span.block').first().contains('Cancel').should('be.visible').click()
    cy.iframe().within(() => {
      // Login known user
      cy.get('main.q-page input[aria-label="Seller account name"][type="text"]').should('be.visible').clear().should('be.empty').wait(300).type(seller)
      cy.get('main.q-page button.q-btn span.block').contains('Send').should('be.visible').click().wait(4000)
      cy.get('div[role="dialog"] div.q-dialog__title').contains('Seller settings are not set').should('be.visible')
      cy.get('div[role="dialog"] button.q-btn span.block').contains('Yes').should('be.visible').click()
      cy.get('header i.q-icon').contains('arrow_back_ios_new').click()

      // Preview
      cy.get('main.q-page button.q-btn span.block').contains('Preview').should('be.visible').click()
      cy.get('main.q-page div.q-chip__content div.ellipsis').contains(seller).should('be.visible')
      cy.get('main.q-page span').contains('from').should('be.visible').next().find('div').contains('Germany').should('be.visible')
      cy.get('main.q-page .q-carousel__control').should('be.visible').find('div[role="img"]').should('have.length', 2)
      cy.get('main.q-page div.q-chip.text-green .q-chip__content div').contains('European Union').should('be.visible')
      cy.get('main.q-page div.q-chip.text-green .q-chip__content div').contains('Japan').should('be.visible')
      cy.get('main.q-page div.q-chip.text-red .q-chip__content div').contains('United States').should('be.visible')
      cy.get('main.q-page div.q-chip.text-red .q-chip__content div').contains('Germany').should('be.visible')
      cy.get('main.q-page .q-field input[role="combobox"]').first().parent().parent().should('be.visible').click()
      cy.get('div.q-item__label').contains('3.00 $/article').should('be.visible')
      cy.get('div.q-item__label').contains('2.00 $/article').should('be.visible')
      cy.get('div.q-item__label').contains('0.96 $/article').should('be.visible')
      cy.get('div.q-item__label span').contains('From up of 100 articles for 0.96 $/article').should('be.visible').click()
      cy.get('main.q-page div.text-h5').contains('Description').should('be.visible').next().contains(description).should('be.visible')
      cy.get('main.q-page div.text-h5').contains('Note').should('be.visible').next().contains(SellerNote).should('be.visible')
      cy.get('main.q-page button.q-btn span.block').contains('Close Preview').should('be.visible').click()
    })
  })
  
})

const seller = 'user.one'
const description = 'This is a test article.'
const SellerNote = 'This is a test note of the seller.'   