var data = require("sdk/self").data;
var widgets = require("sdk/widget");
var panels = require("sdk/panel")

var widget = widgets.Widget({
    id: "mozilla-link",
    label: "Mozilla website",
    contentURL: data.url("img/angular-ico.png"),
    onClick: function() {
        tokenizerPopup.show();
    }
});

var tokenizerPopup = panels.Panel({
    contentURL: data.url("index.html"),
    width: 800,
    height: 600,
    position: widget,
    contentScriptFile: [
    data.url('.components/angular/angular.js'),
    data.url('.components/angular-route/angular-route.js'),
    data.url('.components/angular-ff-addon-compat/ff-addon-compat.js'),
    data.url('js/app.js')
    ],
    contentScriptWhen: 'ready'
});
