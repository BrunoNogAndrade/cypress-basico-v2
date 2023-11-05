/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {

    beforeEach(function(){
    cy.visit('./src/index.html')
})

    it('Verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatorios e envia formulario', function(){
        const longText = 'Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste, Teste'
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Nogueira Andrade')
        cy.get('#email').type('dincson@gmail.com')
        cy.get('#open-text-area').type(longText,{ delay: 0})
        cy.contains('button', 'Enviar').click()
         
        cy.get('.success').should('be.visible')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação incorreta', function(){
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Nogueira Andrade')
        cy.get('#email').type('dincson@gmail,com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('Campo telefone continua vazio quando preenchido com valor não numerico', function(){
        cy.get('#phone')
            .type('testecampocomletras')
            .should('have.value', '')    
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', function(){
        cy.get('#firstName').type('Bruno')
        cy.get('#lastName').type('Nogueira Andrade')
        cy.get('#email').type('dincson@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')  
    })

    it('Preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('Bruno')
            .should('have.value', 'Bruno')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Nogueira Andrade')
            .should('have.value', 'Nogueira Andrade')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('dincson@gmail.com')
            .should('have.value', 'dincson@gmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('123456780')
            .should('have.value', '123456780')
            .clear()
            .should('have.value', '')
            cy.contains('button', 'Enviar').click()
            cy.get('.error').should('be.visible')  
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatorios', function(){
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')  
    })

    it('Envia o formulário com sucesso usando um comando customizado', function(){
        cy.filMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    })

    it('Seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })

    it('Seleciona um produto (Mentoria) pelo seu valor', function(){
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')
    })

    it('Seleciona um produto (Blog) pelo seu indice', function(){
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')
    })

    //Trabalhando com radio button
    //teste selecionando somente um radio button
    it('Marca o tipo de atendimento Feedback', function(){
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('have.value', 'feedback')
 
    })

    //each para trabalhar com array
    //teste marcando cada um dos radio buttons
    it('Marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio){
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
        })

    //Trabalhando com check box
    it('Marca ambos check box e desmarca o último', function(){
        cy.get('input[type="checkbox"]')
          .check()
          .should('be.checked')//assert para verificar se todos foram MARCADOS
          .last()//desmarca o ultimo check
          .uncheck()
          .should('not.be.checked')//assert para verificar se todos foram DESMARCADOS
    })

    //Trabalhando com arquivos para anexos (anexar arquivos), AULA 29
    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input){//função recebe o elemento passado no get
                //Log para se verificar o(s) arquivo(s) inseridos do select File
                //para ser conferido no console do cypress, onde são executados os testes
                //console.log($input)
            //Verifica que o primeiro input do array e seu nome é igual 
            //o do arquivo que foi carregado no select File
            expect($input[0].files[0].name).to.equal('example.json')
            })
    })

 //Simulação de dragn-and-drop, que é quando arrastamos um arquivo pelo mouse diretamente
 //na caixinha de seleção de arquivos
 it('seleciona um arquivo simulando drag-and-drop', function(){
    //cy.fixture pega o arquivo diretamente do diretorio de fixtures,
    //sem necessidade de passar o caminho como no exemplo anterior
    //no as se dá o nome para o arquivo, que é informado no select File
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('@sampleFile', {action: 'drag-drop'})
        .should(function($input){     
        expect($input[0].files[0].name).to.equal('example.json')
        })
})
 
//Links que abrem outra página
//Trata sobre páginas que abrem outra página quando ocorre um clique ou algo similar
//este tipo de validação ocorre sem ter que precisar clicar no link, pois pode quebrar o teste
//quando se avança para uma outra página
it('verifica que a politica de privacidade abre em outra aba sem a necessidade de um clique', function(){
    //elemento id="privacy" possui um a
    //no should o have.attr é relacionado a atributo
    //é passado o atributo que vamos verificar que é o target
    //e o valor do target que é _blank
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
})

it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
    cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
    //A asserção para este caso é verificar o texto da página que iria ser aberta
    cy.contains('Talking About Testing').should('be.visible')
})



  })
   