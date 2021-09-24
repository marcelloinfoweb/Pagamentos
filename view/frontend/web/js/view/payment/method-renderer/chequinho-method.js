define(
    [
        'Magento_Checkout/js/view/payment/default',
        'jquery',
        'Magento_Checkout/js/model/quote',
        'Magento_Customer/js/model/customer',
        'mage/url'
    ],
    function (Component, $, quote, customer, url) {
        'use strict';
        // baseUrl já tem barra (/) no fim da url
        const baseUrl = url.build('')

        const urlControle = 'https://controle.supermercadoescola.org.br/site'
        const urlEcommerce = baseUrl
        const urlApi = 'rest/V1/funarbe-supermercadoescolaapi/integrator-rm-cliente-fornecedor'
        const urlApiLimiteDisponivel = 'rest/V1/funarbe-supermercadoescolaapi/integrator-rm-cliente-fornecedor-limite-disponivel'

        async function getBuscaPontoUfv() {
            try {
                const respUfv = await fetch(urlControle + "/abertura-ponto-ufv-api")
                return await respUfv.json()
            } catch (error) {
                console.log(error)
            }
        }

        async function getBuscaPontoFnb() {
            try {
                const respFnb = await fetch(urlControle + "/abertura-ponto-fnb-api")
                return await respFnb.json()
            } catch (error) {
                console.log(error)
            }
        }

        async function getDadosIntegrator(cpf) {
            try {
                const integrator = await fetch(urlEcommerce + urlApi + '?cpf=' + cpf)
                return await integrator.json()
            } catch (error) {
                console.log(error)
            }
        }

        async function getDadosIntegratorLimiteDisponivel(cpf, dataAbertura, dataFechamento) {
            try {
                const integratorLimiteDisponivel = await fetch(urlEcommerce + urlApiLimiteDisponivel + '?cpf=' + cpf + '&expand=LIMITEDISPONIVELCHEQUINHO&dataAbertura=' + dataAbertura + '&dataFechamento=' + dataFechamento)
                return await integratorLimiteDisponivel.json()
            } catch (error) {
                console.log(error)
            }
        }

        async function verificaCPF() {
            const cpf = customer.customerData.taxvat
            const integrator = await getDadosIntegrator(cpf)
            if (integrator.length !== 0) {
                const matricula = integrator[0]['CAMPOLIVRE']

                if (matricula.startsWith('F')) {
                    $('#ufv').remove()
                    $('.sy-checkout-payment-check-card-title.ufv').remove()

                    const pontoFnb = await getBuscaPontoFnb()
                    const dataAbertura = pontoFnb.data_inicio
                    const dataFechamento = pontoFnb.data_final

                    const date = dataAbertura.split('-')
                    $('#dataInicioFnbAno').text(date[0])
                    $('#dataInicioFnbMes').text(date[1])
                    $('#dataInicioFnbDia').text(date[2])

                    await logica(cpf, dataAbertura, dataFechamento)

                } else {
                    $('#fnb').remove()
                    $('.sy-checkout-payment-check-card-title.fnb').remove()

                    const pontoUfv = await getBuscaPontoUfv()
                    const dataAbertura = pontoUfv.data_inicio
                    const dataFechamento = pontoUfv.data_final

                    const date = dataAbertura.split('-')
                    $('#dataInicioUfvAno').text(date[0])
                    $('#dataInicioUfvMes').text(date[1])
                    $('#dataInicioUfvDia').text(date[2])

                    await logica(cpf, dataAbertura, dataFechamento)

                }
            } else {
                $('input:radio[id="chequinho_se"]').change(
                    function () {
                        $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true);
                    }
                )
                $('#ufv').remove()
                $('#fnb').remove()
                $('.sy-checkout-payment-check-card-title').remove()
                $('#dadosRm').remove()
                $('#alert').html('<br><br>' +
                    '<div class="message info error" role="alert">' +
                    'Cadastro de funcionário não encontrado, tente outra forma de pagamento.' +
                    '</div>')
            }
        }

        async function logica(cpf, dataAbertura, dataFechamento) {
            const data = await getDadosIntegratorLimiteDisponivel(cpf, dataAbertura, dataFechamento)
            const nome = data[0].NOME
            const cc = data[0].CGCCFO
            const cpfcnpj = cc.substring(0, 7) + ".***-**" + cc.substring(14, cc.length)
            const limiteChequinho = parseFloat(data[0].LIMITECREDITO)
            const limiteChequinhoFormatado = limiteChequinho.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            })
            const limiteDisponivelChequinho = data[0].LIMITEDISPONIVELCHEQUINHO
            const limiteDisponivelChequinhoFormatado = limiteDisponivelChequinho.toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            })
            $('#integNomeCliente').text(nome)
            $('#integCpfCnpjCliente').text(cpfcnpj)
            $('#limiteChequinho').text("Limite: " + limiteChequinhoFormatado)
            $('#limiteDisponivelChequinho').text("Disponível: " + limiteDisponivelChequinhoFormatado)

            const totals = quote.totals();
            const valorTotal = (totals ? totals : quote)['grand_total']

            $('input:radio[id="chequinho_se"]').change(
                function () {
                    if (valorTotal > limiteDisponivelChequinho) {
                        $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true);
                        $('#alert').html('<br><br>' +
                            '<div class="message-error error message" role="alert">' +
                            '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">Valor da compra excede o valor do limite disponível de ' + limiteDisponivelChequinhoFormatado + '</div>' +
                            '</div>')
                    } else {
                        $('#alert').html('<br><br>' +
                            '<div class="message-success success message" role="alert">' +
                            '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">Valor da compra não excede o valor do limite disponível de ' + limiteDisponivelChequinhoFormatado + '</div>' +
                            '</div>')
                    }
                }
            );
        }

        verificaCPF()
            .then()
            .catch(e => console.log('Erro:', e));

        return Component.extend({
            defaults: {
                template: 'Funarbe_Pagamentos/payment/chequinho-template'
            },
            getMailingAddress: function () {
                return window.checkoutConfig.payment.checkmo.mailingAddress;
            }
        });
    }
);

