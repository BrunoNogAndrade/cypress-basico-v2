//Este teste é para ser feito diretamente abrindo a páina
it.only('testa a página da política de privacidade de forma independente', function(){
    cy.visit('./src/privacy.html')
    //A asserção para este caso é verificar o texto da página que iria ser aberta
    cy.contains('Talking About Testing').should('be.visible')
})