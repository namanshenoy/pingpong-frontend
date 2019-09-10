

define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojmodule-element-utils',
  'ojs/ojmodule-element',
  'ojs/ojrouter',
  'ojs/ojknockout'
],
  function(oj, ko, $, moduleUtils) {
      function ControllerViewModel() {
        var self = this;
        self.router = oj.Router.rootInstance;

        var config = {
          'main':    {label: 'Oracle Ping Pong', isDefault: true},
          'admin':   {label: 'Admin Panel'},
        };

        self.router.configure(config);
        oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

        self.moduleConfig = ko.observable({'view':[], 'viewModel':null});


        self.loadModule = function() {
          ko.computed(function() {
            var name = self.router.moduleConfig.name();
            var viewPath = 'pages/'+name+'/'+name+'.html';
            var modelPath = 'pages/'+name+'/'+name;
            var masterPromise = Promise.all([
              moduleUtils.createView({'viewPath':viewPath}),
              moduleUtils.createViewModel({'viewModelPath':modelPath})
            ]);
            masterPromise.then(
              function(values){
                self.moduleConfig({'view':values[0],'viewModel':values[1]});
              }
            );
          });
        };


    }

    return new ControllerViewModel();
  }
);
