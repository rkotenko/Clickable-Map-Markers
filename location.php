<?php
/*
    location.php is simple.  It simply fetches all the rows from the location table of the map database and returns the
    results in json format.
    
    Because of the simplicity of this program, the direct mysqli functions will be used right in the file instead of a more complicated
    database class.  
*/
header("Content-Type: application/json");

$mysqli = new mysqli('localhost', 'map_user', 'pass', 'map');

$results = $mysqli->query('select * from location');

/* 
  Addresses are stored in the database as readable human addresses (ie: 2000 Silver St Alexandria GA)
  This makes it easier to add new markers without having to look up lat and long.  Because of this though,  the lat and 
  long needs to be found using google's geocoder.  Since the data will be used client-side to create the markers and their infoboxes, 
  it makes sense to pass the data completely ready to go.
*/
while($row = $results->fetch_assoc())
{
    $geo_url = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' . urlencode($row['address']);
    $response = file_get_contents($geo_url);
    $response = json_decode($response);
    $lat = $response->results[0]->geometry->location->lat;
    $lng = $response->results[0]->geometry->location->lng;
    $data[] = Array( "lat" => $lat, "lng" => $lng, "html" => $row['html'], "address" => $row['address']);
}

echo json_encode($data);
?>