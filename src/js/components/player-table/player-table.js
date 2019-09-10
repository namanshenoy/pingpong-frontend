define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'ojs/ojarraydataprovider',
  'css!components/player-table/player-table'
],
function(oj, ko, $, ArrayDataProvider) {
  function PlayerTable(context) {
    var self = this;
    self.contentReady = ko.observable(false);
    self.router = oj.Router.rootInstance;
    context.props.then(function (propertyMap){
      self.players = propertyMap.players();
      self.playersDataProvider = new ArrayDataProvider(self.players, { keyAttributes: 'name' });
      self.selectedIndex = propertyMap.selectedIndex();
      self.currentPlayerEmail = propertyMap.currentPlayerEmail();
      self.contentReady(true);
    });
    self.selectPlayer = function(current){
      self.selectedIndex(current.index);
    }
    self.getWidth = function(current){
      if( (current.data.wins + current.data.losses) === 0){
        return 0;
      }
      return Math.round((current.data.wins / ( current.data.losses + current.data.wins)) * 100);
    }


    self.adminKey = "1212";
    self.tvKey = "3434";
    self.current = "";
    self.adminEnter = function(num){
      self.current += num;
      if(self.current.length > 4){
        self.current = self.current.substring(1);
      }
      if(self.current === self.adminKey){
        self.router.go('admin');
      }
      if(self.current === self.tvKey){
        self.router.go('display');
      }
      console.log(self.current);
    }
  }
  return PlayerTable;
}
);

