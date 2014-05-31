angular.module('trunkApp').controller('mapCtrl', ['$scope', '$http', '$q',
  function($scope, $http){
        	var modeMapper = new MapMyMode.Map();
			modeMapper.initialize('map');
			modeMapper.removeDefaultGoogleMapsUI();
			modeMapper.setCurrentMapState(35.583898, -82.559226, 2, 12);
			var baseUrl = "https://maps.googleapis.com/maps/api/directions/json?";
			var params = {};
			params.origin = "Asheville";
			params.destination = "New York";
			//driving, walking, bicyling, transit
			params.mode = "driving";
			params.key = "AIzaSyAx0pkatgrti3Ruy0FZBaDBGBajUcm-ucs";
			params.sensor = false;
			//always true 
			params.alternatives = true;
			
			var getRoute = function(orgin, destination, travelType){
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
				      origin: orgin,
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

			//
			getRoute('25 Howland Rd Asheville NC', '43 Wall Street Asheville NC', 'walking');
			var annotationCallback = function(data){
				console.log(data);
				$('#bs-example-navbar-collapse-1').collapse('hide');
				$('#annotation-dialog').modal('show').css('z-index',1);
				$('.modal-backdrop').removeClass("modal-backdrop");
			}
			modeMapper.addDrawingTool("point", annotationCallback);
			// console.log(route);
			// for (var i = 0; i < route.routes[0].legs[0].steps.length; i++) {
			// 	console.log(route.routes[0].legs[0].steps[i].instructions)
			// };

			

}]);



