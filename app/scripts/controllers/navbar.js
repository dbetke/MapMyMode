'use strict';

angular.module('trunkApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
    // $scope.transitTypes = [{
    // 	'value': 'Walk',
    // 	''
    // }];

      var annotationCallback = function(data){
        $('#bs-example-navbar-collapse-1').collapse('hide');
        $('#annotation-dialog').modal('show').css('z-index',1);
        $('.modal-backdrop').removeClass("modal-backdrop");
      }
      
      var modeMapper = new MapMyMode.Map();
      modeMapper.initialize('map');
      modeMapper.removeDefaultGoogleMapsUI();
      modeMapper.setCurrentMapState(35.583898, -82.559226, 2, 12);
      modeMapper.addDrawingTool("point", annotationCallback);
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.formOptions = {
      origin : "",
      destination : "",
      transType : {
              walk : true,
              bike : false,
              bus : false,
              drive : false
            },
      routeType : ""
    };
  
    var getRoute = function(origin, destination, travelType){
        var travelModeObj = {
          "walking" : google.maps.TravelMode.TRANSIT,
          "bicycling" : google.maps.TravelMode.BICYCLING,
          "driving" : google.maps.TravelMode.DRIVING,
          "transit" : google.maps.TravelMode.TRANSIT
        };
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(modeMapper.map);
         var request = {
              origin: origin,
              destination: destination,
              travelMode: travelModeObj[travelType]
          };
          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
              console.log(response.routes[0].legs[0].steps[i].instructions);
              console.log(response.routes[0].legs[0].steps[i].travel_mode);
              console.log(response.routes[0].legs[0].steps[i].path);
            };
              
            }
          });
      }

    $scope.changeTransType = function (data){
      console.log(data)
    }
    $scope.goGetRoute = function(data){
      console.log(data);
      var transType = "";
      if(data.transType.drive){
        transType = "driving"
      }
      getRoute(data.origin, data.destination, transType);
    }
  });
