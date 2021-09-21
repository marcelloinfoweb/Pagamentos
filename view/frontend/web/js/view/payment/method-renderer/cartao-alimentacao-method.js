define(
    [
        'Magento_Checkout/js/view/payment/default',
        'jquery',
        'Magento_Checkout/js/model/quote',
        'Magento_Customer/js/model/customer',
        'mage/url'
    ],
    function (Component, $, quote, customer, url) {
        'use strict'
        // baseUrl já tem barra (/) no fim da url
        const baseUrl = url.build('')

        const urlEcommerce = baseUrl
        const urlApi = 'rest/V1/funarbe-supermercadoescolaapi/integrator-rm-cliente-fornecedor'

        async function getDadosIntegrator(cpf) {
            try {
                const integrator = await fetch(urlEcommerce + urlApi + '?cpf=' + cpf)
                return await integrator.json()
            } catch (error) {
                console.log(error)
            }
        }

        async function verificaCPF() {
            const cpf = customer.customerData.taxvat
            const data = await getDadosIntegrator(cpf)
            if (data.length != 0) {
                const matricula = data[0]['CAMPOLIVRE']
                if (matricula.startsWith('F')) {

                    const nome = data[0].NOME
                    const cc = data[0].CGCCFO //cpf cliente
                    const cpf = cc.substring(0, 7) + ".***-**" + cc.substring(14, cc.length)
                    const saldoCA = parseFloat(data[0].SALDOCARTAOALIMENTACAO)
                    const saldoCAFormatado = saldoCA.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                    const limiteSaldoCA = data[0].SALDOCARTAOALIMENTACAO
                    const limiteSaldoCAFormatado = limiteSaldoCA.toLocaleString('pt-br', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                    $('#nomeCliente').text(nome)
                    $('#cpfCliente').text(cpf)
                    $('#saldoDisponivel').text("Saldo: " + saldoCAFormatado)

                    const totals = quote.totals();
                    const valorTotal = (totals ? totals : quote)['grand_total']

                    $('input:radio[id="cartao_alimentacao_se"]').change(
                        function () {
                            if (valorTotal < limiteSaldoCA) {
                                $('#alertCA').html('<br>' +
                                    '<div class="message-success success message" role="alert">' +
                                    '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">Valor da compra não excede o valor do saldo disponível de ' + limiteSaldoCAFormatado + '</div>' +
                                    '</div>'
                                )
                            } else {
                                $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true)
                                $('#alertCA').html('<br>' +
                                    '<div class="message info error" role="alert">' +
                                    '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">Valor da compra excede o valor do saldo disponível de ' + limiteSaldoCAFormatado + '</div>' +
                                    '</div>'
                                )
                            }
                        })
                } else {
                    $('input:radio[id="cartao_alimentacao_se"]')
                        .change(function () {
                            $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true);
                        })

                    $('#dadosRmCa').remove()
                    $('#alertCA').html('<br><br>' +
                        '<div class="message info error" role="alert">' +
                        '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">Cadastro de funcionário não encontrado, tente outra forma de pagamento.</div>' +
                        '</div>'
                    )
                }
            }
        }

        verificaCPF()

        return Component.extend({
            defaults: {
                template: 'Funarbe_Pagamentos/payment/cartao-alimentacao-template'
            },
            getMailingAddress: function () {
                return window.checkoutConfig.payment.checkmo.mailingAddress
            }
        })

    }
);
