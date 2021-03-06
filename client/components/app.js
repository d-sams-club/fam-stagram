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
      this.currentUser;
      this.searchActivities = (location) => {
        $http.get('/getActivities', {
          params: { location },
        })
          .then((data) => {
            this.activities = data.data;
          })
          .catch((err) => {
            console.error(err);
          });
      };
      this.addEvents = (title, description, link) => {
        $http.get('/currentUser')
          .then((data) => {
            this.currentUser = data.data.personId;
            console.log(this.currentUser);
          }).then(() => {
            $http.post('/events', {
              // hardcoded events data for testing
              userId: this.currentUser,
              text: title,
              business: description,
              start_date: '2019-08-27',
            });
          });
        $http.post('/sendEmail/event', {
          title,
          description,
          link,
        });
      };
    },
    templateUrl: 'templates/activities.html',
  })
  .component('events', {
    controller($scope, $http) {
      $scope.events = [];
      this.reload = () => {
        setTimeout(() => {
          window.location.reload();
        }, 0);
      };
      this.init = () => {
        $http.get('/events')
        // changes data access to work with an array with multiple events
          .then(({ data }) => {
            // passes events to template
            $scope.events = data;
          });
      };
      // gets events on page init
      this.init();
    },
    // events format must be the following:
    // $scope.events = [
    //   {
    //     id: 1,
    //     text: 'Task A-12458',
    //     start_date: new Date(2019, 10, 12),
    //     end_date: new Date(2019, 10, 16),
    //   },
    // ];
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
        this.imageUrl = '';
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
                if (message.imageUrl === 'undefined') {
                  message.imageUrl = null;
                }
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
        console.log($event.target.currentSrc);
        let srcUrl;
        if ($event.target.currentSrc) {
          srcUrl = $event.target.currentSrc.substring(7); // cut off http://
        }
        let imageUrl;
        if (srcUrl) {
          imageUrl = srcUrl.substring(srcUrl.indexOf('/'));
        }
        console.log(imageUrl);
        const name = fullMess[0].substring(0, fullMess[0].length - 1); // remove the space at the end
        let text;
        if (fullMess[1]) {
          text = fullMess[1].substring(1); // remove space at beginning
        } else {
          text = 'Check out this picture!';
        }
        $http.get('/currentUser')
          .then((data) => {
            const clickedMess = {
              name,
              text,
              imageUrl,
              userId: data.data.personId,
            };
            this.threadMessages = [clickedMess];
            $http.post('/threadmessages', {
              parentText: clickedMess,
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
      this.famName;
      this.messages = [];
      this.photoLinks = [];
      // this.reload = () => {
      //   setTimeout(() => {
      //     window.location.reload();
      //     $http.get('/photos')
      //       .then(({ data }) => {
      //         this.photos = photos;
      //         console.log(photos);
      //         photos.forEach((photo) => {
      //           console.log(this);
      //           this.photoLinks.push(`/photo/${photo.url}`);
      //         });
      //       });
      //   }, 0);
      // };

      // $http.get('/photos')
      //   .then(({ data: photos }) => {
      //     this.photos = photos;
      //     console.log(photos);
      //     photos.forEach((photo) => {
      //       console.log(this);
      //       this.photoLinks.push(`/photo/${photo.url}`);
      //     });
      //   });

      $http.get('/messages')
        .then((data) => {
          this.famName = data.data.famName;
          const storage = [];
          data.data.results.forEach((message) => {
            if (message.imageUrl !== 'undefined' && message.imageUrl) {
              storage.push(message.imageUrl);
            }
          });
          // data.data.results.forEach((message) => {
          //   storage.push(message);
          // });
          console.log(storage, 'connected to chat');
          this.messages = storage;
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
