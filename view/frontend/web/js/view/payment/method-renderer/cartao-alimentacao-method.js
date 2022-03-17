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
        // urlEcommerce já tem barra (/) no fim da url
        const urlEcommerce = url.build('')
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

            if (data.length !== 0) {
                const nome = data[0].NOME
                const cc = data[0].CGCCFO //cpf cliente
                const cpfcnpj = cc.substring(0, 7) + ".***-**" + cc.substring(14, cc.length)

                console.log(data)

                const matricula = data[0]['CAMPOLIVRE']
                $('#nomeCliente').html(nome)
                $('#cpfCliente').html(cpfcnpj)

                if (matricula.startsWith('F')) {

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
                    $('#saldoDisponivel').text("Saldo: " + saldoCAFormatado)

                    const totals = quote.totals();
                    const valorTotal = (totals ? totals : quote)['grand_total']

                    $('input:radio[id="cartao_alimentacao_se"]').change(
                        function () {
                            if (valorTotal < limiteSaldoCA) {
                                $('#alertCA').html('<br>' +
                                    '<div class="message-success success message" role="alert">' +
                                    '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">' +
                                    'Valor da compra não excede o valor do saldo disponível de ' + limiteSaldoCAFormatado +
                                    '</div>' +
                                    '</div>')
                            } else {
                                $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true)
                                $('#alertCA').html('<br>' +
                                    '<div class="message-error error message" role="alert">' +
                                    '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">' +
                                    'Valor da compra excede o valor do saldo disponível de ' + limiteSaldoCAFormatado +
                                    '</div>' +
                                    '</div>')
                            }
                        }
                    )
                } else {
                    $('input:radio[id="cartao_alimentacao_se"]').change(function () {
                        $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true);
                    })

                    $('#alertCA').html('<br><br>' +
                        '<div class="message-error error message" role="alert">' +
                        '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">' +
                        'Não é possível usar esse método de pagamento, tente outra opção.' +
                        '</div>' +
                        '</div>')
                }

            } else {
                $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true);
                $('input:radio[id="cartao_alimentacao_se"]').change(function () {
                    $('.checkout-payment-method .actions-toolbar .primary').prop("disabled", true);
                })
                $('#dadosRmCa').remove()
                $('#alertCA').html('<br><br>' +
                    '<div class="message-error error message" role="alert">' +
                    '<div data-bind="html: $parent.prepareMessageForHtml(message.text)">' +
                    'Não é possível usar esse método de pagamento, tente outra opção.' +
                    '</div>' +
                    '</div>')
            }
        }

        verificaCPF().then().catch(e => console.log('Erro:', e))

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
