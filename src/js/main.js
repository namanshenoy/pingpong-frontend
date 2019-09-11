'use strict';
requirejs.config({
    baseUrl: 'js',
    paths:
    //injector:mainReleasePaths
    {
      'knockout': 'libs/knockout/knockout-3.5.0.debug',
      'jquery': 'libs/jquery/jquery-3.4.1',
      'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
      'promise': 'libs/es6-promise/es6-promise',
      'hammerjs': 'libs/hammer/hammer-2.0.8',
      'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
      'ojs': 'libs/oj/v7.1.0/debug',
      'ojL10n': 'libs/oj/v7.1.0/ojL10n',
      'ojtranslations': 'libs/oj/v7.1.0/resources',
      'text': 'libs/require/text',
      'signals': 'libs/js-signals/signals',
      'customElements': 'libs/webcomponents/custom-elements.min',
      'proj4': 'libs/proj4js/dist/proj4-src',
      'css': 'libs/require-css/css',
      'touchr': 'libs/touchr/touchr',
      'socket': 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io'
    }
    //endinjector
  }
  );

require(['ojs/ojbootstrap', 'appController', 'knockout', 'ojs/ojknockout'],
  function (Bootstrap, app, ko) {
    Bootstrap.whenDocumentReady().then(
      function () {
        function init() {
          oj.Router.sync().then(
            function(){
              console.log('change');
              app.loadModule();
              ko.applyBindings(app,document.getElementById('globalBody'));
            },
            function(error){
              oj.Logger.error('Error in root start: ' + error.message);
            }
          );
        }
        if (document.body.classList.contains('oj-hybrid')) {
          document.addEventListener('deviceready', init);
        } else {
          init();
        }
      });
  }
);
