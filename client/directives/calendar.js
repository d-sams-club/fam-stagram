app.directive('dhxScheduler', () => ({
  restrict: 'A',
  scope: false,
  transclude: true,
  template: '<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

  link($scope, $element, $attrs, _$controller) {
    // default state of the scheduler
    if (!$scope.scheduler) { $scope.scheduler = {}; }
    $scope.scheduler.mode = $scope.scheduler.mode || 'month';
    $scope.scheduler.date = $scope.scheduler.date || new Date();

    // watch data collection, reload on changes
    $scope.$watch($attrs.data, (collection) => {
      scheduler.clearAll();
      scheduler.parse(collection, 'json');
    }, true);

    // watch mode and date
    $scope.$watch(() => $scope.scheduler.mode + $scope.scheduler.date.toString(), (nv, ov) => {
      const mode = scheduler.getState();
      if (nv.date !== mode.date || nv.mode !== mode.mode) {
        scheduler.setCurrentView($scope.scheduler.date, $scope.scheduler.mode);
      }
    }, true);

    // size of scheduler
    $scope.$watch(() => `${$element[0].offsetWidth}.${$element[0].offsetHeight}`, () => {
      scheduler.setCurrentView();
    });

    // styling for dhtmlx scheduler
    $element.addClass('dhx_cal_container');

    // init scheduler
    scheduler.init($element[0], $scope.scheduler.date, $scope.scheduler.mode);
  },
}));

app.directive('dhxTemplate', ['$interpolate', function ($interpolate) {
  return {
    restrict: 'AE',
    terminal: true,

    link($scope, $element, $attrs, $controller) {
      $element[0].style.display = 'none';

      let htmlTemplate = $interpolate($element.html());
      scheduler.templates[$attrs.dhxTemplate] = function (start, end, event) {
        return htmlTemplate({ event });
      };
    },
  };
}]);
