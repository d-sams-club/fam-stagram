const app = angular.module('app', ['ngRoute'])
  .component('home', {
    controller() {

    },
    templateUrl: 'templates/home.html',
  })

  .component('chat', {
    controller($http) {
      this.messages = [];
      this.handleSendClick = (value) => {
        value = value || ' ';
        $http.post('/messages', {
          userId: 1,
          familyId: 1,
          text: value,
        }).then(() => {
          $http.get('/messages')
            .then((data) => {
              const storage = [];
              data.data.forEach((message) => {
                storage.push(message);
              });
              this.messages = storage;
            });
        });
      };

      this.init = () => {
        $http.get('/messages')
          .then((data) => {
            const storage = [];
            data.data.forEach((message) => {
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

    },
    templateUrl: 'templates/photos.html',
  })
  .config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider
        .when('/', {
          template: '<home></home>',
        })
        .when('/chat', {
          template: '<chat><chat>',
        })
        .when('/photos', {
          template: '<photos></photos>',
        })
        .when('/', {
          template: '<home></home>',
        })
        .otherwise('/login');
    },
  ]);
