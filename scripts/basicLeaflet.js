


//initializeMap("openstreetmap");

function initFond(fond) {

	var fond_cartes = [
		{nom: "openstreetmap", fond: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"},
		{nom: "osmlight", fond: "http://tilestream.makina-corpus.net/v2/osmlight-france/{z}/{x}/{y}.png"},
		{nom: "mapbox-world-light", fond: "http://tilestream.makina-corpus.net/v2/mapbox-world-light/{z}/{x}/{y}.png"}
	];
	
	//console.log(fond);
	
	var found = fond_cartes.find(function(e) {
  		return e.nom == fond;
	});
	
	console.log(found.fond);

	return L.map('mapid').setView([49.2, 0.7], 8).addLayer(new L.TileLayer(found.fond));

}

function drawPerimeter(fond) {

	var map = initFond(fond);
	
	var myStyle = {
		fillColor: '#4d4d4d',
		weight: 4,
		color: 'lightgrey',
		opacity: 0.5
	};
	
	d3.json("data/valleedeseineDepartements.geojson", function (data) {
	
    	console.log(data);
    	L.geoJson(data, {
			style: myStyle
		}).addTo(map);
		
    });
	
}


function drawGares(fond) {

    var map = initFond(fond);

    d3.json("data/referentiel-gares-voyageurs.geojson", function (data) {
    	
    	var valleedeseine = data.features.filter( function(d) {
          return ( (d.properties.region == "Normandie") || (d.properties.region == "\u00cele-de-France") );
        })
        
        console.log(valleedeseine);
    	
    	function onEachFeature(feature, layer) {
			if (feature.properties && feature.properties.intitule_fronton_de_gare) {
				layer.bindPopup(feature.properties.intitule_fronton_de_gare);
			}
		}
    	
    	var geojsonMarkerOptions = {
			//radius: 8,
			fillColor: "#ff7800",
			color: "#ff7800",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.5
		};

		L.geoJSON(valleedeseine, {
			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, geojsonMarkerOptions);
			},
			onEachFeature: onEachFeature,
			style: function(feature) {
				switch (feature.properties.segment_drg) {
				    case 'a': return {radius: 8};
				    case 'b': return {radius: 5};
				    case 'c': return {radius: 3};
        		}
    		}
		}).addTo(map);
		
    });

}

function drawAero(fond) {

	var map = initFond(fond);

    d3.json("data/aerodromesIGN2018.geojson", function (data) {
    	
    	var aerodromes = data.features ;
    	console.log(aerodromes);
    	
    	function onEachFeature(feature, layer) {
			if (feature.properties && feature.properties.TOPONYME) {
				layer.bindPopup(feature.properties.TOPONYME);
			}
		}
		
		var firefoxIcon = L.icon({
		    iconUrl: 'http://joshuafrazier.info/images/firefox.svg',
		    iconSize: [38, 95], // size of the icon
        });
        
        var planeIcon = L.icon({
		    iconUrl: 'img/plane_square.png',
		    iconSize: [40, 40], // size of the icon
        });
        
        var decollageIcon = L.icon({
		    iconUrl: 'img/decollage.png',
		    iconSize: [30, 30], // size of the icon
        });
    	
    	L.geoJSON(aerodromes, {
			pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {icon: decollageIcon}).addTo(map);
				//return L.circleMarker(latlng, geojsonMarkerOptions);
			},
			onEachFeature: onEachFeature
		}).addTo(map);
    
    });
}







