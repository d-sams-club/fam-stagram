var gallery = angular.module('gallery-list', [])
  .component('gallery-list', {
    controller: function () {
      this.photos

    },
    templateUrl: 'templates/galleryList.html',
  });