/*
 * This file is part of the Kreta package.
 *
 * (c) Beñat Espiña <benatespina@gmail.com>
 * (c) Gorka Laucirica <gorka.lauzirika@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import {Link} from 'react-router';

import './../../scss/components/_link-inline.scss';

export default props => {
  const
    {children, classModifiers, ...otherProps} = props,
    className = `link-inline ${classModifiers}`;

  return (
    <Link {...otherProps} className={className}>
      {children}
    </Link>
  );
};
