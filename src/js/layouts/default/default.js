define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojmodule-element-utils',
],
function(oj, ko, $, moduleUtils) {
  function DefaultViewModel() {
    var self = this;
    self.router = oj.Router.rootInstance;
    self.pageModule = ko.observable({'view':[], 'viewModel':null});
    self.loadPage = function() {
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
            self.pageModule({'view':values[0],'viewModel':values[1]});
          }
        );
      });
    };
    self.loadPage();
    
  }
  return DefaultViewModel;
}
);
