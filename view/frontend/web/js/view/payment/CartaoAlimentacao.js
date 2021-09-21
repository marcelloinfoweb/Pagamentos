define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (Component, rendererList) {
        'use strict';

        rendererList.push(
            {
                type: 'cartao_alimentacao_se',
                component: 'Funarbe_Pagamentos/js/view/payment/method-renderer/cartao-alimentacao-method'
            }
        );

        /** Add view logic here if needed */
        return Component.extend({});
    }
);
