(function() {
  'use strict';
  angular.module('cityInfo.map').factory('MapFactory', GMapFactory);

  GMapFactory.$inject = ['GoogleMapsApi', '$q'];

  function GMapFactory(GoogleMapsApi, $q, mapDiv, center) {
    return {
      createMap: function(mapDiv, center) {
        return GoogleMapsApi.load().then(
          function() {
            if (!(mapDiv instanceof Element)) {
              return $q.reject("MapDiv was not Element");
            }

            var mapOptions = {
              zoom: 14,
              center: center,
              mapTypeId: 'roadmap',
              disableDefaultUI: true
            };
            var map = new google.maps.Map(mapDiv, mapOptions);

            var mapObj = {
              setCenter: setCenter,
              panTo: panTo,
              setZoom: setZoom,
              fitBounds: fitBounds,
              getBounds: getBounds,
              createMarker: createMarker,
              showMarker: showMarker,
              removeMarker: removeMarker,
              addListener: addListener,
              addListenerOnce: addListenerOnce,
              removeListener: removeListener,
              forceRedraw: forceRedraw,
              getGoogleMap: getMap
            };
            return mapObj;

            function setCenter(center) {
              map.setCenter(center);
            };

            function panTo(center) {
              map.panTo(center);
            };

            function setZoom(zoom) {
              map.setZoom(zoom);
            };

            function fitBounds(bounds) {
              map.fitBounds(bounds);
            }

            function getBounds() {
              return map.getBounds();
            }

            function createMarker(properties) {
              var marker = new google.maps.Marker(properties);
              return marker;
            }

            function showMarker(marker) {
              marker.setMap(map);
            }

            function removeMarker(marker) {
              marker.setMap(null);
            }

            function addListener(eventName, listener) {
              return map.addListener(eventName, listener);
            }

            function addListenerOnce(eventName, listener) {
              return map.addListenerOnce(eventName, listener);
            }

            function removeListener(listenerHandle) {
                map.removeListener(listenerHandle);
            }

            function forceRedraw() {
              google.maps.event.trigger(map, 'resize');
            }

            function getMap() {
              return map;
            }
          },
          function(rejectReason) {
            return $q.reject(rejectReason);
          }
        );
      }
    };
  };
})();
