define([
  'ojs/ojcore',
  'knockout',
  'jquery'
],
function(oj, ko, $) {
  function CardViewModel(context) {
    var self = this;
    self.name = ko.observable(context.properties.cardName);
    self.referenceCallback = context.properties.getReference;

    console.log(self.referenceCallback);
    self.referenceCallback(self);
    self.clicked = function(){
      self.name('jack');
    }
  }
  return CardViewModel;
}
);

