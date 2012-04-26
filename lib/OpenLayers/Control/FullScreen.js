/* Copyright (c) 2011-2012 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

OpenLayers.Control.FullScreen = OpenLayers.Class(OpenLayers.Control, {

    type: OpenLayers.Control.TYPE_TOGGLE,

    fullscreenClass: 'fullscreen',

    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        // handle 'Esc' key press
        OpenLayers.Event.observe(this.map.div, fullScreenApi.fullScreenEventName, OpenLayers.Function.bind(function() {
            if (fullScreenApi.isFullScreen() === false) {
                this.deactivate();
            }
        }, this));
    },

    activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            if (fullScreenApi.supportsFullScreen) {
                fullScreenApi.requestFullScreen(this.map.div);
            }
            OpenLayers.Element.addClass(this.map.div, this.fullscreenClass);
            this.map.updateSize();
            return true;
        } else {
            return false;
        }
    },

    deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            if (fullScreenApi.supportsFullScreen) {
                fullScreenApi.cancelFullScreen();
            }
            OpenLayers.Element.removeClass(this.map.div, this.fullscreenClass);
            this.map.updateSize();
            return true;
        } else {
            return false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.FullScreen"
});


// from http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
(function() {
    var fullScreenApi = {
        supportsFullScreen: false,
        isFullScreen: function() { return false; },
        requestFullScreen: function() {},
        cancelFullScreen: function() {},
        fullScreenEventName: '',
        prefix: ''
    }
    var browserPrefixes = 'webkit moz o ms khtml'.split(' ');

    // check for native support
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.supportsFullScreen = true;
    } else {
        // check for fullscreen support by vendor prefix
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }

    // update methods to do something useful
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
            case '':
                return document.fullScreen;
            case 'webkit':
                return document.webkitIsFullScreen;
            default:
                return document[this.prefix + 'FullScreen'];
            }
        }
        fullScreenApi.requestFullScreen = function(el) {
            return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        }
        fullScreenApi.cancelFullScreen = function(el) {
            return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        }
    }

    // export api
    window.fullScreenApi = fullScreenApi;
})();
