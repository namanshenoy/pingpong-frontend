define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'socket',
  'components/player-table/loader',
  'css!pages/home/home'
],
function(oj, ko, $, socketIOClient) {
  function HomeViewModel() {
    var self = this;
    self.router = oj.Router.rootInstance;

    let endpoint = "http://132.145.137.160:443/socket/";
    let socket = socketIOClient("http://ocs-ar-experience.com/");

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

    self.players = ko.observableArray([]);

    self.selectedIndex = ko.observable(-1);
    self.state = ko.observable('login');

    self.loginEmail = ko.observable('');
    self.loginPassword = ko.observable('');

    self.registerDisplayName = ko.observable('');
    self.registerEmail = ko.observable('');
    self.registerPassword = ko.observable('');
    self.registerPassword2 = ko.observable('');

    self.registerError = ko.observable('');
    
    self.currentPlayerEmail = ko.observable('');
    
    let emailFromLS = localStorage.getItem('currentPlayerEmail');
    self.token = ko.observable('');

    if(emailFromLS === null){
      self.isLoggedIn = ko.observable(false);
    }else{
      self.isLoggedIn = ko.observable(true);
      self.currentPlayerEmail(emailFromLS);
      self.token(localStorage.getItem('token'));
      self.state('nomatch');
    }
    
    self.currentPlayer = ko.observable();
    
    self.mapPlayers = function(players){
      return players
              .sort( (p1, p2) => p1.rank - p2.rank )
              .map( player => {
        if(self.isLoggedIn() && self.currentPlayerEmail() === player.email){
          player.isCurrentPlayer = true;
          self.currentPlayer(player);
        }else{
          player.isCurrentPlayer = false;
        }
        return player;
      });
    }

    console.log('HOME')
    socket.on("connect_failed", data => {
      console.log(data)
      self.players([]);
    });
    socket.io.on("connect_error", data => {
      console.log('HELLO')
      self.players([]);
    });

    socket.on("connect", (data) => {
      console.log(data)
      console.log("SHIT")
    })
    socket.on("updateList", (data) => {
      console.log(data)
      self.players(self.mapPlayers(data.data));
      self.players.valueHasMutated();
      if(self.isLoggedIn() && self.currentPlayer().inMatch){
        self.setInMatch();
      }
    });
    // usdhfiuhf@oracle.com
    // adminGeneratedAccount1

    self.setToken = function(token){
      self.token(token);
      localStorage.setItem("token",token);
    }

    self.setEmail = function(email){
      localStorage.setItem('currentPlayerEmail',email);
      self.currentPlayerEmail(email);
    }

    self.getCurrentPlayerIndex = function(){
      let playerIndex = -1;
      self.players.forEach( (player, index) => {
        if(player.email === self.currentPlayerEmail()){
          playerIndex = index;
        }
      });
      return index;
    }

    self.updatePlayers = function(){
      self.players(self.mapPlayers(self.players()));
      self.players.valueHasMutated();
    }

    self.login = function(){
      self.sessionExpired(false);
      $.ajax({
        type: "POST",
        url: "http://ocs-ar-experience.com/socket/login/",
        data: {
          email: self.loginEmail(),
          password: self.loginPassword()
        },
        success: (response) => {
          if( response.success === "Player Logged In"){
            self.setToken(response.token);
            self.setEmail(self.loginEmail());
            self.isLoggedIn(true);
            self.updatePlayers();
            if(response.inMatch){
              self.setInMatch();
            }else{
              self.state('nomatch');
            }
          }
        }
      });
    }
    self.sessionExpired = ko.observable(false);
    self.checkResponse = function(response){
      if(response.logout){
        self.sessionExpired(true);
        self.logout();
      }
    }

    self.challenge = function(){
      $.ajax({
        type: "POST",
        url: 'http://ocs-ar-experience.com/socket/challengePlayer/',
        data: {
          email: self.currentPlayerEmail(),
          token: self.token()
        },
        success: (response) => {
          console.log(response);
          self.checkResponse(response);
        }
      });
    }
    self.conclude = function(){
      $.ajax({
        type: "POST",
        url: 'http://ocs-ar-experience.com/socket/concludeMatch/',
        data: {
          email: self.currentPlayerEmail(),
          token: self.token()
        },
        success: (response) => {
          self.state('nomatch');
          self.checkResponse(response);
        }
      });
    }

    self.logout = function(){
      localStorage.removeItem('currentPlayerEmail');
      localStorage.removeItem('token');
      self.currentPlayerEmail("");
      self.isLoggedIn(false);
      self.state('login');
    }
    self.copy = function(text){
      
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(self.currentOpponent()).select();
      document.execCommand("copy");
      $temp.remove();
    }
    
    // adminGeneratedAccount1
    self.hasAttemptedLogin = ko.observable(false);
    self.register = function(){
      self.sessionExpired(false);
      self.hasAttemptedLogin(true);
      if(self.registerPassword() !== self.registerPassword2()){
        return;
      }
      $.ajax({
        type: "POST",
        url: 'http://ocs-ar-experience.com/socket/addPlayer',
        data: {
          player: self.registerDisplayName,
          email: self.registerEmail(),
          password: self.registerPassword()
        },
        success: (response) => {
          self.setToken(response.token);
          localStorage.setItem('isLoggedIn',true);
          localStorage.setItem('currentPlayerEmail',self.registerEmail());
          self.currentPlayerEmail(self.registerEmail());
          self.isLoggedIn(true);
          self.updatePlayers();
          self.state('nomatch');

        }
      });
    }
    self.confirmDelete = ko.observable(false);
    self.deleteAccount = function(){
      self.confirmDelete(true);
    }

    self.deleteConfirmed = function(){
      $.ajax({
        type: "POST",
        url: "http://ocs-ar-experience.com/socket/deletePlayer/",
        data: {
          email: self.currentPlayerEmail(),
          token: self.token()
        },
        success: (response) => {
          localStorage.setItem('isLoggedIn', false);
          localStorage.removeItem('currentPlayerEmail');
          self.currentPlayerEmail("");
          self.isLoggedIn(false);
          self.state('login');
          self.confirmDelete(false);
        }
      });
    }

    self.cancelDelete = function(){
      self.confirmDelete(false);
    }
    self.currentOpponent = ko.observable('');

    self.setInMatch = function(){
      self.state('inmatch');
      let playersInMatches = self.players().filter( player => player.inMatch);
      let currentPlayerIndex = -1;
      playersInMatches.forEach( (player, index) => {
        if(player.email === self.currentPlayerEmail()){
          currentPlayerIndex = index;
        }
      });
      if(currentPlayerIndex % 2 == 0){
        self.currentOpponent(playersInMatches[currentPlayerIndex + 1].email);
      }else{
        self.currentOpponent(playersInMatches[currentPlayerIndex - 1].email);
      }
    }



  }
  return HomeViewModel;
}
);




