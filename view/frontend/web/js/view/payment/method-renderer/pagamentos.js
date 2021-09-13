define(
    [
        'Magento_Checkout/js/view/payment/default',
        'jquery',
    ],
    function (Component, $, checkoutjs) {
        'use strict';

        function buscaPontoUfv()
        {
            const customurl = "https://dev.marcelo.supermercado-escola/rest/V1/funarbe-supermercadoescolaapi/abertura-ponto-ufv";
            $.ajax({
                url: customurl,
                type: 'GET',
                dataType: 'json',
                complete: function (response) {
                    const dataInicio = response.responseJSON[0]['data_inicio']
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

        function buscaPontoFnb()
        {
            const customurl = "https://dev.marcelo.supermercado-escola/rest/V1/funarbe-supermercadoescolaapi/abertura-ponto"
            $.ajax({
                url: customurl,
                type: 'GET',
                dataType: 'json',
                complete: function (response) {
                    const dataInicio = response.responseJSON[0]['data_inicio']
                    const formmated = dataInicio.split('-')
                    $('#dataInicioAno').text(formmated[0])
                    $('#dataInicioMes').text(formmated[1])
                    $('#dataInicioDia').text(formmated[2])
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
            },
            isDisplayed: function () {
                var customer = customerData.get('customer');
                console.log(customer().firstname);
            }
        });

    }
);
