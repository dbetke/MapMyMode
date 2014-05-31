angular.module('trunkApp').controller('mapCtrl', ['$scope', '$http',
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
			modeMapper.getRoute();

			

}]);




