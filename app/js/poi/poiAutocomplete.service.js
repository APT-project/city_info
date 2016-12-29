(function() {
  'use strict';
  angular.module('cityInfo.poi').service('PoiAutocompleteService', PoiAutocompleteService);

  PoiAutocompleteService.$inject = ['GoogleMapsApi', '$q'];

  function PoiAutocompleteService(GoogleMapsApi, $q) {
    var api = null;

    this.getPlacePredictions = function(query) {
      return handleQuery(query, 'getPlacePredictions');
    }

    this.getQueryPredictions = function(query) {
      return handleQuery(query, 'getQueryPredictions');
    }

    function handleQuery(query, queryFuncName) {
      return GoogleMapsApi.load().then(
        function() {
          if (api === null) {
            api = new google.maps.places.AutocompleteService();
          }

          var deferred = $q.defer();

          api[queryFuncName](query, function(resultsArr, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              deferred.resolve(resultsArr);
            }
            else {
              deferred.reject(status);
            }
          });

          return deferred.promise;
        },
        function(rejectReason) { return rejectReason; }
      );
    }
  };
})();
