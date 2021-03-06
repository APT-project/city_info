(function() {
  'use strict';
  angular.module('cityInfo').controller('MapTabController', MapTabController);

  MapTabController.$inject = ['$scope', '$timeout'];

  function MapTabController($scope, $timeout) {
    var vm = this;

    var dragStartListener = null;

    vm.map = null;
    vm.searchResults = [];

    vm.selectedPoi = null;
    vm.detailsFullscreen = false;

    $scope.showSearchResults = showSearchResults;
    $scope.clearSearchResults = clearSearchResults;

    vm.hidePoiDetails = hidePoiDetails;

    $scope.$on('mapReady', onMapReady);

    $scope.$watch('tab', function(newVal, oldVal) {
      if (newVal === 1 && vm.map !== null) {
        $timeout(function () {
          vm.map.forceRedraw();
        }, 750);
      }
    });

    function onMapReady(e, map) {
      e.preventDefault();
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      vm.map = map;

      dragStartListener = map.addListener('dragstart', function() {
          $scope.$apply(function() {
            hidePoiDetails();
          });
      });

      $scope.$broadcast('maptabPoiAttributionContainerReady', map);
    }

    function showSearchResults(resultsArr) {
      clearSearchResults();
      for (var i = 0; i < resultsArr.length; ++i) {
        var result = resultsArr[i];
        var placeLoc = result.geometry.location;
        var placeName = result.name;
        var marker = vm.map.createMarker({
          position: placeLoc,
          title: placeName
        });

        marker.addListener('click', showPoiDetails(result, marker));
        vm.searchResults.push(marker);
        vm.map.showMarker(marker);

        //center map automatically to first search result
        //TODO find a center point of all results and center to that point
        if (i === 0) {
            vm.map.panTo(placeLoc);
        }

        //if only one result was found, show the details automatically
        if (resultsArr.length == 1) {
          showPoiDetails(result, marker)();
        }
      }
    }

    function clearSearchResults() {
      hideSearchResultMarkers();
      vm.selectedPoi = null;
      vm.searchResults.length = 0;
    }

    function hideSearchResultMarkers() {
      for (var i = 0; i < vm.searchResults.length; ++i) {
        vm.map.removeMarker(vm.searchResults[i]);
      }
    }

    function showPoiDetails(poi, marker) {
      return function() {
        $scope.$apply(function(){
          vm.selectedPoi = poi;
        });

        vm.map.panTo(poi.geometry.location);

        if (!poi.hasDetails && poi.getDetails !== undefined) {
          poi.getDetails();
        }
      };
    }

    function hidePoiDetails() {
      vm.selectedPoi = null;
      vm.detailsFullscreen = false;
    }
  }
})();
