define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'socket',
  'css!pages/admin/admin',
  'components/player-table/loader',
],
function(oj, ko, $, socketIOClient) {
  function AdminViewModel() {
    var self = this;
    // ojet serve --theme pingpongTheme

    let endpoint = "http://132.145.137.160:443/socket/";
    let socket = socketIOClient("http://ocs-ar-experience.com/socket/");
    
    socket.on("updateList", (data) => {
      console.log(data)
      self.players(data.data.sort( (p1, p2) => p1.rank - p2.rank ));
    });
    self.currentPlayerEmail = ko.observable("");

    ko.bindingHandlers.display = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      },
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          if(valueAccessor()){
            element.style.display = 'block';
          }else{
            element.style.display = 'none';
          }
      }
    };

    ko.bindingHandlers.displayFlex = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {},
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          if(valueAccessor()){
            element.style.display = 'flex';
          }else{
            element.style.display = 'none';
          }
      }
    };

    self.selectedIndex = ko.observable(-1);
    self.players = ko.observableArray([]);

    self.adminToken = ko.observable("zufnex1rde2b3pxlkdppm");
    self.showAdminToken = ko.observable(true);

    self.deleteAccount = function(){
      $.ajax({
        type: "POST",
        url: 'http://ocs-ar-experience.com/socket/deletePlayer/',
        data: {
          email: self.players()[self.selectedIndex()].email,
          token: self.adminToken()
        },
        success: (response) => {
          self.players.splice(self.selectedIndex(),1);
          self.selectedIndex(-1);
        }
      });
    }

    self.registerDisplayName = ko.observable("");
    self.registerEmail = ko.observable("");
    self.registerError = ko.observable("");

    self.register = function(){
      $.ajax({
        type: "POST",
        url: "http://ocs-ar-experience.com/socket/",
        data: {
          player: self.registerDisplayName(),
          email: self.registerEmail(),
          password: "adminGeneratedAccount1"
        },
        success: (response) => {
            self.registerDisplayName("");
            self.registerEmail("");
            self.registerError("");
        },
        error: (response) => {
          self.registerError(response.responseJSON.error);
        }
      });
    }

    self.challenge = function(){
      $.ajax({
        type: "POST",
        url: "http://ocs-ar-experience.com/socket/challengePlayer/",
        data: {
          email: self.players()[self.selectedIndex()].email,
          token: self.adminToken()
        },
        success: (response) => {}
      });
    }

    self.conclude = function(){
      $.ajax({
        type: "POST",
        url: "http://ocs-ar-experience.com/socket/concludeMatch/",
        data: {
          email: self.players()[self.selectedIndex()].email,
          token: self.adminToken()
        },
        success: (response) => {}
      });
    }



  }
  return AdminViewModel;
}
);