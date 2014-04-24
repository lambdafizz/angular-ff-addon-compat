// lf.ff-addon-compat
// ==================

(function (angular) {
    'use strict';

// The purpose of this module is to provide a "drop in" compatibility
// mode allowing angular to run seamlessly as firefox content script
// (or to be usable in firefox addons, if you prefer to put it this
// way)
    angular.module('lf.ff-addon-compat', [])

// $sniffer
// --------
// This provider is mostly a copypasta of `src/ng/sniffer.js` with one
// minor tweak that is commented below.
        .provider('$sniffer', [function () {

            // angular has pretty complicated build system with some global helpers
            // that become non-global at build time. We need to provide these helpers
            var int = function (i) { return parseInt(i); };
            var lowercase = function (s) { return String(s).toLowerCase(); };
            var isString = function (o) { return o instanceof String; };
            var isUndefined = function (o) { return o === undefined; };
            var msie = false; // firefox plugin, so we're not IE :)

            // inside firefox addon csp should probably be false (or maybe not?)
            var csp = function () { return false; };

            /**
             * !!! This is an undocumented "private" service !!!
             *
             * @name $sniffer
             * @requires $window
             * @requires $document
             *
             * @property {boolean} history Does the browser support html5 history api ?
             * @property {boolean} hashchange Does the browser support hashchange event ?
             * @property {boolean} transitions Does the browser support CSS transition events ?
             * @property {boolean} animations Does the browser support CSS animation events ?
             *
             * @description
             * This is very simple implementation of testing browser's features.
             */
            this.$get = ['$window', '$document', function($window, $document) {
                var eventSupport = {},
                    android =
                        int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
                    boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
                    document = $document[0] || {},
                    documentMode = document.documentMode,
                    vendorPrefix,
                    vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/,
                    bodyStyle = document.body && document.body.style,
                    transitions = false,
                    animations = false,
                // unsafeWindow is a global available only for scripts running
                // as FF addon "content script". As stated in FF docs it is a
                // private, unsupported API that can disappear, but it's the simplest
                // way to check if we're running in context of an addon.
                    ffPlugin = $window.XPCNativeWrapper !== undefined,
                    match;

                if (bodyStyle) {
                    for(var prop in bodyStyle) {
                        match = vendorRegex.exec(prop);
                        if(match) {
                            vendorPrefix = match[0];
                            vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                            break;
                        }
                    }

                    if(!vendorPrefix) {
                        vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
                    }

                    transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
                    animations  = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));

                    if (android && (!transitions||!animations)) {
                        transitions = isString(document.body.style.webkitTransition);
                        animations = isString(document.body.style.webkitAnimation);
                    }
                }


                return {
                    // Android has history.pushState, but it does not update location correctly
                    // so let's not use the history API at all.
                    // http://code.google.com/p/android/issues/detail?id=17471
                    // https://github.com/angular/angular.js/issues/904

                    // older webkit browser (533.9) on Boxee box has exactly the same problem as Android has
                    // so let's not use the history API also
                    // We are purposefully using `!(android < 4)` to cover the case when `android` is undefined

                    // If `XPCNativeWrapper` is defined, we are running as FF addon content script,
                    // and `history.pushState` and `history.replaceState` will cause painful and *silent*
                    // failures, so we must assume this api is unavailable.

                    // jshint -W018
                    history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee &&
                        !ffPlugin),
                    // jshint +W018
                    hashchange: 'onhashchange' in $window &&
                        // IE8 compatible mode lies
                        (!documentMode || documentMode > 7),
                    hasEvent: function(event) {
                        // IE9 implements 'input' event it's so fubared that we rather pretend that it doesn't have
                        // it. In particular the event is not fired when backspace or delete key are pressed or
                        // when cut operation is performed.
                        if (event == 'input' && msie == 9) return false;

                        if (isUndefined(eventSupport[event])) {
                            var divElm = document.createElement('div');
                            eventSupport[event] = 'on' + event in divElm;
                        }

                        return eventSupport[event];
                    },
                    csp: csp(),
                    vendorPrefix: vendorPrefix,
                    transitions : transitions,
                    animations : animations,
                    android: android,
                    msie : msie,
                    msieDocumentMode: documentMode,
                    ffAddonCompat: true
                };
            }];

        }]);


})(window.angular);