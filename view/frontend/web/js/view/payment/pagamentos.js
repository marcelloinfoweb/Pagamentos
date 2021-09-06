define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (Component, rendererList) {
        'use strict';

        rendererList.push(
            {
                type: 'funarbe_pagamentos',
                component: 'Funarbe_Pagamentos/js/view/payment/method-renderer/pagamentos'
            }
        );

        /** Add view logic here if needed */
        return Component.extend({});
    }
);
