/*
 * This file is part of the Kreta package.
 *
 * (c) Beñat Espiña <benatespina@gmail.com>
 * (c) Gorka Laucirica <gorka.lauzirika@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import './../../scss/compositions/_members.scss';

import AddIcon from './../../svg/add.svg';
import CrossIcon from './../../svg/cross.svg';
import ExitIcon from './../../svg/exit.svg';

import React from 'react';

import {routes} from './../../Routes';

import Button from './../component/Button';
import Icon from './../component/Icon';
import LinkInline from './../component/LinkInline';
import LinkToggle from './../component/LinkToggle';
import Section from './../component/Section';
import SectionHeader from './../component/SectionHeader';
import UserCard from './../component/UserCard';

class Members extends React.Component {
  static propTypes = {
    currentPath: React.PropTypes.string.isRequired,
    organization: React.PropTypes.object.isRequired,
    profile: React.PropTypes.object.isRequired,
    removeMember: React.PropTypes.func.isRequired,
  };

  getOwners() {
    const
      {organization, profile} = this.props,
      leaveAction = (
        <LinkInline classModifiers="link-inline--red" to={null}>
          <Icon color="red" glyph={ExitIcon} size="small"/>Leave organization
        </LinkInline>
      );

    return organization.owners.map((owner, index) => (
      <UserCard
        actions={
          organization.owners.length > 1 && owner.id === profile.user_id
            ? leaveAction
            : null
        }
        key={index}
        user={owner}
      />
    ));
  }

  noMembers() {
    return (
      <p className="members__no-member-sentence">
        No members found, you may want to add someone so, please
        click on "<strong>Add members</strong>" button.
      </p>
    );
  }

  getMembers() {
    const {organization} = this.props;

    if (organization.organization_members.length === 0) {
      return this.noMembers();
    }

    return organization.organization_members.map((member, index) => (
      <UserCard
        actions={
          <Button
            color="red"
            onClick={this.removeMember.bind(this, member)}
            type="icon"
          >
            <Icon color="white" glyph={CrossIcon} size="expand"/>
          </Button>
        }
        key={index}
        user={member}
      />
    ));
  }

  removeMember(member) {
    const {removeMember} = this.props;

    return removeMember(member);
  }

  renderSectionHeader(title, toFunction) {
    const {organization, currentPath} = this.props;

    return (
      <SectionHeader
        actions={
          <LinkToggle
            currentPath={currentPath}
            disableLink={
              <LinkInline to={toFunction(organization.slug)}>
                <Icon color="green" glyph={AddIcon} size="small"/>Add {title.toLowerCase()}
              </LinkInline>
            }
            enableLink={
              <LinkInline classModifiers="link-inline--red" to={routes.organization.show(organization.slug)}>
                <Icon color="red" glyph={CrossIcon} size="small"/>Close bar
              </LinkInline>
            }
          />
        }
        title={title}
      />
    );
  }

  renderOwnersHeader() {
    return this.renderSectionHeader(
      'Owners',
      routes.organization.addOwner
    );
  }

  renderMembersHeader() {
    return this.renderSectionHeader(
      'Members',
      routes.organization.addMember
    );
  }

  render() {
    return (
      <div className="members">
        <Section header={this.renderOwnersHeader()}>
          <div className="members__table">
            {this.getOwners()}
          </div>
        </Section>
        <Section header={this.renderMembersHeader()}>
          <div className="members__table">
            {this.getMembers()}
          </div>
        </Section>
      </div>
    );
  }
}

export default Members;
