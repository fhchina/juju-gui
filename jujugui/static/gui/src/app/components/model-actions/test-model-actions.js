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

chai.config.includeStack = true;
chai.config.truncateThreshold = 0;

describe('ModelActions', function() {
  var acl;

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('model-actions', function() { done(); });
  });

  beforeEach(function() {
    acl = {isReadOnly: sinon.stub().returns(false)};
  });

  it('can render and pass the correct props', function() {
    var currentChangeSet = {one: 1, two: 2};
    var renderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={currentChangeSet}
        exportEnvironmentFile={sinon.stub()}
        hasEntities={true}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(true)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sinon.stub()}
      />, true);
    var instance = renderer.getMountedInstance();
    var output = renderer.getRenderOutput();
    var expected = (
      <div className="model-actions">
        <div className="model-actions__buttons">
          <span className="model-actions__export model-actions__button"
            onClick={instance._handleExport}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="export_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Export
              </span>
            </span>
          </span>
          <span className="model-actions__import model-actions__button"
            onClick={instance._handleImportClick}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="import_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Import
              </span>
            </span>
          </span>
          <span className="model-actions__share model-actions__button"
            onClick={instance.props.sharingVisibility}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="share_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Share
              </span>
            </span>
          </span>
        </div>
        <input className="model-actions__file"
          type="file"
          onChange={instance._handleImportFile}
          accept=".zip,.yaml,.yml"
          ref="file-input" />
      </div>);
    assert.deepEqual(output, expected);
  });

  it('sets the initial class if there are no changes or entites', function() {
    var currentChangeSet = {};
    var renderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={currentChangeSet}
        exportEnvironmentFile={sinon.stub()}
        hasEntities={false}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(true)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sinon.stub()}
      />, true);
    var output = renderer.getRenderOutput();
    assert.equal(output.props.className,
      'model-actions model-actions--initial');
  });

  it('does not set the initial class if there are entites', function() {
    var currentChangeSet = {};
    var renderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={currentChangeSet}
        exportEnvironmentFile={sinon.stub()}
        hasEntities={true}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(true)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sinon.stub()}
      />, true);
    var output = renderer.getRenderOutput();
    assert.equal(output.props.className,
      'model-actions');
  });

  it('can export the env', function() {
    var currentChangeSet = {one: 1, two: 2};
    var exportEnvironmentFile = sinon.stub();
    var output = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={currentChangeSet}
        exportEnvironmentFile={exportEnvironmentFile}
        hasEntities={false}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(true)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sinon.stub()}
      />);
    output.props.children[0].props.children[0].props.onClick();
    assert.equal(exportEnvironmentFile.callCount, 1);
  });

  it('can open the file dialog when import is clicked', function() {
    var currentChangeSet = {one: 1, two: 2};
    var fileClick = sinon.stub();
    var importBundleFile = sinon.stub();
    var hideDragOverNotification = sinon.stub();
    var renderDragOverNotification = sinon.stub();
    var exportEnvironmentFile = sinon.stub();
    var shallowRenderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        exportEnvironmentFile={exportEnvironmentFile}
        renderDragOverNotification={renderDragOverNotification}
        hasEntities={false}
        importBundleFile={importBundleFile}
        hideDragOverNotification={hideDragOverNotification}
        modelConnected={sinon.stub().withArgs().returns(true)}
        currentChangeSet={currentChangeSet}
        sharingVisibility={sinon.stub()}
      />, true);
    var instance = shallowRenderer.getMountedInstance();
    instance.refs = {'file-input': {click: fileClick}};
    var output = shallowRenderer.getRenderOutput();
    output.props.children[0].props.children[1].props.onClick();
    assert.equal(fileClick.callCount, 1);
  });

  it('can get a file when a file is selected', function() {
    var currentChangeSet = {one: 1, two: 2};
    var importBundleFile = sinon.stub();
    var hideDragOverNotification = sinon.stub();
    var renderDragOverNotification = sinon.stub();
    var exportEnvironmentFile = sinon.stub();
    var shallowRenderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        exportEnvironmentFile={exportEnvironmentFile}
        renderDragOverNotification={renderDragOverNotification}
        importBundleFile={importBundleFile}
        hasEntities={false}
        hideDragOverNotification={hideDragOverNotification}
        modelConnected={sinon.stub().withArgs().returns(true)}
        currentChangeSet={currentChangeSet}
        sharingVisibility={sinon.stub()}
      />, true);
    var instance = shallowRenderer.getMountedInstance();
    instance.refs = {
      'file-input': {files: ['apache2.yaml']},
    };
    var output = shallowRenderer.getRenderOutput();
    output.props.children[1].props.onChange();
    assert.equal(importBundleFile.callCount, 1);
    assert.equal(importBundleFile.args[0][0], 'apache2.yaml');
  });

  it('can disable importing when read only', function() {
    acl.isReadOnly = sinon.stub().returns(true);
    var currentChangeSet = {one: 1, two: 2};
    var renderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={currentChangeSet}
        exportEnvironmentFile={sinon.stub()}
        hasEntities={true}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(true)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sinon.stub()}
      />, true);
    var instance = renderer.getMountedInstance();
    var output = renderer.getRenderOutput();
    var expected = (
      <div className="model-actions">
        <div className="model-actions__buttons">
          <span className="model-actions__export model-actions__button"
            onClick={instance._handleExport}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="export_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Export
              </span>
            </span>
          </span>
          <span className="model-actions__import model-actions__button"
            onClick={false}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="import_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Import
              </span>
            </span>
          </span>
          <span className="model-actions__share model-actions__button"
            onClick={instance.props.sharingVisibility}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="share_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Share
              </span>
            </span>
          </span>
        </div>
        <input className="model-actions__file"
          type="file"
          onChange={null}
          accept=".zip,.yaml,.yml"
          ref="file-input" />
      </div>);
    assert.deepEqual(output, expected);
  });

  it('disables sharing when not connected', function() {
    const renderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={{one: 1, two: 2}}
        exportEnvironmentFile={sinon.stub()}
        hasEntities={true}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(false)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sinon.stub()}
      />, true);
    const instance = renderer.getMountedInstance();
    const expected = (
      <div className="model-actions">
        <div className="model-actions__buttons">
          <span className="model-actions__export model-actions__button"
            onClick={instance._handleExport}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="export_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Export
              </span>
            </span>
          </span>
          <span className="model-actions__import model-actions__button"
            onClick={instance._handleImportClick}
            role="button"
            tabIndex="0">
            <juju.components.SvgIcon name="import_16"
              className="model-actions__icon"
              size="16" />
            <span className="tooltip__tooltip--below">
              <span className="tooltip__inner tooltip__inner--up">
                Import
              </span>
            </span>
          </span>
          {undefined}
        </div>
        <input className="model-actions__file"
          type="file"
          onChange={instance._handleImportFile}
          accept=".zip,.yaml,.yml"
          ref="file-input" />
      </div>);
    assert.deepEqual(renderer.getRenderOutput(), expected);
  });

  it('can trigger the sharing UI', function() {
    const currentChangeSet = {one: 1, two: 2};
    const sharingVisibility = sinon.stub();
    const renderer = jsTestUtils.shallowRender(
      <juju.components.ModelActions
        acl={acl}
        changeState={sinon.stub()}
        currentChangeSet={currentChangeSet}
        exportEnvironmentFile={sinon.stub()}
        hasEntities={true}
        hideDragOverNotification={sinon.stub()}
        importBundleFile={sinon.stub()}
        modelConnected={sinon.stub().withArgs().returns(true)}
        renderDragOverNotification={sinon.stub()}
        sharingVisibility={sharingVisibility} />, true);
    const output = renderer.getRenderOutput();
    const sharingButton = output.props.children[0].props.children[2];
    assert.notEqual(sharingButton, undefined);
    sharingButton.props.onClick();
    assert.equal(sharingVisibility.callCount, 1);
  });
});
