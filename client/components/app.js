var app = angular.module('app', [])
.component('app', {
  controller: function () {
    console.log("hello")
    this.user = 'world';
  },
  templateUrl: 'templates/app.html',
});