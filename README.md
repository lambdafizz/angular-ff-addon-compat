angular-ff-addon-compat
=======================

This module provides functionality necessary for seamless use of angular
for Firefox Addon development.

To make angular run smoothly as contentscript in your app just declare
this module as dependency of your app, like this:

    angular.module('myapp', ['lf.ff-addon-compat']);


Magic behind the door
---------------------

This section describes what compatibility issues are encountered and
how this packages solves them.


$routeProvider causes "<n> iterations reached. Aborting!" error
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This is actually quite subtle bug that originates in angular's
"private" service called `$sniffer`. Angular assumes FF can handle
HTML5 history API well, but unfortunately when running as addon's
content script, `history.pushState` and `history.replaceState`
cause failures. These failures **are silenced by angular** and
manifest themselves in weird places like $routeProvider.

As a solution, we check if we're running as addon's contentscript,
and if yes, just force angular to use the oldshool `location.href`.

