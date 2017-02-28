<?php

/*
 * This file is part of the Kreta package.
 *
 * (c) Beñat Espiña <benatespina@gmail.com>
 * (c) Gorka Laucirica <gorka.lauzirika@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Kreta\IdentityAccess\Application\Query;

class UsersOfSearchStringQuery
{
    private $search;

    public function __construct($search)
    {
        $this->search = $search;
    }

    public function search() : string
    {
        return $this->search;
    }
}
