describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/accueil') // change URL to match your dev URL
    cy.contains('SeniorLove')
    cy.get('form').last().within(($form) => {
      cy.get('input[type="radio"]').check('Homme')
      cy.get('input[name="age"]').type('61')
      cy.root().submit()
    })
  })
})