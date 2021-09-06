define([
        'jquery',
        'Magento_Payment/js/view/payment/cc-form'
    ],
    function ($, Component) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'Funarbe_Pagamentos/payment/pagamantostemplate'
            },

            context: function () {
                return this;
            },

            getCode: function () {
                return 'funarbe_pagamentos';
            },

            isActive: function () {
                return true;
            }
        });
    }
);
