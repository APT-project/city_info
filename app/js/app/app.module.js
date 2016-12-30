(function() {
  'use strict';

  function configureApp($mdThemingProvider, GoogleMapsApiProvider) {
    $mdThemingProvider.theme('default').dark();
    GoogleMapsApiProvider.setConfig({
      apiKey: 'AIzaSyDqNsDFc1Jz7XgdsoKWYnGyNBpZRL6PRh4',
      libraries: ['places']
    });
  };

  function onAppInitialized($rootScope) {
    $rootScope.fullscreen = false;
    $rootScope.initialized = false;
    $rootScope.tab = 1;

    llb_app.addListener('window_state', function(data) {
      $rootScope.$apply(function() {
        $rootScope.fullscreen = data.fullscreen;
      });
    });

    llb_app.addListener('window_dimensions', function(data) {
      $rootScope.$apply(function() {
        $rootScope.window_dimensions = data
        $rootScope.fullscreen_app_dimensions = {
          "width": data.fullscreen_width + "px",
          //TODO Find a way around this magic number,
          //it's not even accurate on all screen sizes
          "height": data.fullscreen_height + "px"
        };

        $rootScope.initialized = true;
      });
    });
    llb_app.request('window_dimensions');
  };

  angular.module('cityInfo', ['ngMaterial', 'cityInfo.map', 'cityInfo.poi', 'cityInfo.news'])
  .config(['$mdThemingProvider', 'GoogleMapsApiProvider', configureApp])
  .run(['$rootScope', onAppInitialized]);
})();
