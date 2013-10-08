/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2012-2013 Canonical Ltd.

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

describe('Browser bundle detail view', function() {
  var Y, utils, data, container, origData, view, fakestore, browser, remoteDone;

  before(function(done) {
    Y = YUI(GlobalConfig).use(
        'view',
        'juju-env-fakebackend',
        'juju-view-bundle',
        'subapp-browser', // required for handlebars helpers
        'subapp-browser-entitybaseview',
        'browser-overlay-indicator',
        'event-tracker',
        'subapp-browser-bundleview',
        'juju-view-utils',
        'juju-tests-utils',
        'event-simulate',
        'node-event-simulate',
        function(Y) {
          utils = Y.namespace('juju-tests.utils');
          var sampleData = Y.io('data/browserbundle.json', {sync: true});

          origData = Y.JSON.parse(sampleData.responseText);
          fakestore = {
            bundle: function(id, callbacks) {
              callbacks.success(data);
            },
            iconpath: function(id) {
              return 'foo';
            },
            file: function(id, filename, entityType, callbacks) {
              assert.equal(entityType, 'bundle');
              assert.equal(id, data.id);
              assert.equal(filename, 'README');
              assert.isFunction(callbacks.success);
              assert.isFunction(callbacks.failure);
              callbacks.success.call(view, '<div id="testit"></div>');
              assert.isNotNull(container.one('#testit'));
              remoteDone();
            }
          };

          // Required to register the handlebars helpers
          browser = new Y.juju.subapps.Browser({
            store: fakestore
          });

          done();
        });
  });

  beforeEach(function() {
    data = Y.clone(origData);
    container = utils.makeContainer();
    container.append('<div class="bws-view-data"></div>');
    view = new Y.juju.browser.views.BrowserBundleView({
      store: fakestore,
      db: {},
      entityId: data.id,
      renderTo: container
    });
  });

  afterEach(function() {
    container.remove().destroy(true);
    view.destroy();
    remoteDone = null;
  });

  it('can be instantiated', function() {
    assert.equal(view instanceof Y.juju.browser.views.BrowserBundleView, true);
  });

  it('displays the bundle data in a tabview', function(done) {
    view._setupLocalFakebackend = function() {
      this.fakebackend = utils.makeFakeBackend('foo', true);
    };
    view.after('renderedChange', function(e) {
      assert.isNotNull(container.one('.yui3-tabview'));
      done();
    });
    view.render();
  });

  it('fetches the readme when requested', function(done) {
    view._setupLocalFakebackend = function() {
      this.fakebackend = utils.makeFakeBackend('foo', true);
    };
    view.after('renderedChange', function(e) {
      container.one('a.readme').simulate('click');
    });
    // Assertions made in fakebackend mock 'file' above.
    remoteDone = done;
    view.render();
  });

});
