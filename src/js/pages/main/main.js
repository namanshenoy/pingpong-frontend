define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'socket',
  'css!pages/main/main',
  
],
function(oj, ko, $, socketIOClient) {

  function ChooseProgramViewModel() {
    var self = this;
    console.log(socketIOClient);
    let endpoint = "http://132.145.137.160:443/socket/";
    let socket = socketIOClient('http://132.145.137.160:443/');
    self.players = ko.observableArray([]);
    self.showLogin = ko.observable(false);
    self.showRegister = ko.observable(false);
    let loggedIn = localStorage.getItem('isLoggedIn');
    self.currentPlayerEmail = ko.observable('');
    console.log(loggedIn);
    if(loggedIn === null || loggedIn === "false"){
      self.isLoggedIn = ko.observable(false);
    }else{
      self.isLoggedIn = ko.observable(true);
      self.currentPlayerEmail(localStorage.getItem('currentPlayerEmail'));
    }
    
    console.log(self.isLoggedIn());
    
    self.getPlayers = function(players){
      return JSON.parse(JSON.stringify(players.map(player => {
        if(self.isLoggedIn() && self.currentPlayerEmail() === player.email){
          player.isCurrentPlayer = true;
          console.log('----------------------------------------------------');
          console.log(self.currentPlayerEmail());
        }else{
          player.isCurrentPlayer = false;
        }
        return player;
      })));
    }
    socket.on("updateList", (data) => {
      console.log(data);
      self.players(self.getPlayers(data.data));
      console.log(self.players());
    });


    self.loginEmail = ko.observable("");
    self.loginPassword = ko.observable("");
    self.login = function(){
      console.log(self.loginEmail());
      console.log(self.loginPassword());
      $.ajax({
        type: "POST",
        url: 'http://132.145.137.160:443/socket/login/',
        data: {
          email: self.loginEmail(),
          password: self.loginPassword()
        },
        success: (response) => {
          console.log(response);
          if( response.success === "Player Logged In"){
            console.log('success');
            localStorage.setItem('isLoggedIn',true);
            localStorage.setItem('currentPlayerEmail',self.loginEmail());
            self.currentPlayerEmail(self.loginEmail());
            self.isLoggedIn(true);
            self.players(self.getPlayers(self.players()));
          }
        }
      });
    }

    self.changeShowLogin = function(){
      console.log('showing login');
      self.showLogin(true);
      self.showRegister(false);
    }
    self.changeShowRegister = function(){
      self.showLogin(false);
      self.showRegister(true);
    }
    self.challenge = function(){
      $.ajax({
        type: "POST",
        url: 'http://132.145.137.160:443/socket/challengePlayer/',
        data: {
          email: self.currentPlayerEmail(),
        },
        success: (response) => {
          console.log(response);
        }
      });
    }

    self.logout = function(){
      localStorage.setItem('isLoggedIn', false);
      localStorage.removeItem('currentPlayerEmail');
      self.currentPlayerEmail("");
      self.isLoggedIn(false);
      console.log(self.players());
      let updatedList = self.getPlayers(self.players());
      console.log(updatedList);

      self.players(updatedList);
      
      console.log(self.players());
      self.players.valueHasMutated();
      console.log('logging out');
      // self.players(self.players.map( player => {
      //   player.isCurrentPlayer = false;
      //   return player;
      // }));
    }
    
    self.registerDisplayName = ko.observable("");
    self.registerEmail = ko.observable("");
    self.registerPassword = ko.observable("");
    
    self.register = function(){
      $.ajax({
        type: "POST",
        url: 'http://132.145.137.160:443/socket/addPlayer',
        data: {
          player: self.registerDisplayName,
          email: self.registerEmail(),
          password: self.registerPassword()
        },
        success: (response) => {
          // if( response.success === "Player Logged In"){
            localStorage.setItem('isLoggedIn',true);
            localStorage.setItem('currentPlayerEmail',self.registerEmail());
            self.currentPlayerEmail(self.registerEmail());
            self.isLoggedIn(true);
            self.players(self.getPlayers(self.players()));
          // }
        }
      });
    }
    self.deleteAccount = function(){
      $.ajax({
        type: "POST",
        url: 'http://132.145.137.160:443/socket/deletePlayer/',
        data: {
          email: self.currentPlayerEmail()
        },
        success: (response) => {
          localStorage.setItem('isLoggedIn', false);
          localStorage.removeItem('currentPlayerEmail');
          self.currentPlayerEmail("");
          self.isLoggedIn(false);
        }
      });
    }


  }
  return ChooseProgramViewModel;
});
