<?php

declare(strict_types=1);

namespace Funarbe\Pagamentos\Model;

use Magento\Payment\Model\Method\AbstractMethod;

class CartaoAlimentacao extends AbstractMethod
{
    public const CODE = 'cartao_alimentacao_se';

    protected $_code = self::CODE;
    protected $_isOffline = true;

}
