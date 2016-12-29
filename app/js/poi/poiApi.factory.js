(function() {
  'use strict';
  angular.module('cityInfo.poi').factory('PoiApiFactory', GPlacesFactory);

  GPlacesFactory.$inject =  ['GoogleMapsApi', '$q'];

  function GPlacesFactory(GoogleMapsApi, $q) {
    return {
      createApi: function(attributionContainer) {
        return GoogleMapsApi.load().then(
          function() {
            var api = null;

            //Check that attributionContainer is valid (= Google Maps object or HTML div)
            if (attributionContainer == null) {
              return $q.reject("attributionContainer is null");
            } else if (attributionContainer instanceof google.maps.Map) {
              api = new google.maps.places.PlacesService(attributionContainer);
            } else if (attributionContainer.getGoogleMap !== undefined && attributionContainer.getGoogleMap() instanceof google.maps.Map) {
              api = new google.maps.places.PlacesService(attributionContainer.getGoogleMap());
            } else if (attributionContainer instanceof HTMLDivElement) {
              api = new google.maps.places.PlacesService(attributionContainer);
            }
            else {
                return $q.reject("attributionContainer is null");
            }

            var googlePlaces = {
              searchWithDetails: searchWithDetails,
              search: search,
              getDetails: getDetails,
            };

            googlePlaces.Status = {
              OK: google.maps.places.PlacesServiceStatus.OK,
              ZERO_RESULTS: google.maps.places.PlacesServiceStatus.ZERO_RESULTS,
              DENIED: google.maps.places.PlacesServiceStatus.REQUEST_DENIED,
              INVALID: google.maps.places.PlacesServiceStatus.INVALID_REQUEST,
              OVER_QUOTA: google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT,
              UNKNOWN: google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR
            };

            return googlePlaces;

            function searchWithDetails(queryObj, callback) {
              api.nearbySearch(queryObj, callback);
            };

            function search(queryObj, callback) {
              api.radarSearch(queryObj, callback);
            };

            function getDetails(queryObj, callback) {
              if ((typeof queryObj) === 'string') {
                api.getDetails({ placeId: queryObj }, callback);
              }
              else {
                api.getDetails(queryObj, callback);
              }
            };

          },
          function(rejectReason){
            return $q.reject(rejectReason);
          }
        );
      }
    };
  };
})();
