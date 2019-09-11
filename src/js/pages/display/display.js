define([
  'ojs/ojcore',
  'knockout',
  'jquery',
  'socket',
  'components/player-table/loader',
  'css!pages/display/display'
],
function(oj, ko, $, socketIOClient) {
  function DisplayViewModel() {
    var self = this;
    self.router = oj.Router.rootInstance;

    let endpoint = "http://132.145.137.160:443/socket/";
    let socket = socketIOClient("http://ocs-ar-experience.com/");


    self.players = ko.observableArray([]);

    self.selectedIndex = ko.observable(-1);

    
    self.currentPlayerEmail = ko.observable('');
    
    let emailFromLS = localStorage.getItem('currentPlayerEmail');
    self.token = ko.observable('');

    console.log('DISPLAY')
    socket.on("connect_failed", data => {
      console.log('ERROR')
      console.log(data)
      self.players([]);
    });
    socket.io.on("connect_error", data => {
      console.log('ERROR')
      self.players([]);
    });

    socket.on("connect", (data) => {
      alert(data)
    })
    socket.on("updateList", (data) => {
      console.log(data)

      self.players(data.data.sort( (p1, p2) => p1.rank - p2.rank ));

    });

  }
  return DisplayViewModel;
}
);
