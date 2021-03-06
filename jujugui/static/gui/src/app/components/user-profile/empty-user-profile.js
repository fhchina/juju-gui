/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2016 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

YUI.add('empty-user-profile', function() {

  // This component handles the empty user profile.
  juju.components.EmptyUserProfile = React.createClass({
    propTypes: {
      changeState: React.PropTypes.func.isRequired,
      staticURL: React.PropTypes.string,
      switchModel: React.PropTypes.func.isRequired
    },

    getDefaultProps: function() {
      return {
        staticURL: ''
      };
    },

    render: function() {
      const props = this.props;
      const basePath = `${props.staticURL}/static/gui/build/app`;
      return (
        <div className="user-profile__empty twelve-col no-margin-bottom">
          <img alt="Empty profile"
            className="user-profile__empty-image"
            src=
              {`${basePath}/assets/images/non-sprites/empty_profile.png`} />
          <h2 className="user-profile__empty-title">
            Your profile is currently empty
          </h2>
          <p className="user-profile__empty-text">
            Your models, bundles, and charms will
            appear here when you create them.
          </p>
          <juju.components.CreateModelButton
            changeState={props.changeState}
            switchModel={props.switchModel}
            title="Start building"
            type="inline-positive" />
        </div>
      );
    }

  });

}, '', {
  requires: []
});
