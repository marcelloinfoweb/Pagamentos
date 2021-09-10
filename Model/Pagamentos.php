<?php

declare(strict_types=1);

namespace Funarbe\Pagamentos\Model;

use Magento\Payment\Model\Method\AbstractMethod;

class Pagamentos extends AbstractMethod
{
    public const CODE = 'funarbe_pagamentos';

    protected $_code = self::CODE;
    protected $_isOffline = true;

}
