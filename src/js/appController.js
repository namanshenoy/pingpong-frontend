

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
          'home':    {label: 'Home page', isDefault: true, layout: 'default'},
          'admin':   {label: 'Admin', layout: 'default'},
          'display':   {label: 'Display', layout: 'default'},
        };

        self.router.configure(config);
        oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

        self.moduleConfig = ko.observable({'view':[], 'viewModel':null});


        self.loadModule = function() {
          ko.computed(function() {
            var name = self.router.moduleConfig.name();
            var layout = config[name].layout;
            var viewPath = 'layouts/'+layout+'/'+layout+'.html';
            var modelPath = 'layouts/'+layout+'/'+layout;
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