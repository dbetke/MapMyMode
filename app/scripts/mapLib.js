MapMyMode = {};


MapMyMode.Map = function(){
	this.initialLat = 35.583898;	//initial Y of mouse position
	this.initialLng = -82.559226;	//initial X of mouse position
	this.initialMapType = 2;			//index of initial selected map type in drop down list
	this.initialZoom = 10;			//initial Google zoom level
	this.mapKey = "AIzaSyAx0pkatgrti3Ruy0FZBaDBGBajUcm-ucs"; //Google Maps JavaScript API v3 key for qaeim64 - default
	this.map;
	this.strMapDivID;
	this.legend = "divLegend";
	this.geocoder;
	this.drawingManager;
	this.projectionOverlay;
	this.mapLocations = [];
	this.mapLabels = [];
	this.mapOverlays = [];
	this.kmlOverlays = [];
	this.imageOverlays = [];
	this.wmsLayers = [];
	this.drawingArray = [];
}
//Loads the initial map to the page
MapMyMode.Map.prototype.initialize = function(strMapDivID){
	this.strMapDivID = strMapDivID;
	mapOptions = {center: new google.maps.LatLng(this.initialLat, this.initialLng),
	mapTypeControl : false,
	panControl : false,
	zoom: this.initialZoom,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	if (this.initialMapType == 1){
		mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
	}else if (this.initialMapType == 2){
		mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
	}else if (this.initialMapType == 3){
		mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
	}
	else{
	}
	this.map = new google.maps.Map(document.getElementById(strMapDivID), mapOptions);
	this.map.setTilt(0);
	this.geocoder = new google.maps.Geocoder();
	this.projectionOverlay = new google.maps.OverlayView();
	this.projectionOverlay.draw = function() {};
	this.projectionOverlay.setMap(this.map);
}



//Sets map to a new state based on new lat, lng, mapType, and zoom level arguments
MapMyMode.Map.prototype.setCurrentMapState = function(cLat, cLng, cMapType, cZoom){		
	this.setMapCenterPoint(cLat, cLng);
	this.map.setZoom(cZoom);
	if (cMapType == 1){
		this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
	}else if (cMapType == 2){
		this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
	}else if (cMapType == 3){
		this.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
	}else{
		this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
	}	
}


//Creates a single marker and add the marker to the map
//Use the MarkerWithLabel library at bottom of the map
MapMyMode.Map.prototype.createMarker = function (markerObject, onClickFunctionCallback) { 
	var self = this;

	var markerProperties = {};
	for(var key in markerObject.properties){
		var keyString = key.charAt(0).toLowerCase() + key.slice(1);
		markerProperties[keyString] = markerObject.properties[key]
	} 

	var markerWidth = 20;
	var markerHeight = 20;
	var markerLatLng = new google.maps.LatLng(markerObject.geometry.coordinates[1], markerObject.geometry.coordinates[0]);

	markerProperties.marker = new MarkerWithLabel({
		position:markerLatLng,
		map: self.map,
		labelContent: markerProperties.locationID,
		labelAnchor: new google.maps.Point(-10, 20),
		labelClass: "map-labels",
		labelInBackground: true,
		labelVisible: false,
		draggable:false,
		title:markerProperties.toolTip,
		icon: {url: markerProperties.symbolPath, size: new google.maps.Size(markerWidth, markerHeight), orgin: new google.maps.Point(0, 0), anchor: new google.maps.Point((markerWidth/2).toFixed(0), (markerHeight/2).toFixed(0))},
		id: markerProperties.locationID
   	});

   	var eventHandle = 0;
	if (onClickFunctionCallback != null) {
		var eventHandle = google.maps.event.addListener(markerProperties.marker, 'click', function(e) {
			onClickFunctionCallback(markerProperties);
		});
	}
	markerProperties.eventHandle = eventHandle; 
	self.mapLocations.push(markerProperties);
}

//Creates multiple markers (point features) from a json object (See MapMyModeLib documentation for proper formatting)
MapMyMode.Map.prototype.createMarkers = function (jsonObject, onClickFunctionCallback){
	var markerFeatures = jsonObject.features;
	
	for (var i=0; i<markerFeatures.length; i++){
		this.createMarker(markerFeatures[i], onClickFunctionCallback);
	}
}

//Adds Google Maps drawing tool functionality to map which allows the user to draw points, lines, an polygons on the map
//tool can be: polygon, polyline, point, or remove
//For polygon: the user can draw a polygon, and an array of the bounding coordinates is returned [(Lat, Lng)]
//For polyline: the user can draw a polyline, and an array of the coordinates along the polyline's path is returned [(Lat, Lng)]
//For point: the user can click to create a point from which LatLng object is returned
//For remove: removes drawing tools and features
MapMyMode.Map.prototype.addDrawingTool = function (tool, callback){
	var self = this;
	//removeDrawingFeatures();
	//self.removeDrawingFeatures();
	$("#cursorLng").val("");
	$("#cursorLat").val("");
	function overlayClickListener(overlay) {
		google.maps.event.addListener(overlay, "mouseup", function(event){
		});
	}
	if (tool === "polygon"){
		self.drawingManager = new google.maps.drawing.DrawingManager({

			drawingMode: google.maps.drawing.OverlayType.POLYGON,
		    drawingControl: false,
		    drawingControlOptions: {
		    	position: google.maps.ControlPosition.TOP_CENTER
			},
			polygonOptions:{
				strokeColor: 'blue',
			    fillColor: 'blue',
			    fillOpacity: 0.1,
			    editable: false
			}
		});
		self.drawingManager.setMap(self.map);

		changeCoords(self.map);

		google.maps.event.addListener(self.drawingManager, "overlaycomplete", function(event){
			self.removeDrawingFeatures();
	        overlayClickListener(event.overlay);
			var coords = event.overlay.getPath().getArray();
			var parsedCoords = [];
			for (var i=0; i<coords.length; i++){
				var coordArray = [coords[i].lat(), coords[i].lng()]
				parsedCoords.push(coordArray);
			}
			callback(parsedCoords);
			self.drawingArray.push(event.overlay);
	    });

	    clearDrawingAndResetTools();

	}else if(tool === "polyline"){
		self.drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYLINE,
		    drawingControl: false,
		    drawingControlOptions: {
		    	position: google.maps.ControlPosition.TOP_CENTER
			},
			polylineOptions : {
				strokeColor : 'blue',
				editable: false
			}
		});
		self.drawingManager.setMap(self.map);

		changeCoords(self.map);

		google.maps.event.addListener(self.drawingManager, "overlaycomplete", function(event){
			self.removeDrawingFeatures();
	        overlayClickListener(event.overlay);
			var coords = event.overlay.getPath().getArray();
			var parsedCoords = [];
			for (var i=0; i<coords.length; i++){
				var coordArray = [coords[i].lat(), coords[i].lng()]
				parsedCoords.push(coordArray);
			}
			callback(parsedCoords);
			self.drawingArray.push(event.overlay);
	    });

	    
	    clearDrawingAndResetTools();

	}else if(tool === "point"){
		self.drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
		    drawingControl: false,
		    drawingControlOptions: {
		    position: google.maps.ControlPosition.TOP_CENTER}
		  	});
		self.drawingManager.setMap(self.map);
		changeCoords(self.map);

		google.maps.event.addListener(self.drawingManager, "overlaycomplete", function(event){
			self.removeDrawingFeatures();
	        overlayClickListener(event.overlay);
			var coords = event.overlay.getPosition();
			var parsedCoords = [coords.lat(), coords.lng()];
			callback(parsedCoords);
			self.drawingArray.push(event.overlay);
			});

		clearDrawingAndResetTools();

	}else if(tool === "remove"){
		if(self.drawingManager !== undefined){
			self.drawingManager.setDrawingMode(null);
			self.removeDrawingFeatures();

			clearDrawingAndResetTools();
		}
	}else{
		//
		clearDrawingAndResetTools();
	}

	function clearDrawingAndResetTools() {
		$( "#btnLayers" ).click(function() {
			self.deleteLocation('searchCenter', 'searchCenter');
	        self.deleteGeometry('searchCircle', 'searchCircle');
	    	self.addDrawingTool("remove");
	    	self.removeDrawingFeatures();
			$('div.InteractionMapToolClass').hide();
			$('#divUpperToolSet').children().each(function() {
				$(this).removeClass('ui-state-focus ui-state-highlight');
			});
		});
	}











