<?php

/**
 * This file belongs to Kreta.
 * The source code of application includes a LICENSE file
 * with all information about license.
 *
 * @author benatespina <benatespina@gmail.com>
 * @author gorkalaucirica <gorka.lauzirika@gmail.com>
 */

namespace Kreta\CoreBundle\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * Class UserRepository.
 *
 * @package Kreta\CoreBundle\Rpository
 */
class UserRepository extends EntityRepository
{
    /**
     * Finds all the user that exist into database.
     *
     * @return \Kreta\CoreBundle\Model\Interfaces\UserInterface[]
     */
    public function findAll()
    {
        return $this->createQueryBuilder('u')->getQuery()->getResult();
    }
}
