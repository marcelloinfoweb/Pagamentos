<?php

declare(strict_types=1);

namespace Funarbe\Pagamentos\Model;

use Magento\Payment\Model\Method\AbstractMethod;

class Chequinho extends AbstractMethod
{
    public const CODE = 'chequinho_se';

    protected $_code = self::CODE;
    protected $_isOffline = true;

}
