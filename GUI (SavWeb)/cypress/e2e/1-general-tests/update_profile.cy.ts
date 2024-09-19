describe('update account', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000/savact.app/#/_browser_')
  })

  it('passes update public pgp key', () => {    
    cy.iframe().within(() => {
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')

      // find element called aside
      cy.get('#immortal-shop').find('button').contains('menu').click().click()
      cy.get('#immortal-shop').find('aside').should('be.visible')
      cy.get('#immortal-shop').find('aside').contains('Profile').click()

      // Load account
      cy.get('#immortal-shop').find('button').contains('keyboard_arrow_down').click()
      cy.get('#immortal-shop').find('textarea[aria-label="Public PGP Key"]').should((t) => {
        expect(t.val()).be.empty;
      });
      cy.get('#immortal-shop').find('input[type="text"]').first().type('user.two')
      cy.get('#immortal-shop').find('span').contains('send').click()
      cy.get('#immortal-shop').get('div.q-notification.q-notification--standard.bg-positive').should('be.visible')

      // Check loaded key
      cy.get('#immortal-shop').find('textarea[aria-label="Public PGP Key"]').invoke('val').as('pupKey').then((text) => {
        expect(text).to.not.be.empty;
      });
      // store the key for later use
      // cy.get('@pupKey').then((pupKey) => {
      //   cy.log(typeof pupKey === 'string' ? pupKey : 'empty ' + typeof pupKey);        
      // });

      cy.get('#immortal-shop').find('span').contains('Upload user data').click()
    });
    // Check if key is valid
    cy.get('div[role="dialog"]').should('exist').should('be.visible').find('div').contains('Sign transaction on chain lamington').should('be.visible')
    cy.get('div[role="dialog"]').find('span').contains('OK').click()
    cy.get('div.q-notification.q-notification--standard.bg-negative').should('be.visible')
    cy.get('div.q-notification.q-notification--standard.bg-negative').contains('No user is logged in').should('be.visible')

    cy.iframe().within(() => {
      // Clear text area for key
      cy.get('div').contains('Encryption').parent().find('button').click()
      cy.get('#immortal-shop').find('textarea[aria-label="Public PGP Key"]').clear()
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').should('be.visible')
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').next().invoke('text').should('be.empty')
      cy.get('#immortal-shop').find('span').contains('Upload user data').click()
      cy.get('div').contains('Encryption').parent().find('button').click()
    });
    // Check if no key is okay
    cy.get('div[role="dialog"]').should('exist').should('be.visible').find('div').contains('Sign transaction on chain lamington').should('be.visible')
    cy.get('div[role="dialog"]').find('span').contains('OK').click()
    cy.get('div.q-notification.q-notification--standard.bg-negative').should('be.visible')
    cy.get('div.q-notification.q-notification--standard.bg-negative').contains('No user is logged in').should('be.visible')

    cy.iframe().within(() => {
      // Create new key pair
      cy.get('div').contains('Encryption').parent().find('button').click()
      cy.get('#immortal-shop').find('span').contains('Create new key').click() 
      cy.get('div[role="dialog"]').should('be.visible').find('span').contains('Generate new key').click() 
      cy.get('div[role="dialog"]').find('div.q-checkbox').should('be.visible').click()
      cy.get('div[role="dialog"]').find('span').contains('content_copy').click()
      cy.get('div[role="dialog"]').find('span').contains('Use this key').click()
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').should('be.visible')
      cy.get('#immortal-shop').find('span').contains('Fingerprint:').next().invoke('text').should('not.be.empty')
      cy.get('#immortal-shop').find('span').contains('Upload user data').click()
    });
    cy.get('div[role="dialog"]').should('be.visible').find('div').contains('Sign transaction on chain lamington').should('be.visible')
    cy.get('div[role="dialog"]').find('span').contains('OK').click()
    cy.get('div.q-notification.q-notification--standard.bg-negative').should('be.visible')
    cy.get('div.q-notification.q-notification--standard.bg-negative').contains('No user is logged in').should('be.visible')
  })

  it('passes update remaining account data', () => {  
    // Wait for loading page
    cy.iframe().within(() => {  
      // Go to sell page
      cy.get('div#q-app').should('be.visible').parent().should('be.visible')
      cy.get('i.q-icon').contains('person').should('be.visible').click()

      cy.get('main.q-page .q-card span.block').contains('Get your user data').should('be.visible').click()
    })
    cy.get('div[role="dialog"] div.q-card__section').contains('Page requests user account').should('be.visible').parent().find('button.q-btn span.block').first().contains('Cancel').should('be.visible').click()
    cy.iframe().within(() => { 
      // Switch from test net to main net to test net
      cy.get('main.q-page .q-card i[role="img"]').contains('keyboard_arrow_down').should('be.visible').click()
      cy.get('main.q-page label.q-field input[role="combobox"][value="Lamington Testnet"]').parent().should('be.visible').click().wait(300)
      cy.get('div[role="listbox"] div[role="option"].q-item span').contains('Lamington Testnet').type('{downarrow}{downarrow}{downarrow}')
      cy.get('div[role="listbox"] div[role="option"].q-item span').contains('EOS').should('be.visible').click()
      cy.get('main.q-page label.q-field input[role="combobox"][value="EOS"]').parent().should('be.visible').click()
      cy.get('div[role="listbox"] div[role="option"].q-item span').contains('EOS').should('be.visible').type('T{downarrow}{downarrow}{enter}')
      cy.get('main.q-page label.q-field input[role="combobox"][value="Lamington Testnet"]').parent().should('be.visible')
      // Enter account name
      cy.get('main.q-page input[type="text"][aria-label="Enter your user name manually"]').should('be.visible').wait(200).type('user.one').wait(200).parent().parent().parent().next().find('button.q-btn').click()
      cy.get('div#q-notify div').contains('Account is valid').should('be.visible')

      // Upload user data as only buyer click
      cy.get('main.q-page button.q-btn').contains('Upload user data').should('be.visible').click()
    })
    cy.get('div[role="dialog"] div.q-card__section').contains('Sign transaction on chain lamington').should('be.visible').parent().find('button.q-btn span.block').first().contains('Cancel').should('be.visible').click()
    cy.iframe().within(() => {
      // Activate seller
      cy.get('main.q-page div.q-card div').contains('I am a seller').should('be.visible').next().click()
      // Allowed tokens
      cy.get('main.q-page input[aria-label="Allowed tokens"]').parent().should('be.visible').click().wait(4000)
      cy.get('div[role="listbox"] div[role="option"].q-item span').contains('EOS eosio.token@eos').should('be.visible').click()
      cy.get('div[role="listbox"] div[role="option"].q-item span').contains('SAVACT token.savact@eos').should('be.visible').click()
      cy.get('div[role="listbox"] button.q-btn').should('be.visible').click()
      // Contact addresses
      cy.get('main.q-page input[aria-label="Contact"]').parent().should('be.visible').type(contact).parent().parent().parent().parent()
      .find('button.q-btn i.q-icon').contains('add').parent().should('be.visible').find('span.block').contains('Telegram').should('be.visible').click()
      cy.get(`main.q-page input[value="${contact}"][disabled][type="text"]`).parent().should('be.visible').parent().parent().parent().parent().find('button.q-btn span.block').contains('Telegram').should('be.visible').click()
    })
    cy.get('div[role="dialog"]').contains('Open link in a new tab').should('be.visible').next().contains('https://' + contact).next().find('.q-btn span').contains('Cancel').click()
    cy.iframe().within(() => {
      // Enter note for all customers
      cy.get('main.q-page textarea[aria-label="Note for all customers"]').should('be.visible').click()
      cy.get('main.q-page textarea[aria-label="Note for all customers"]').invoke('val', noteForCustomers).trigger('input')
      
      // Upload user data as seller without pgp key click
      cy.get('main.q-page button.q-btn').contains('Upload user data').should('be.visible').click()
    })
    cy.get('div[role="dialog"] div.q-card__section').contains('Sign transaction on chain lamington').should('be.visible').parent().find('button.q-btn span.block').first().contains('Cancel').should('be.visible').click()
    cy.iframe().within(() => {
      // Delete account
      cy.get('main.q-page button.q-btn').contains('Delete user').should('be.visible').click()
    })
    cy.get('div[role="dialog"] div.q-card__section').contains('Sign transaction on chain lamington').should('be.visible').parent().find('button.q-btn span.block').first().contains('Cancel').should('be.visible').click()
  })
})

const contact = 't.me/SavAct'
const noteForCustomers = 'Please note that the product is not refundable. If you have any questions, please contact us at ' + contact