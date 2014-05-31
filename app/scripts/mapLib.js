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




// MapMyMode.Map.prototype.getRoute = function(orgin, destination, travelType){
// 	var travelModeObj = {
// 		"walking" : google.maps.TravelMode.TRANSIT,
// 		"bicycling" : google.maps.TravelMode.BICYCLING,
// 		"driving" : google.maps.TravelMode.DRIVING,
// 		"transit" : google.maps.TravelMode.TRANSIT
// 	};
// 	var directionsService = new google.maps.DirectionsService();
// 	var directionsDisplay = new google.maps.DirectionsRenderer();
// 	directionsDisplay.setMap(this.map);
// 	 var request = {
// 	      origin: orgin,
// 	      destination: destination,
// 	      travelMode: travelModeObj[travelType]
// 	  };
// 	  directionsService.route(request, function(response, status) {
// 	    if (status == google.maps.DirectionsStatus.OK) {
// 	      directionsDisplay.setDirections(response);
// 	      for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
// 				console.log(response.routes[0].legs[0].steps[i].instructions);
// 				console.log(response.routes[0].legs[0].steps[i].travel_mode);
// 			};
	      
// 	    }
// 	  });
// }
//Sets map to a new state based on new lat, lng, mapType, and zoom level arguments
MapMyMode.Map.prototype.getMap = function(cLat, cLng, cMapType, cZoom){		
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

//Resets map to the global initialize lat, lng, mapType, and zoom level variables
MapMyMode.Map.prototype.resetInitialMapState = function(){
	this.setCurrentMapState(this.initialLat, this.initialLng, this.initialMapType, this.initialZoom);
}

//Sets center of the map given a new lat and lng
MapMyMode.Map.prototype.setMapCenterPoint = function (centerLat, centerLng){
	var centerLatLng = new google.maps.LatLng(centerLat, centerLng);
	this.map.setCenter(centerLatLng);
}

MapMyMode.Map.prototype.getMapCenterPoint = function (centerLat, centerLng){
	var mapCenter = this.map.getCenter();
	return mapCenter;
}

//Sets map zoom
MapMyMode.Map.prototype.setMapZoom = function (cZoom){
	this.map.setZoom(cZoom)
}

//Sets map zoom
MapMyMode.Map.prototype.getMapZoom = function (callback){
	var mapZoom = this.map.getZoom();
	return mapZoom;
}

MapMyMode.Map.prototype.addMapZoomLevelListener = function (callback){
	var self = this;
  	google.maps.event.addListener(self.map, 'zoom_changed', function(e) {
    	var mapZoom = self.map.getZoom();
    	callback(mapZoom);
  	});
}
//Sets the base map type
MapMyMode.Map.prototype.setMapType = function (cMapType){		
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

MapMyMode.Map.prototype.getMapType = function (){		
	var mapType = this.map.getMapTypeId();
	return mapType;	
}

//Sets the map bounds based on min/max SW/NE lat, lng coordinates
MapMyMode.Map.prototype.setMapBoundsXY = function (swLat, swLng, neLat, neLng){
	var swLatLng = new google.maps.LatLng(swLat, swLng);
	var neLatLng = new google.maps.LatLng(neLat, neLng);
	var zoomBounds = new google.maps.LatLngBounds(swLatLng, neLatLng);
	this.map.fitBounds(zoomBounds);
}

//Sets the map bounds based on a Google map bounds object (as return from getMapBounds())
MapMyMode.Map.prototype.setMapBounds = function (mapBounds){
	this.map.fitBounds(mapBounds);
}

//Returns the map bounds as a Google map bounds object 
MapMyMode.Map.prototype.getMapBounds = function (){
	var mapBounds = this.map.getBounds();
	return mapBounds;
}

//Returns the pixels coordinate of the lat, lng point of the map relative to the containing map div
MapMyMode.Map.prototype.getPixelCoords = function (lat, lng){
	var newLatLng = new google.maps.LatLng(lat, lng); 
	var pixelCoords = this.projectionOverlay.getProjection().fromLatLngToDivPixel(newLatLng);
	return [pixelCoords.x, pixelCoords.y];
}

//Turns the double click zoom off
MapMyMode.Map.prototype.setMapDoubleClick = function (bolDblClick){
	this.map.setOptions({disableDoubleClickZoom : bolDblClick});
}

//Removes default Google Map UI Elements such as zoom bar and pan tool
MapMyMode.Map.prototype.removeDefaultGoogleMapsUI = function (){
	this.map.setOptions({disableDefaultUI : true});
}

//Adds default Google Map UI Elements such as zoom bar and pan tool
MapMyMode.Map.prototype.addDefaultGoogleMapsUI = function (){
	this.map.setOptions({disableDefaultUI : false});
}

//Triggers a resize event (use when dynamically resizing the map's containing div)
MapMyMode.Map.prototype.triggerMapResize = function (){
	google.maps.event.trigger(this.map, 'resize');
}

//Clears mouse move events such as lat/lng cursor position
MapMyMode.Map.prototype.clearMouseMoveEventListeners = function (){
	google.maps.event.clearListeners(this.map, "mousemove");
}
//Clears mouse up events 
MapMyMode.Map.prototype.clearMouseUpEventListeners = function (){
	google.maps.event.clearListeners(this.map, "mouseup");
}
//Clears overlay complete events
MapMyMode.Map.prototype.clearOverlayCompleteEventListeners = function (){
	google.maps.event.clearListeners(this.map, "overlaycomplete");
}
///
///***	Map Locations and Geometries ***///
///


//Clears all elements from each of the arrays containing map layers
MapMyMode.Map.prototype.clearMapArrays = function (){
	allArrays = [this.mapLocations, this.mapLabels, this.mapOverlays, this.kmlOverlays, this.imageOverlays];
	for (var n=0; n<allArrays.length; n++){
 		for (var i=0; i<allArrays[n].length; i++){
 			allArrays[n][i][0].setMap(null);
		}
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

MapMyMode.Map.prototype.openInfoWindow = function(marker, contentString){
	var self = this;
	var infowindow = new google.maps.InfoWindow({
	      content : contentString
	  });
	infowindow.open(self.map, marker);
}

//Creates multiple markers (point features) from a json object (See MapMyModeLib documentation for proper formatting)
MapMyMode.Map.prototype.createMarkers = function (jsonObject, onClickFunctionCallback){
	var markerFeatures = jsonObject.features;
	
	for (var i=0; i<markerFeatures.length; i++){
		this.createMarker(markerFeatures[i], onClickFunctionCallback);
	}
}

MapMyMode.Map.prototype.addMarkerLabelByLocation = function (locationID, markerType, label){
	for(var i=0; i<this.mapLocations.length; i++){
		if(this.mapLocations[i].locationID === locationID){
			var strLabel = String(this.mapLocations[i].locationID) + "</br>" + String(label);
			this.mapLocations[i].marker.set('labelContent', strLabel);
			this.mapLocations[i].marker.set('labelVisible', true);
		}
	}
}

MapMyMode.Map.prototype.addMarkerLabelByType = function (markerType, label){
	console.log(markerType);
	for(var i=0; i<this.mapLocations.length; i++){
		if(this.mapLocations[i].type === markerType){
			if(label == 'id'){
				this.mapLocations[i].marker.set('labelContent', this.mapLocations[i].locationID);
				this.mapLocations[i].marker.set('labelVisible', true);
			}else if (label == 'type'){
				this.mapLocations[i].marker.set('labelContent', this.mapLocations[i].type);
				this.mapLocations[i].marker.set('labelVisible', true);
			}else{
				var strLabel = String(this.mapLocations[i].locationID) + "</br>" + String(label);
				this.mapLocations[i].marker.set('labelContent', strLabel);
				this.mapLocations[i].marker.set('labelVisible', true);
			}
		}
	}
}


MapMyMode.Map.prototype.removeAllLabels = function (){
	for(var i = 0; i<this.mapLocations.length; i++){
		this.mapLocations[i].marker.set('labelContent', this.mapLocations[i].locationID);
		this.mapLocations[i].marker.set('labelVisible', false);
	}
}

MapMyMode.Map.prototype.getLabelVisibleFlag = function (markerType){
	var self = this;
	var bolVisible = false;
	for(var i = 0; i<self.mapLocations.length; i++){
		if(self.mapLocations[i].type == markerType){
			if(self.mapLocations[i].marker.get('labelVisible') === true){
				bolVisible = true;
				break;
			}
		}
	}
	return bolVisible;
}

MapMyMode.Map.prototype.getLabelStyleByType = function (markerType){
	var self = this;
	var labelStyle = {};
	for(var i=0; i<self.mapLocations.length; i++){
		if(self.mapLocations[i].type === markerType){
			labelStyle = self.mapLocations[i].marker.get('labelStyle');
			break;
		}
	}
	return labelStyle;
}

MapMyMode.Map.prototype.setLabelStyleByType = function (markerType, styleObject){
	var self = this;
	for(var i=0; i<self.mapLocations.length; i++){
		if(self.mapLocations[i].type === markerType){
			self.mapLocations[i].marker.set('labelStyle', styleObject);
		}
	}

}
MapMyMode.Map.prototype.removeMarkerLabelByType = function (markerType){
	var self = this;
	for(var i=0; i<self.mapLocations.length; i++){
		if(self.mapLocations[i].type === markerType){
			self.mapLocations[i].marker.set('labelContent', "");
			self.mapLocations[i].marker.set('labelVisible', false);
		}
	}
}
MapMyMode.Map.prototype.removeMarkerLabelByLocation = function (markerID){
	var self = this;
	for(var i=0; i<self.mapLocations.length; i++){
		if(self.mapLocations[i].locationID == markerID){
			self.mapLocations[i].marker.set('labelContent', "");
			self.mapLocations[i].marker.set('labelVisible', false);
		}
	}
}


//Deletes a marker (location) by id and type
MapMyMode.Map.prototype.deleteLocation = function (locationID, markerType){
	var self = this;
	for (var i=0; i<self.mapLocations.length; i++){
		if ((self.mapLocations[i].locationID === locationID) && (self.mapLocations[i].type === markerType)) {
			self.mapLocations[i].marker.setMap(null);
			self.mapLocations.splice(i, 1);
		}
	}
}

//Deletes markers (locations) by type
MapMyMode.Map.prototype.deleteLocationLayer = function (markerType){
	for (var i= this.mapLocations.length - 1; i>=0; i--){
		if (this.mapLocations[i].type === markerType) {
			this.mapLocations[i].marker.setMap(null);
			this.mapLocations.splice(i, 1);
		}
	}
	
}

//Toggles visibility of markers (locations) by type
MapMyMode.Map.prototype.toggleLocationLayer = function (markerType){
	for (var i=0; i<this.mapLocations.length; i++){
		if (this.mapLocations[i].type === markerType) {
			this.mapLocations[i].marker.setVisible(!this.mapLocations[i].marker.getVisible());
		}
	}
	
}

//Toggles visibility of markers (locations) by type
MapMyMode.Map.prototype.setLocationLayerVisibility = function (markerType, markerVisible){
	for (var i=0; i<this.mapLocations.length; i++){
		if (this.mapLocations[i].type == markerType) {
			this.mapLocations[i].marker.setVisible(markerVisible);
		}
	}
	
}

MapMyMode.Map.prototype.getVisibleLocations = function (){
	var visibleLocations = []
	for (var i=0; i<this.mapLocations.length; i++){
		if (this.mapLocations[i].marker.getVisible() === true) {
			visibleLocations.push(this.mapLocations[i]);	
		}
	}
	return visibleLocations;
}

MapMyMode.Map.prototype.createCircle = function (circLat, circLng, circRadius, circId, circType, circStrokeColor, circStrokeWeight, circStrokeOpacity, circFillColor, circFillOpacity, zoomFlag){

	var radiusInMeters = circRadius * 0.3048;
	var perimeterArray = [];
	var center = new google.maps.LatLng(circLat, circLng);
	for(var i=0; i<360; i++){
		var perimeterPoint = google.maps.geometry.spherical.computeOffset(center, radiusInMeters, i);
		perimeterArray.push(perimeterPoint);
	}
	var circle = new google.maps.Polygon({
		paths: perimeterArray,
		strokeColor: circStrokeColor,
		strokeWeight: circStrokeWeight,
		strokeOpacity: circStrokeOpacity,
		fillColor: circFillColor,
		fillOpacity: circFillOpacity
	});
	var circleArray = [circle, circId, circType]; 
	this.mapOverlays.push(circleArray);
	circle.setMap(this.map);
	if (zoomFlag == true) {
		latArray = [];
		lngArray = [];
		for (i=0; i<perimeterArray.length; i++){
			latArray.push(perimeterArray[i].lat());
			lngArray.push(perimeterArray[i].lng());
		}
		latArray.sort();
		lngArray.sort();
		this.setMapBoundsXY(latArray[0],lngArray[(lngArray.length)-1], latArray[(latArray.length)-1], lngArray[0]);
	}
}

MapMyMode.Map.prototype.getPolygonByID = function (strPolygonID){
	var self = this;
    for(var i=0; i<self.mapOverlays.length; i++){
        if(self.mapOverlays[i][1] == strPolygonID){
            var polygon = self.mapOverlays[i][0];
            return polygon;
        }
    }
}

//Creates a polygon overlay from a json object (See MapMyModeLib documentation for proper formatting)
MapMyMode.Map.prototype.createPolygon = function (jsonObject){
	var overlayCoords = [];
	var pgonCoords = jsonObject.features[0].geometry.coordinates[0];
	var pgonFeature = jsonObject.features[0];
	for (var i=0; i<pgonCoords.length; i++){
		overlayCoords.push(new google.maps.LatLng(pgonCoords[i][1],pgonCoords[i][0]));
	}
	var pgonOverlay = new google.maps.Polygon({
		paths: overlayCoords,
		strokeColor: pgonFeature.properties.StrokeColor,
		strokeOpacity: pgonFeature.properties.StrokeOpacity,
		strokeWeight: pgonFeature.properties.StrokeWeight,
		fillColor: pgonFeature.properties.FillColor,
		fillOpacity: pgonFeature.properties.FillOpacity	
	});
	locationID = pgonFeature.properties.LocationID;
	type = pgonFeature.properties.Type;
	pgonOverlay.setMap(this.map);
	var overlayArray = [pgonOverlay, locationID, type];
	this.mapOverlays.push(overlayArray);
}

//Creates a polyline overlay from a json object (See MapMyModeLib documentation for proper formatting)
MapMyMode.Map.prototype.createPolyline = function (jsonObject){
	var overlayCoords = [];
	var plineCoords = jsonObject.features[0].geometry.coordinates[0];
	var plineFeature = jsonObject.features[0];
	for (var i=0; i<plineCoords.length; i++){
		overlayCoords.push(new google.maps.LatLng(plineCoords[i][1], plineCoords[i][0]));
	}
	var plineOverlay = new google.maps.Polyline({
		path: overlayCoords,
		strokeColor: plineFeature.properties.StrokeColor,
		strokeOpacity: plineFeature.properties.StrokeOpacity,
		strokeWeight: plineFeature.properties.StrokeWeight
	});
	locationID = plineFeature.properties.LocationID;
	type = plineFeature.properties.Type;
	plineOverlay.setMap(this.map);
	var overlayArray = [plineOverlay, locationID, type];
	this.mapOverlays.push(overlayArray);
}

//Creates an overlay of multiple polylines from a json object (See MapMyModeLib documentation for proper formatting)
MapMyMode.Map.prototype.createPolylines = function (jsonObject, type){
	for (var j=0; j<jsonObject.features.length; j++){
		var overlayCoords = [];
		var plineFeature = jsonObject.features[j];
		var plineCoords = plineFeature.geometry.coordinates;
		for (var i=0; i<plineCoords.length; i++){
			overlayCoords.push(new google.maps.LatLng(plineCoords[i][1], plineCoords[i][0]));
		}
		var plineOverlay = new google.maps.Polyline({
			path: overlayCoords,
			strokeColor: plineFeature.properties.StrokeColor,
			strokeOpacity: plineFeature.properties.StrokeOpacity,
			strokeWeight: plineFeature.properties.StrokeWeight
		});
		plineOverlay.setMap(this.map);
		var overlayArray = [plineOverlay, type, type];
		this.mapOverlays.push(overlayArray);
	}
}

//Deletes an overlay (geometry) including circles, polylines, and polygons
MapMyMode.Map.prototype.deleteGeometry = function (id, type){
	for (var i=0; i<this.mapOverlays.length; 	i++){
		if ((this.mapOverlays[i][1] == id) && (this.mapOverlays[i][2] == type)) {
			this.mapOverlays[i][0].setMap(null);
			this.mapOverlays.splice(i, 1);
		}
	}	
}

//Toggles the visibility of an overlay (geometry) including circles, polylines, and polygons
MapMyMode.Map.prototype.toggleGeometry = function (type){
	for (var i=0; i<this.mapOverlays.length; i++){
		if (this.mapOverlays[i][2] == type) {
			this.mapOverlays[i][0].setVisible(!this.mapOverlays[i][0].getVisible());
		}
	}
	
}

//Toggles the visibility of an overlay (geometry) including circles, polylines, and polygons
MapMyMode.Map.prototype.setGeometryVisibility = function (type, geometryVisible){
	for (var i=0; i<this.mapOverlays.length; i++){
		if (this.mapOverlays[i][2] == type) {
			this.mapOverlays[i][0].setVisible(geometryVisible);
		}
	}
	
}
///
///*** KML, Image (Ground Overlay) and WMS Layers ***///
///

//Creates a KML Layer from an URL to a KML file NOTE: colorName is not currently used
MapMyMode.Map.prototype.createKMLLayer = function (kmlURL, id, type){
	var kmlLayer = new google.maps.KmlLayer({
    	url: kmlURL
  	});
  	kmlLayer.setMap(this.map);
  	var kmlArray = [kmlLayer, id, type];
		this.kmlOverlays.push(kmlArray);
}

//Deletes a KML Layer
MapMyMode.Map.prototype.deleteKMLLayer = function (id, type){
	for (var i=0; i<this.kmlOverlays.length; i++){
		if ((this.kmlOverlays[i][1] == id) && (this.kmlOverlays[i][2] == type)) {
			this.kmlOverlays[i][0].setMap(null);
			this.kmlOverlays.splice(i, 1);
		}
	}	
}

//Toggles the visibility of a KML Layer
MapMyMode.Map.prototype.toggleKMLLayer = function (type){
	for (var i=0; i<this.kmlOverlays.length; i++){
		if (this.kmlOverlays[i][2] == type) {
			this.kmlOverlays[i][0].setMap(this.kmlOverlays[i][0].getMap() ? null : this.map);
		}
	}	
}

//Create an image (ground) overlay from a geo-referenced image (such as jpeg, png) NOTE: opacity is not currently implemented
MapMyMode.Map.prototype.createImageOverlay = function (imagePath, id, type, xMin, yMin, xMax, yMax, alpha) {
	var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(yMin, xMin),
      new google.maps.LatLng(yMax, xMax));
	var imageOverlay = new google.maps.GroundOverlay(
      imagePath,
      imageBounds,
	  {clickable:false, opacity:alpha});
  	imageOverlay.setMap(this.map);
    var imageArray = [imageOverlay, id, type];
		this.imageOverlays.push(imageArray);
}

//Deletes an image (ground) overlay
MapMyMode.Map.prototype.deleteImageOverlay = function (id, type){
	for (var i=0; i<imageOverlays.length; i++){
		if ((this.imageOverlays[i][1] == id) && (this.imageOverlays[i][2] == type)) {
			this.imageOverlays[i][0].setMap(null);
			this.imageOverlays.splice(i, 1);
		}
	}	
}

//Toggles visibility of a image (ground) overlay
MapMyMode.Map.prototype.toggleImageOverlay = function (type){
	for (var i=0; i<this.imageOverlays.length; i++){
		if (this.imageOverlays[i][2] == type) {
			this.imageOverlays[i][0].setMap(this.imageOverlays[i][0].getMap() ? null : this.map);
		}
	}	
}

//Creates a WMS Layer from a Web Mapping Service URL and tiles the service for display
MapMyMode.Map.prototype.createWMSLayer = function (layerPath, layers, version, id, type, layerOpacity){;
	var wmsOptions = {
        alt: "WMS Layer",
        getTileUrl: WMSGetTileUrl,
        maxZoom: 20,
        minZoom: 0,
        name: id,
        opacity: layerOpacity, 

        tileSize: new google.maps.Size(256, 256)
    };
 
    var wmsMapType = new google.maps.ImageMapType(wmsOptions);
    
    this.map.overlayMapTypes.insertAt(0, wmsMapType); 
    var mapObject = this.map;  
    function WMSGetTileUrl(tile, zoom) {
		var projection = mapObject.getProjection();
		var zpow = Math.pow(2, zoom);
		var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
		var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
		var ulw = projection.fromPointToLatLng(ul);
		var lrw = projection.fromPointToLatLng(lr);
		var baseURL = layerPath;
		var request = "GetMap";
		var format = "image/png"; 
		var srs = "EPSG:4326"; 
		var bbox = ulw.lng() + "," + ulw.lat() + "," + lrw.lng() + "," + lrw.lat();
		var width = "256";
		var height = "256";
		var styles = "default";
		var url = baseURL + "&version=" + version + "&request=" + request + "&Layers=" + layers + "&Styles=" + styles + "&SRS=" + srs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&format=" + format + "&TRANSPARENT=TRUE";
		return url;
    }
    var wmsArray = [wmsMapType, id, type];
	this.wmsLayers.push(wmsArray);

}
  
MapMyMode.Map.prototype.toggleWMSLayer = function (type){
	for (var i=0; i<this.wmsLayers.length; i++){
		if (this.wmsLayers[i][2] == type) {
			var wmsOpacity = this.wmsLayers[i][0].getOpacity();
			if (wmsOpacity == 0){
				this.wmsLayers[i][0].setOpacity(1);
			}else{
				this.wmsLayers[i][0].setOpacity(0);
			}
		}
	}	
}

///
///***	 Legend and Map Tools	***///
///


//Clear Map of Drawing Tools
MapMyMode.Map.prototype.clearMap = function(){
	this.addDrawingTool("remove"); 
	this.removeDrawingFeatures();
	//this from the point query code
	this.deleteLocation('searchCenter', 'searchCenter');
	this.deleteGeometry('searchCircle', 'searchCircle');
	//this from the spatial query code
    this.deleteGeometry("polygon", "polygon");
    this.deleteGeometry("polyline", "polyline");
}

//Identify Location Tool
// MapMyMode.Map.prototype.identifyLocation = function(location_id, location_type, location_Lat, location_Lng, callback){
// 	this.deleteGeometry('searchCircle', 'searchCircle');
//     this.createCircle(location_Lat, location_Lng, 66, 'searchCircle', 'searchCircle', 'blue', 2, .7, 'white', 0, false);
// 	var circle = this.getPolygonByID('searchCircle');
//     var containedLocationArray = this.computeVisibleLocationsInPolygon(circle);
//     callback(containedLocationArray);
//     this.deleteGeometry('searchCircle', 'searchCircle');    
// }
MapMyMode.Map.prototype.identifyLocation = function(markerObject, callback){
	this.deleteGeometry('searchCircle', 'searchCircle');
	var point = markerObject.marker.getPosition();
    this.createCircle(point.lat(), point.lng(), 66, 'searchCircle', 'searchCircle', 'blue', 2, .7, 'white', 0, false);
	var circle = this.getPolygonByID('searchCircle');
    var containedLocationArray = this.computeVisibleLocationsInPolygon(circle);
    callback(containedLocationArray);
    this.deleteGeometry('searchCircle', 'searchCircle');    
}

//Identify Layer Tool
MapMyMode.Map.prototype.identifyLayer = function(visibleWMSLayersString, callback){
	var map = this;
	map.addDrawingTool("point", identifyLayerCallback); 
	var identifyLayerCallback = function(data){
		map.addDrawingTool("remove"); 
		var latlngArray = data;
	    if (visibleWMSLayersString.length > 0) {
		    var pixelsCoords = map.getPixelCoords(data[0], data[1]);
		    var mapBounds = map.getMapBounds();
		    var mapBoundsString = String(mapBounds.getSouthWest().lng()) + "," + String(mapBounds.getSouthWest().lat()) + "," + String(mapBounds.getNorthEast().lng()) + "," + String(mapBounds.getNorthEast().lat());
		    var nePixelCoords = map.getPixelCoords(mapBounds.getNorthEast().lat(), mapBounds.getNorthEast().lng());
		    var swPixelCoords = map.getPixelCoords(mapBounds.getSouthWest().lat(), mapBounds.getSouthWest().lng());
		    var widthInPixels = nePixelCoords[0] - swPixelCoords[0];
		    var heightInPixels = swPixelCoords[1] - nePixelCoords[1];
		    var identifyWMSURL = baseWMSURL + "&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetFeatureInfo&" + "&x=" + String(pixelsCoords[0]) + "&y=" + String(pixelsCoords[1]) + "&SRS=EPSG:4326&WIDTH=" + String(widthInPixels) + "&HEIGHT=" + String(heightInPixels) + "&Layers=" + visibleWMSLayersString + "&Query_Layers=" + vizWMSLayersString + "&info_format=application/vnd.ogc.gml&BBOX=" + mapBoundsString;
		    callback(identifyWMSURL, ajaxProxyServerPath);
		} 
	}  
}

//Spatial Queries

//Map area query tool
MapMyMode.Map.prototype.mapAreaQuery = function(queryResponseFunction){
	var map = this;
	map.clearMap();
	var drawingToolCallback = function(data){
		map.clearMap();
		var containedLocationArray = [];
	    var visibleLocations = map.getVisibleLocations();
	    if(visibleLocations.length === 0){
	        map.clearMap();
	    }else{
	        var containedLocations = map.computeContainsLocation(visibleLocations, data);
	        if(containedLocations.length === 0){
	        	map.clearMap();
	        }else{
	        	for(i = 0; i<containedLocations.length; i++){
					containedLocationArray.push(containedLocations[i]);
				}
				queryResponseFunction(containedLocationArray);
	        }
	    }
	}
	map.addDrawingTool("polygon", drawingToolCallback);
}

//Map point area query tool
MapMyMode.Map.prototype.mapPointQuery = function(radius, queryResponseFunction){
	var map = this;
	map.clearMap();
	var drawingToolCallback = function(data){
		map.clearMap();
	    map.createCircle(data[0], data[1], radius, 'searchCircle', 'searchCircle', 'blue', 2, 1, 'white', 0, true);
	    var circle = map.getPolygonByID('searchCircle');
	    var containedLocationArray = map.computeVisibleLocationsInPolygon(circle);
	    queryResponseFunction(containedLocationArray);
	}
	map.addDrawingTool("point", drawingToolCallback);
}

//Known coordinates area query tool
MapMyMode.Map.prototype.coordinatePointQuery = function(lat, lng, radius, queryResponseFunction){
	var map = this;
	map.clearMap();
	map.setMapCenterPoint(lat, lng);
    map.createCircle(lat, lng, radius, 'searchCircle', 'searchCircle', 'blue', 2, 1, 'white', 0, true);
    var circle = map.getPolygonByID('searchCircle');
    var containedLocationArray = map.computeVisibleLocationsInPolygon(circle);
   	queryResponseFunction(containedLocationArray);
}

//Known address area query tool
MapMyMode.Map.prototype.addressPointQuery = function(address, radius, addressPointQueryCallback){
	var map = this;
	map.clearMap();
	var geocodeCallback = function(results){
		if(results.length === 0){
			addressPointQueryCallback({
				"success" : false , 
				"message" : "Sorry no address was found. Please search again.", 
				"geocodeResults" : [],
				"containedLocationArray" : []
			});
		}else if(results.length > 1){
			var first5results = [];
			for(var i = 0; i < 5; i++){
				first5results.push(results[i].formatted_address)
			}
			addressPointQueryCallback({
				"success" : false,
				"message" : "Were you searching for one of the following? If not, please search again.",
				"geocodeResults" : first5results,
				"containedLocationArray" : []
			});
		}else{
			var lat=results[0].geometry.location.lat();
        	var lng=results[0].geometry.location.lng();
        	map.setMapCenterPoint(lat, lng);
        	map.createCircle(lat, lng, radius, 'searchCircle', 'searchCircle', 'blue', 2, 1, 'white', 0, true);
	    	var circle = map.getPolygonByID('searchCircle');
	    	var containedLocationArray = map.computeVisibleLocationsInPolygon(circle);
	    	if(containedLocationArray.length === 0){
	    		addressPointQueryCallback({
		    		"success" : false,
		    		"message" : "No locations were contained with the query area.",
		    		"geocodeResults" : [],
		    		"containedLocationArray" : []
		    	});
	    	}else{
	    		addressPointQueryCallback({
		    		"success" : true,
		    		"message" : results[0].formatted_address,
		    		"geocodeResults" : [],
		    		"containedLocationArray" : containedLocationArray
		    	});
	    	}
	    	
		}
	}
    this.geocodeAddress(address, geocodeCallback);
}


//Measure Tool


MapMyMode.Map.prototype.measure = function(measurementType, callback){
	var map = this;
	map.clearMap();
	if(measurementType === "length"){
		var measureLengthCallback = function(polylinePath){
			map.clearMap();
    		var measuredLength = map.computeGeometry(polylinePath, 'length');
    		callback(measuredLength);
		}
		map.addDrawingTool("polyline", measureLengthCallback);
	}else if(measurementType === "area"){
		var measureAreaCallback = function(polygonPath){
			map.clearMap();
    		var measuredArea = map.computeGeometry(polygonPath, 'area');
    		callback(measuredArea);
		}
		map.addDrawingTool("polygon", measureAreaCallback);
	}else{
		//Do nothing
	}
}

//Changes a marker icon for a given location type
MapMyMode.Map.prototype.changeLocationLayerIcon = function (type, symbolPath){
	for (var i=0; i<this.mapLocations.length; i++){
		if (this.mapLocations[i].type == type) {
			this.mapLocations[i].marker.setOptions({icon: symbolPath});
		}
	}
}
//Changes the stroke color for a given type of polyline feature
MapMyMode.Map.prototype.changePolylineStrokeColor = function (type, strokeColor){
	for (var i=0; i<this.mapOverlays.length; i++){
		if (this.mapOverlays[i][2] == type) {
			this.mapOverlays[i][0].setOptions({strokeColor: strokeColor});
		}
	}
}


//Adds cursor Latitude to the map as an input box; htmlID is the id to the HTML element to which the user would like the Lat input box appended
MapMyMode.Map.prototype.addCursorLatPosition = function (htmlID){
	$("<input id = 'cursorLat' type='text'></input>").addClass(".cursorLat").appendTo('#'+ htmlID);	
	google.maps.event.addListener(this.map, "mousemove", function(event){
	    if ($("#cursorLat").length > 0) {
			$("#cursorLat").val(Number((event.latLng.lat())).toFixed(5));
		}
	});
}

//Adds cursor Longitude to the map as an input box; htmlID is the id to the HTML element to which the user would like the Lng input box appended
MapMyMode.Map.prototype.addCursorLngPosition = function (htmlID){
	$("<input id = 'cursorLng' type='text'></input>").addClass(".cursorLng").appendTo('#'+ htmlID);	
	google.maps.event.addListener(this.map, "mousemove", function(event){
		if ($("#cursorLng").length > 0) {
			$("#cursorLng").val(Number((event.latLng.lng())).toFixed(5));
		}
	});
}     

//Calls Google's geocoding function, returns JSON with Latitude, Longitude, and formatted addresses of results (See MapMyModeLib documentation for formatting)
MapMyMode.Map.prototype.geocodeAddress = function (address, callbackFunction){
	this.geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			callbackFunction(results);
    	} 
    	else {
    		callbackFunction(results);
    	}
  	});
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

	function changeCoords(currMap) {
		$('#map').mousemove(function(evt){
			var posx = evt.pageX-this.offsetLeft;
			var posy = evt.pageY-this.offsetTop;
			$('#cursorLat').val( getLocationLat(getLatLngByOffset(currMap,posx,posy)));
			$('#cursorLng').val( getLocationLng(getLatLngByOffset(currMap,posx,posy)));
		});
	}

	function getLocationLat(location) {
	    return location.lat().toFixed(5);
	}

	function getLocationLng(location) {
	    return location.lng().toFixed(5)
	}

	/*function trunc(x) {
	    return Math.round(x * 1000) / 1000;
	}

	function getLocationText(location) {
	    return '[' + trunc(location.lng()) + ',' + trunc(location.lat()) + ']';
	}*/

	function getLatLngByOffset( map, offsetX, offsetY ){
	    var currentBounds = map.getBounds();
	    var topLeftLatLng = new google.maps.LatLng( currentBounds.getNorthEast().lat(),
	                                                currentBounds.getSouthWest().lng());
	    var point = map.getProjection().fromLatLngToPoint( topLeftLatLng );
	    point.x += offsetX / ( 1<<map.getZoom() );
	    point.y += offsetY / ( 1<<map.getZoom() );
	    return map.getProjection().fromPointToLatLng( point );
	}
}


MapMyMode.Map.prototype.getDrawingManager = function(){
	return this.drawingManager;
}


MapMyMode.Map.prototype.getDrawingPolygon = function(){
	var polygon = this.drawingArray[0];
	return polygon;
}

//Removes features created by the Drawing Manager
MapMyMode.Map.prototype.removeDrawingFeatures = function(){
	for(var i=0; i<this.drawingArray.length; i++){
		this.drawingArray[i].setMap(null);
		this.drawingArray.splice(i, 1);
	}
}

MapMyMode.Map.prototype.clearDrawingManagerEventListeners = function(){
	google.maps.event.clearInstanceListeners(this.drawingManager);
}

//Computes length and area of an input coordinate array (coordArray of the form [[lat, lng], [lat, lng], etc.])
//Computation can be either length or area
MapMyMode.Map.prototype.computeGeometry = function (coordArray, computation, callback){
	if(computation == 'length'){
		var latlngArray = [];
		for(var i = 0; i<coordArray.length; i++){
			latlngArray.push(new google.maps.LatLng(coordArray[i][0],coordArray[i][1]));
		}
		var computedLength = google.maps.geometry.spherical.computeLength(latlngArray);
		return(computedLength);
	}else if(computation == 'area'){
		var latlngArray = [];
		for(var i = 0; i<coordArray.length; i++){
			latlngArray.push(new google.maps.LatLng(coordArray[i][0],coordArray[i][1]));
		}
		var computedArea = google.maps.geometry.spherical.computeArea(latlngArray);
		return(computedArea);
	}
}

//Computes whether a point is contained by a polygon
//locationArray is of the same format as the global mapLocation Array
//[marker, locationID, markerType, markerTip];
//polygonArray is of the form [[lat, lng], [lat, lng], etc.]
MapMyMode.Map.prototype.computeContainsLocation = function (locationArray, polygonArray){
	var containedLocationArray = [];
	var overlayArray = [];
	for(var i = 0; i<polygonArray.length; i++){
		overlayArray.push(new google.maps.LatLng(polygonArray[i][0],polygonArray[i][1]));
	}
	var pgonOverlay = new google.maps.Polygon({
		paths: overlayArray
	});
	//pgonOverlay.setMap(map);
	for(var i=0; i<locationArray.length; i++){
		var point = locationArray[i].marker.getPosition();
		var bolContained = google.maps.geometry.poly.containsLocation(point, pgonOverlay);
		if (bolContained == true){
			containedLocationArray.push(locationArray[i]);
		}
	}
	return containedLocationArray;
}

//Computes whether a point is contained by a polygon
//locationArray is of the same format as the global mapLocation Array
//[marker, locationID, markerType, markerTip];
//polygonArray is of the form [[lat, lng], [lat, lng], etc.]
MapMyMode.Map.prototype.computeVisibleLocationsInPolygon = function (polygon){
	var containedLocationArray = [];
    var visibleLocations = this.getVisibleLocations();
    for(var i=0; i<visibleLocations.length; i++){
        var point = visibleLocations[i].marker.getPosition();
        var bolContained = google.maps.geometry.poly.containsLocation(point, polygon);
        if (bolContained == true){
            containedLocationArray.push(visibleLocations[i]);
        }
    }
	return containedLocationArray;
}













