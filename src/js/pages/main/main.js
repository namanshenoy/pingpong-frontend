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
    let urlPrefix = "http://localhost:4000/"
    //let urlPrefix = "http://132.145.137.160:443/socket/";
    let socket;
    if(urlPrefix === "http://132.145.137.160:443/socket/") {
        socket = socketIOClient('http://132.145.137.160:443/');
    } else {
        socket = socketIOClient('http://localhost:4000');
    }

    self.viewPlayers = ko.observableArray([]);
    self.slidingIndex = ko.observableArray(0);
    self.players = ko.observableArray([]);
    self.showLogin = ko.observable(false);
    self.showRegister = ko.observable(false);
    let loggedIn = localStorage.getItem('isLoggedIn');
    self.currentPlayerEmail = ko.observable('');
    self.errorMessage = ko.observable('');
    self.showConfirmWin = ko.observable(false);
    self.token = ko.observable('');
    console.log(loggedIn);
    if(loggedIn === null || loggedIn === "false"){
      self.isLoggedIn = ko.observable(false);
    }else{
      self.isLoggedIn = ko.observable(true);
      self.currentPlayerEmail(localStorage.getItem('currentPlayerEmail'));
    }
        
    self.getPlayers = function(players){
      return JSON.parse(JSON.stringify(players.map(player => {
        if(self.isLoggedIn() && self.currentPlayerEmail() === player.email){
          player.isCurrentPlayer = true;
          console.log('----------------------------------------------------');
          console.log(self.currentPlayerEmail());
            if(player.inMatch == true){
              self.showConfirmWin(true);
            } else {
              self.showConfirmWin(false);
            }
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


    /* added auth */
    self.login = function(){
      self.errorMessage('');
      self.token('');
      console.log(self.loginEmail());
      console.log(self.loginPassword());
      $.ajax({
        type: "POST",
        url: urlPrefix + 'login/',
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
            self.token(response.token);
            console.log("New token: " + self.token());
          }
        } ,
        error : function(xhr, ajaxOptions, thrownError){

          var obj = JSON.parse(xhr.responseText);
          if(obj.logout === true || obj.logout === "true"){
            /* logout because session expired */
                        console.log("LOGGING OUT")

            self.logout();
            self.errorMessage("Session has expired.")


          } else {
          self.errorMessage(obj.error);
           console.log(obj.error);
           console.log(thrownError);
         }
       }
      });
    }


    self.changeShowLogin = function(){
      console.log('showing login');
      self.errorMessage('');
      self.showLogin(true);
      self.showRegister(false);
    }
    self.changeShowRegister = function(){
      self.errorMessage('');
      self.showLogin(false);
      self.showRegister(true);
    }


    self.challenge = function(){
      self.errorMessage('');
      $.ajax({
        type: "POST",
        url: urlPrefix + 'challengePlayer/',
        data: {
          email: self.currentPlayerEmail(),
          token: self.token()
        },
        success: (response) => {
          console.log(response);
        },
         error : function(xhr, ajaxOptions, thrownError){
          var obj = JSON.parse(xhr.responseText);

          if(obj.logout === true || obj.logout === "true"){
                        console.log("LOGGING OUT")

            self.logout();
            self.errorMessage("Session has expired.")
          } else {
          self.errorMessage(obj.error);
           console.log(obj.error);
           console.log(thrownError);
         }
       }
      });
    }

    self.confirmWin = function() {
      self.errorMessage('');
         $.ajax({
        type: "POST",
        url: urlPrefix + 'concludeMatch/',
        data: {
          email: self.currentPlayerEmail(),
          token: self.token()
        },
        success: (response) => {
          console.log(response);
        },
         error : function(xhr, ajaxOptions, thrownError){
          var obj = JSON.parse(xhr.responseText);

          if(obj.logout === true || obj.logout === "true"){
            self.logout();
            self.errorMessage("Session has expired.")
          } else {
          self.errorMessage(obj.error);
           console.log(obj.error);
           console.log(thrownError);
         }
       }

      });
    }

    self.logout = function(){
      self.token('');
      self.errorMessage('');
      localStorage.setItem('isLoggedIn', false);
      localStorage.removeItem('currentPlayerEmail');
      self.currentPlayerEmail("");
      self.isLoggedIn(false);
      self.showConfirmWin(false);
      console.log(self.players());
      let updatedList = self.getPlayers(self.players());
      console.log(updatedList);

      self.players(updatedList);
      
      console.log(self.players());
      self.players.valueHasMutated();
      console.log('logging out');
      self.players(self.players.map( player => {
        player.isCurrentPlayer = false;
        return player;
      }));
    }
    
    self.registerDisplayName = ko.observable("");
    self.registerEmail = ko.observable("");
    self.registerPassword = ko.observable("");
    
    self.register = function(){
      self.errorMessage('');
      $.ajax({
        type: "POST",
        url: urlPrefix + 'addPlayer',
        data: {
          player: self.registerDisplayName(),
          email: self.registerEmail(),
          password: self.registerPassword()
        },
        success: (response) => {
          console.log(response);
          if( response.success !== null){
            console.log("succesful register");
            localStorage.setItem('isLoggedIn',true);
            localStorage.setItem('currentPlayerEmail',self.registerEmail());
            self.currentPlayerEmail(self.registerEmail());
            self.isLoggedIn(true);
            self.players(self.getPlayers(self.players()));
           }
        },
        error : function(xhr, ajaxOptions, thrownError){
          var obj = JSON.parse(xhr.responseText);

          if(obj.logout === true || obj.logout === "true"){
            console.log("LOGGING OUT")
            self.logout();
            self.errorMessage("Session has expired.")
          } else {
          self.errorMessage(obj.error);
           console.log(obj.error);
           console.log(thrownError);
         }
       }
      });
    }
    self.deleteAccount = function(){
      self.errorMessage('');
      $.ajax({
        type: "POST",
        url: urlPrefix + 'deletePlayer/',
        data: {
          email: self.currentPlayerEmail(),
          token: self.token()
        },
        success: (response) => {
          localStorage.setItem('isLoggedIn', false);
          localStorage.removeItem('currentPlayerEmail');
          self.currentPlayerEmail("");
          self.isLoggedIn(false);
          self.token('');
        },
        error : function(xhr, ajaxOptions, thrownError){
          var obj = JSON.parse(xhr.responseText);

          if(obj.logout === true || obj.logout === "true"){
                        console.log("LOGGING OUT")

            self.logout();
            self.errorMessage("Session has expired.")
          } else {
          self.errorMessage(obj.error);
           console.log(obj.error);
           console.log(thrownError);
         }
       }

      });
    }

    setInterval(function() {
      var pos = +self.slidingIndex() + 1;
      self.slidingIndex(pos);
      console.log(self.slidingIndex())

      //generate view list with current index and index after



    },1000)


  }
  return ChooseProgramViewModel;
});
