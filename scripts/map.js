/*
    This file gets an arbitrary number of locations via AJAX.  Locations are returned as JSON as lat, long,
    html, and address
    
*/

// this is the main function.  It gets the locations via an ajax call to location.php

$(document).ready(function(){
    var map;
    var infoWindow;

    function load(){
        $.ajax({
            url: 'location.php',
            type: "GET",
            dataType: "json",
        }).done(createMap)  
    }

    // upon successful ajax call, this function creates the map and the appropriate markers.
    // locations
    function createMap(locations){
        var options = {
            zoom: 11,  // good zoom level to see all the markers
            center: new google.maps.LatLng(38.89, -77.03),  // lat and long for DC
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
    
        map = new google.maps.Map(document.getElementById("map"), options);
    
        // create an infowindow.  Just one that will be reused 
        infoWindow = new google.maps.InfoWindow()
    
        for(var i = 0; i < locations.length;i++){
            makeMarker(locations[i]);
        }              
    }

    // To ensure that the click event has the proper html content, the marker and even must be set and created with closure.
    //  If this were done instead inside the for loop in createMap, every marker will have the last location's html.
    function makeMarker(location){
        var latLng = new google.maps.LatLng(location.lat, location.lng);
        
        var marker = new google.maps.Marker({
            map: map,
            position: latLng,
            title: location.address
        });
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent(location.html);
            infoWindow.open(map, this);
        });
  
    } 
    
    google.maps.event.addDomListener(window, 'load', load);
    
});