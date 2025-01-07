const mapNode = document.querySelector(`.landingMap`);
const { dataset: { lat: latValue, lng: lngValue, zoom: zoomValue } } = mapNode;
function initMap() {
    const lat = Number(latValue) || 38.89511;
    const lng = Number(lngValue) || -77.03637;
    const zoom = Number(zoomValue) || 8;
    const coors = { lat, lng };
    let map = new google.maps.Map(mapNode, { zoom, center: coors });

    // Define the LatLng coordinates for the polygon"s path.
    const coords = JSON.parse(document.getElementById("mapData").innerText).map(({ lat, lng }) => {
        return { 'lat': parseFloat(lat), 'lng': parseFloat(lng) }
    });
    if (coords.length == 1) {
        var marker = new google.maps.Marker({
            position: coors,
            map: map,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                labelOrigin: new google.maps.Point(75, 32),
                size: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            }
        });
    } else {
        // Construct the polygon.
        const outline = new google.maps.Polygon({
            paths: coords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
        });
        outline.setMap(map);
        /*var kmzLayer = new google.maps.KmlLayer('http://xeenat.com/energy/data.kmz');
        kmzLayer.setMap(map);*/
    }

}