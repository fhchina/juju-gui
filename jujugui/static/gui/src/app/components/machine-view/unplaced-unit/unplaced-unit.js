/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

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

YUI.add('machine-view-unplaced-unit', function() {

  juju.components.MachineViewUnplacedUnit = React.createClass({
    propTypes: {
      icon: React.PropTypes.string.isRequired,
      removeUnit: React.PropTypes.func.isRequired,
      unit: React.PropTypes.object.isRequired
    },

    render: function() {
      var unit = this.props.unit;
      var menuItems = [{
        label: 'Destroy',
        action: this.props.removeUnit.bind(null, unit.id)
      }];
      return (
        <li className="machine-view__unplaced-unit">
          <img src={this.props.icon} alt={unit.displayName}
            className="machine-view__unplaced-unit-icon" />
          {unit.displayName}
          <juju.components.MoreMenu
            items={menuItems} />
        </li>
      );
    }
  });
}, '0.1.0', {
  requires: [
    'more-menu'
  ]
});
