define(
    [
        'Magento_Checkout/js/view/payment/default',
        'jquery',
    ],
    function (Component) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Funarbe_Pagamentos/payment/cartao-alimentacao-template'
            },
            getMailingAddress: function () {
                return window.checkoutConfig.payment.checkmo.mailingAddress;
            }
        });

    }
);
