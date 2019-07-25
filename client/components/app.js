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
      };
      this.handleJoinFamClick = (code) => {
        $http.post('/code', {
          code,
        });
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
  .component('activities', {
    controller($http) {
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
      this.activities;
      this.searchActivities = (location) => {
        $http.get('/getActivities', {
          params: { location },
        })
          .then((data) => {
            this.activities = data.data;
            console.log(data.data);
          })
          .catch((err) => {
            console.error(err);
          });
      };
    },
    templateUrl: 'templates/activities.html',
  })
  .component('events', {
    controller($http) {
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
      this.activities;
      this.searchActivities = (location) => {
        $http.get('/getActivities', {
          params: { location },
        })
          .then((data) => {
            this.activities = data.data;
            console.log(data.data);
          })
          .catch((err) => {
            console.error(err);
          });
      };
    },
    templateUrl: 'templates/events.html',
  })
  .component('chat', {
    controller($http) {
      this.showThread = false;
      this.messages = [];
      this.threadMessages = [];
      this.famName;
      this.currentUser;
      this.handleSendClick = (value) => {
        value = value || ' ';
        $http.get('/currentUser')
          .then((data) => {
            this.currentUser = data.data.personId;
          });
        $http.post('/messages', {
          userId: this.currentUser,
          text: value,
        }).then(() => {
          $http.get('/messages')
            .then((data) => {
              famName = data.data.famName;
              const storage = [];
              data.data.results.forEach((message) => {
                console.log(message);
                storage.push(message);
              });
              this.messages = storage;
            });
        });
      };
      this.handleThreadClick = ($event) => {
        this.showThread = true;
        const fullMess = $event.currentTarget.innerText.split(':');
        console.log(fullMess);
        const name = fullMess[0].substring(0, fullMess[0].length - 1); // remove the space at the end
        const text = fullMess[1].substring(1); // remove space at beginning
        const clickedMess = {
          name,
          text,
        };
        this.threadMessages = [clickedMess];
        $http.post('/threadmessages', {
          parentText: this.threadMessages[0],
        }).then((res) => {
          console.log(res);
          $http.get(`/threadmessages?parentId=${res.data.parentId}`)
            .then((data) => {
              famName = data.data.famName;
              console.log('this.famName', this.famName, data);
              const storage = [this.threadMessages[0]];
              data.data.results.forEach((message) => {
                storage.push(message);
              });
              this.threadMessages = storage;
            });
        });
      };
      this.handleThreadSendClick = (threadValue) => {
        // threadValue = threadValue || ' ';
        $http.get('/currentUser')
          .then((data) => {
            this.currentUser = data.data.personId;
          });
        $http.post('/threadmessages', {
          userId: this.currentUser,
          text: threadValue,
          parentText: this.threadMessages[0],
        }).then((res) => {
          $http.get(`/threadmessages?parentId=${res.data.parentId}`)
            .then((data) => {
              famName = data.data.famName;
              const storage = [this.threadMessages[0]];
              data.data.results.forEach((message) => {
                storage.push(message);
              });
              this.threadMessages = storage;
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
    controller($http) {
      this.photoLinks = [];
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
          $http.get('/photos')
            .then(({data}) => {
              this.photos = photos;
              console.log(photos);
              photos.forEach((photo) => {
                console.log(this);
                this.photoLinks.push(`/photo/${photo.url}`);
              });
            });
        }, 0);
      };

      $http.get('/photos')
        .then(({data: photos}) => {
          this.photos = photos;
          console.log(photos);
          photos.forEach((photo) => {
            console.log(this);
            this.photoLinks.push(`/photo/${photo.url}`);
          });
        });
      // httpService.getPictures()
    },
    templateUrl: 'templates/photos.html',
  })
  .config(['$routeProvider', '$locationProvider',
    function config($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/chat', {
          template: '<chat></chat>',
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
        .when('/activities', {
          template: '<activities></activities>',
        })
        .when('/events', {
          template: '<events></events>',
        })
        .when('/', {
          template: '<home></home>',
        })
        .otherwise('/login');
    },
  ]);