const app = angular.module('app', ['ngRoute'])
  .component('loggedin', {
    controller($http) {
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };

      this.handleCreateFamClick = (famName) => {
        $http.post('/fam', {
          name: famName,
        });
        console.log(famName);
      };
      this.handleJoinFamClick = (code) => {
        $http.post('/code', { code });
        console.log('join code: ', code);
      };
    },
    templateUrl: 'templates/loggedin.html',
  })
  .component('home', {
    controller() {
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
    },
    templateUrl: 'templates/home.html',
  })
  .component('sharecode', {
    controller($http) {
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
      this.sendEmail = (email) => {
        $http.post('/sendEmail', {
          recipientEmail: email,
        });
      };
    },
    templateUrl: 'templates/shareCode.html',
  })
  .component('chat', {
    controller($http) {
      this.messages = [];
      this.famName;
      this.handleSendClick = (value) => {
        value = value || ' ';
        $http.post('/messages', {
          userId: 1,
          text: value,
        }).then(() => {
          $http.get('/messages')
            .then((data) => {
              const storage = [];
              data.data.results.forEach((message) => {
                storage.push(message);
              });
              this.messages = storage;
            });
        });
      };
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
      this.init = () => {
        $http.get('/messages')
          .then((data) => {
            this.famName = data.data.famName;
            const storage = [];
            console.log(data);
            data.data.results.forEach((message) => {
              storage.push(message);
            });
            this.messages = storage;
          });
      };
      this.init();
    },
    templateUrl: 'templates/chat.html',
  })
  .component('photos', {
    controller() {
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
    },
    templateUrl: 'templates/photos.html',
  })
  .config(['$routeProvider', '$locationProvider',
    function config($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/chat', {
          template: '<chat><chat>',
        })
        .when('/photos', {
          template: '<photos></photos>',
        })
        .when('/user', {
          template: '<loggedin></loggedin>',
        })
        .when('/sharecode', {
          template: '<sharecode></sharecode>',
        })
        .when('/', {
          template: '<home></home>',
        })
        .otherwise('/login');
    },
  ]);
