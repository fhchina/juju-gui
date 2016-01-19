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

var juju = {components: {}}; // eslint-disable-line no-unused-vars

describe('UnitDetails', function() {
  var fakeUnit;

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('unit-details', function() { done(); });
  });

  beforeEach(function() {
    fakeUnit = {
      private_address: '192.168.0.1',
      public_address: '93.20.93.20',
      agent_state: 'started',
      id: 'unit1'
    };
  });

  it('shows the unit properties', function() {
    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={sinon.stub()}
        changeState={sinon.stub()}
        serviceId='abc123'
        previousComponent='units'
        unitStatus='error'
        unit={fakeUnit} />);

    assert.deepEqual(output.props.children[0],
      <div className='unit-details__properties'>
        <p className='unit-details__property'>
          Status: {fakeUnit.agent_state}
        </p>
        <p className='unit-details__property'>
          IP address: {"none"}
        </p>
        {undefined}
        <p className='unit-details__property'>
          Public address: {"none"}
        </p>
        {undefined}
      </div>);
  });

  it('shows list of addresses correctly', function() {
    fakeUnit = {
      private_address: '192.168.0.1',
      public_address: '93.20.93.20',
      open_ports: [80, 443],
      agent_state: 'started',
      id: 'unit1'
    };

    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={sinon.stub()}
        changeState={sinon.stub()}
        serviceId='abc123'
        previousComponent='units'
        unitStatus='error'
        unit={fakeUnit} />);

    var expected = (
      <div className="unit-details__properties">
        <p className="unit-details__property">
          Status: {fakeUnit.agent_state}
        </p>
        <p className="unit-details__property">
          IP address: {null}
        </p>
        <ul className="unit-details__list">
          <li className="unit-details__list-item" key="http://192.168.0.1:80">
            <a href="http://192.168.0.1:80" target="_blank">
              {"192.168.0.1"}:{80}
            </a>
          </li>
          <li className="unit-details__list-item" key="http://192.168.0.1:443">
            <a href="http://192.168.0.1:443" target="_blank">
              {"192.168.0.1"}:{443}
            </a>
          </li>
        </ul>
        <p className="unit-details__property">
          Public address: {null}
        </p>
        <ul className="unit-details__list">
          <li className="unit-details__list-item" key="http://93.20.93.20:80">
            <a href="http://93.20.93.20:80" target="_blank">
              {"93.20.93.20"}:{80}
            </a>
          </li>
          <li className="unit-details__list-item" key="http://93.20.93.20:443">
            <a href="http://93.20.93.20:443" target="_blank">
              {"93.20.93.20"}:{443}
            </a>
          </li>
        </ul>
      </div>);
    assert.deepEqual(output.props.children[0], expected);
  });

  it('shows no addresses if ports are unavailable', function() {
    fakeUnit = {
      private_address: '192.168.0.1',
      public_address: '93.20.93.20',
      agent_state: 'started',
      id: 'unit1'
    };

    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={sinon.stub()}
        changeState={sinon.stub()}
        serviceId='abc123'
        previousComponent='units'
        unitStatus='error'
        unit={fakeUnit} />);

    assert.deepEqual(output.props.children[0],
      <div className='unit-details__properties'>
        <p className='unit-details__property'>
          Status: {fakeUnit.agent_state}
        </p>
        <p className='unit-details__property'>
          {['IP address: ','none']}
        </p>
        {undefined}
        <p className='unit-details__property'>
          Public address: {"none"}
        </p>
        {undefined}
      </div>);
  });

  it('shows only public address if available', function() {
    fakeUnit = {
      public_address: '93.20.93.20',
      open_ports: [80, 443],
      agent_state: 'started',
      id: 'unit1'
    };

    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={sinon.stub()}
        changeState={sinon.stub()}
        serviceId='abc123'
        previousComponent='units'
        unitStatus='error'
        unit={fakeUnit} />);

    var expect = (
      <div className='unit-details__properties'>
        <p className='unit-details__property'>
          Status: {fakeUnit.agent_state}
        </p>
        <p className='unit-details__property'>
          IP address: {"none"}
        </p>
        {undefined}
        <p className='unit-details__property'>
          Public address: {null}
        </p>
        <ul className="unit-details__list">
          <li className="unit-details__list-item" key="http://93.20.93.20:80">
            <a href="http://93.20.93.20:80" target="_blank">
              {"93.20.93.20"}:{80}
            </a>
          </li>
          <li className="unit-details__list-item" key="http://93.20.93.20:443">
            <a href="http://93.20.93.20:443" target="_blank">
              {"93.20.93.20"}:{443}
            </a>
          </li>
        </ul>
      </div>);
    assert.deepEqual(output.props.children[0], expect);
  });

  it('shows only private address if available', function() {
    fakeUnit = {
      private_address: '93.20.93.20',
      open_ports: [80, 443],
      agent_state: 'started',
      id: 'unit1'
    };

    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={sinon.stub()}
        changeState={sinon.stub()}
        serviceId='abc123'
        previousComponent='units'
        unitStatus='error'
        unit={fakeUnit} />);

    var expected = (
      <div className='unit-details__properties'>
        <p className='unit-details__property'>
          Status: {fakeUnit.agent_state}
        </p>
        <p className="unit-details__property">
          IP address: {null}
        </p>
        <ul className="unit-details__list">
          <li className="unit-details__list-item" key="http://93.20.93.20:80">
            <a href="http://93.20.93.20:80" target="_blank">
              {"93.20.93.20"}:{80}
            </a>
          </li>
          <li className="unit-details__list-item" key="http://93.20.93.20:443">
            <a href="http://93.20.93.20:443" target="_blank">
              {"93.20.93.20"}:{443}
            </a>
          </li>
        </ul>
        <p className='unit-details__property'>
          Public address: {"none"}
        </p>
        {undefined}
      </div>);
    assert.deepEqual(output.props.children[0], expected);
  });

  it('renders the remove button', function() {
    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        unit={fakeUnit} />);
    var buttons = [{
      title: 'Remove',
      action: output.props.children[1].props.buttons[0].action
    }];
    assert.deepEqual(output.props.children[1],
      <juju.components.ButtonRow
        buttons={buttons} />);
  });

  it('destroys the unit when the destroy button is clicked', function() {
    var destroyUnits = sinon.stub();
    var changeState = sinon.stub();
    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={destroyUnits}
        changeState={changeState}
        unit={fakeUnit} />);
    output.props.children[1].props.buttons[0].action();
    assert.equal(destroyUnits.callCount, 1);
    assert.deepEqual(destroyUnits.args[0][0], [fakeUnit.id]);
  });

  it('navigates to the unit list when the unit is destroyed', function() {
    var destroyUnits = sinon.stub();
    var changeState = sinon.stub();
    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={destroyUnits}
        changeState={changeState}
        unitStatus='pending'
        serviceId='service1'
        unit={fakeUnit} />);
    output.props.children[1].props.buttons[0].action();
    assert.equal(changeState.callCount, 1);
    assert.deepEqual(changeState.args[0][0], {
      sectionA: {
        component: 'inspector',
        metadata: {
          id: 'service1',
          activeComponent: 'units',
          unitStatus: 'pending',
          unit: null
        }}});
  });

  it('can navigate to the expose view when the unit is destroyed', function() {
    var destroyUnits = sinon.stub();
    var changeState = sinon.stub();
    var output = jsTestUtils.shallowRender(
      <juju.components.UnitDetails
        destroyUnits={destroyUnits}
        changeState={changeState}
        previousComponent='expose'
        serviceId='service1'
        unit={fakeUnit} />);
    output.props.children[1].props.buttons[0].action();
    assert.equal(changeState.callCount, 1);
    assert.deepEqual(changeState.args[0][0], {
      sectionA: {
        component: 'inspector',
        metadata: {
          id: 'service1',
          activeComponent: 'expose',
          unitStatus: undefined,
          unit: null
        }}});
  });
});
