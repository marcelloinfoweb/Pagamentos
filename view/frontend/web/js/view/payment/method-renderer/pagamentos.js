define(
    [
        'Magento_Checkout/js/view/payment/default',
        'jquery',
    ],
    function (Component, $) {
        'use strict';

        function buscaPontoUfv() {
            $.ajax({
                url: "https://controle.supermercadoescola.org.br/site/abertura-ponto-ufv-api",
                type: 'GET',
                complete: function (response) {
                    const dataInicio = response.responseJSON['data_inicio']
                    const formmated = dataInicio.split('-')
                    $('#dataInicioUfvAno').text(formmated[0])
                    $('#dataInicioUfvMes').text(formmated[1])
                    $('#dataInicioUfvDia').text(formmated[2])
                },
                error: function (xhr, status, errorThrown) {
                    console.log('Error happens. Try again.')
                }
            })
        }

        function buscaPontoFnb() {
            $.ajax({
                url: "https://controle.supermercadoescola.org.br/site/abertura-ponto-fnb-api",
                type: 'GET',
                complete: function (response) {
                    const dataInicio = response.responseJSON['data_inicio']
                    const formmated = dataInicio.split('-')
                    $('#dataInicioFnbAno').text(formmated[0])
                    $('#dataInicioFnbMes').text(formmated[1])
                    $('#dataInicioFnbDia').text(formmated[2])
                },
                error: function (xhr, status, errorThrown) {
                    console.log('Error happens. Try again.')
                }
            })
        }

        buscaPontoFnb()
        buscaPontoUfv()

        return Component.extend({
            defaults: {
                template: 'Funarbe_Pagamentos/payment/pagamantostemplate'
            },
            getMailingAddress: function () {
                return window.checkoutConfig.payment.checkmo.mailingAddress;
            }
        });

    }
);
