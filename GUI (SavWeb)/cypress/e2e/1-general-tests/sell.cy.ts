describe('sell', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#/_browser_')
  })

  it('passes request and sell a product', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      // Go to message center
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('i.q-icon').contains('drafts').should('be.visible').click()
      // Enter request
      cy.get('main.q-page textarea').first().should('be.visible').click()
      cy.get('main.q-page textarea[aria-label]').invoke('val', buyStepRequest).type('{enter}')
      checkItemData()
      checkAddress()

      // Confirm response
      cy.get('main.q-page button span').contains('I have responded to the seller').click()
      cy.get('main.q-page div').contains('Wait until the customer made the SavPay transaction and then send the article').should('be.visible')
      checkItemData()
      checkAddress()
    })
    // Check payment dialog
    cy.iframe().within(() => {  
      cy.get('main.q-page button span').contains('Check payment').click()
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(0).click()
    })
    checkHistory('user.two', '')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(1).click()
    })
    checkHistory('savact', 'user.two')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(2).click()
    })
    checkOpenLink('https://bloks.io/account/user.two')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(3).click()
    })
    checkOpenLink('https://bloks.io/account/savact')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(4).contains('Close').click()
    })
  })

  it('passes inform and sell a product', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      // Go to message center
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('i.q-icon').contains('drafts').should('be.visible').click()
      // Enter request
      cy.get('main.q-page textarea').first().should('be.visible').click()
      cy.get('main.q-page textarea[aria-label]').invoke('val', buyStepInform).type('{enter}')
      // Go to last seller step
      cy.get('main.q-page div').contains('Customer claims to have send the SavPay transaction').should('be.visible')
      checkItemData()
      checkAddress()
    })
    // Check payment dialog
    cy.iframe().within(() => {  
      cy.get('main.q-page button span').contains('Check payment').click()
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(0).click()
    })
    checkHistory('user.two', '')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(1).click()
    })
    checkHistory('EOS7rPddBX71GSqpQn9Yp13a1zqk8PEJVFxjHUpStyDSCaEeiAeZj', 'user.two')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(2).click()
    })
    checkOpenLink('https://bloks.io/account/user.two')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(3).contains('Close').click()
    })
  })

  it('passes complete and sell a product', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      // Go to message center
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('i.q-icon').contains('drafts').should('be.visible').click()
      // Enter request
      cy.get('main.q-page textarea').first().should('be.visible').click()
      cy.get('main.q-page textarea[aria-label]').invoke('val', buyStepInform).type('{enter}')
      // Go to last seller step
      cy.get('main.q-page div').contains('Customer claims to have send the SavPay transaction').should('be.visible')
      checkItemData()
      checkAddress()
    })
    // Check payment dialog
    cy.iframe().within(() => {  
      cy.get('main.q-page button span').contains('Check payment').click()
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(0).click()
    })
    checkHistory('user.two', '')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(1).click()
    })
    checkHistory('EOS7rPddBX71GSqpQn9Yp13a1zqk8PEJVFxjHUpStyDSCaEeiAeZj', 'user.two')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(2).click()
    })
    checkOpenLink('https://bloks.io/account/user.two')
    cy.iframe().within(() => {  
      cy.get('div[role="dialog"]').should('be.visible').find('button.q-btn').eq(3).contains('Close').click()
    })
  })
})


function checkOpenLink(link: string){
  cy.get('div[role="dialog"]').contains('Open link in a new tab').should('be.visible').next().contains(link).next().find('.q-btn span').contains('Cancel').click()
}

function checkItemData(){
  cy.get('main.q-page div.text-bold').contains('Cheap planet with great landscapes').should('be.visible')
  cy.get('main.q-page i.q-chip__icon').contains('storefront').should('be.visible').next().contains('user.two').should('be.visible')
  cy.get('main.q-page .q-chip__content div').contains('1 piece for 123.00 USD').should('be.visible')
  cy.get('main.q-page .q-chip__content div').contains('United Arab Emirates for 140.00 USD within 8 days').should('be.visible')
  cy.get('main.q-page .q-chip__content div').contains('263.00 USD').should('be.visible')
  cy.get('main.q-page .q-chip__content span.text-bold').contains('EOS').should('be.visible')
}

function checkAddress(){
  cy.get('main.q-page textarea[rows="6"]').invoke('val').then((text) => {
    expect(text).to.not.be.empty;
  });
  cy.get('main.q-page input[aria-label="Note"]').invoke('val').then((text) => {
    expect(text).to.not.be.empty;
    expect(text).to.eq('With onions, please');
  })
  cy.get('main.q-page div.q-toggle__label').contains('Post view').parent().click()
  cy.get('main.q-page div.text-h6').contains('Customers address').parent().parent().find('input[readonly]').should('have.length', 10)
}

function checkHistory(user: string, to: string){
  cy.get('header span').contains('History').should('be.visible')
  cy.get('main.q-page .q-table__container input[type="text"]').should('be.visible').eq(0).invoke('val').then((text) => {
    if(user.length > 0){
      expect(text).to.not.be.empty;
      expect(text).to.eq(user);
    } else {
      expect(text).to.be.empty;
    }
  })
  cy.get('main.q-page .q-table__container input[type="text"]').should('be.visible').eq(1).invoke('val').then((text) => {
    if(to.length > 0){
      expect(text).to.not.be.empty;
      expect(text).to.eq(to);
    } else {
      expect(text).to.be.empty;
    }
  })
  cy.get('header i.q-icon').contains('arrow_back_ios_new').click()
}

const buyStepRequest = `{"id":0,"category":"792915009393917952","to":"ww","token":{"symbol":{"precision":4,"name":"EOS"},"contract":"eosio.token","chain":"eos"},"pcs":1,"item":{"id":0,"category":"792915009393917952"},"rId":"bmA2lXSD08","seller":"user.two","buyer":{"address":{"firstName":"Sav","middleNames":"","lastName":"Act","country":"AE","state":"Front side","city":"Crater","postal":"12345","addressL1":"Sun street 12","addressL2":"","note":"With onions, please"},"acc":"savact","sigDate":1726647384162,"pubPgp":""},"step":1}`
const buyStepInform =  `{"id":0,"category":"792915009393917952","to":"ww","token":{"symbol":{"precision":4,"name":"EOS"},"contract":"eosio.token","chain":"eos"},"pcs":1,"item":{"id":0,"category":"792915009393917952"},"rId":"ZOyUzc9FbZ","seller":"user.two","buyer":{"address":{"firstName":"Sav","middleNames":"","lastName":"Act","country":"AE","state":"Front side","city":"Crater","postal":"12345","addressL1":"Sun street 12","addressL2":"","note":"With onions, please"},"acc":"savact","sigDate":1726647455227,"pubPgp":""},"step":3,"trx":{"to":"user.two","from":"EOS7rPddBX71GSqpQn9Yp13a1zqk8PEJVFxjHUpStyDSCaEeiAeZj","t":1727597856.805,"memo":"EOS7rPddBX71GSqpQn9Yp13a1zqk8PEJVFxjHUpStyDSCaEeiAeZj@user.two!7KGJN9;huoM4rkf8N","pay":"550.2127 EOS eosio.token","chain":"eos"}}`
const buyStepFinal =   `{"id":0,"category":"792915009393917952","to":"ww","token":{"symbol":{"precision":4,"name":"EOS"},"contract":"eosio.token","chain":"eos"},"pcs":1,"item":{"id":0,"category":"792915009393917952"},"rId":"huoM4rkf8N","seller":"user.two","buyer":{"address":{"firstName":"Sav","middleNames":"","lastName":"Act","country":"AE","state":"Front side","city":"Crater","postal":"12345","addressL1":"Sun street 12","addressL2":"","note":"With onions, please"},"acc":"savact","sigDate":1726647414033,"pubPgp":""},"step":5,"trx":{"to":"user.two","from":"EOS7rPddBX71GSqpQn9Yp13a1zqk8PEJVFxjHUpStyDSCaEeiAeZj","t":1727597815.484,"memo":"EOS7rPddBX71GSqpQn9Yp13a1zqk8PEJVFxjHUpStyDSCaEeiAeZj@user.two!7KGJN9;huoM4rkf8N","pay":"550.2127 EOS eosio.token","chain":"eos"}}`