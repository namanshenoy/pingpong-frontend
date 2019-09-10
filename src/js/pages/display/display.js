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
    let socket = socketIOClient('http://132.145.137.160:443/');


    self.players = ko.observableArray([]);

    self.selectedIndex = ko.observable(-1);

    
    self.currentPlayerEmail = ko.observable('');
    
    let emailFromLS = localStorage.getItem('currentPlayerEmail');
    self.token = ko.observable('');

    socket.on("connect_failed", data => {
      self.players([]);
    });
    socket.io.on("connect_error", data => {
      self.players([]);
    });
    socket.on("updateList", (data) => {
      self.players(data.data.sort( (p1, p2) => p1.rank - p2.rank ));

    });

  }
  return DisplayViewModel;
}
);
