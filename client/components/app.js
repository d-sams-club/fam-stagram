var app = angular.module('app', [])
.component('app', {
  controller: function ($http) {
    this.messages = [] 
    this.handleSendClick = (value) => {
      value = value || " "
      $http.post('/messages', 
      {
        userId: 1,
        familyId: 1,
        text: value,
      });

      $http.get('/messages')
      .then((data) => {
        let storage = [];
        data.data.forEach(message => {
            storage.push(message);
        });
        this.messages = storage;
      });
    }

    this.init = () => {
      $http.get('/messages')
      .then((data) => {
        let storage = [];
        data.data.forEach(message => {
            storage.push(message);
        });
        this.messages = storage;
      });
    }
    this.init();
  },
  templateUrl: 'templates/app.html',
});