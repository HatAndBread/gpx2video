const streetsURL = "mapbox://styles/mapbox/streets-v12";
const satelliteURL = "mapbox://styles/mapbox/satellite-v9";
const satelliteStreetsURL = "mapbox://styles/mapbox/satellite-streets-v12";
const outdoorsURL = "mapbox://styles/mapbox/outdoors-v12";
const lightURL = "mapbox://styles/mapbox/light-v11";
const darkURL = "mapbox://styles/mapbox/dark-v11";

export default (controller) =>
  Object.assign(controller, {
    streetsURL,
    satelliteURL,
    satelliteStreetsURL,
    outdoorsURL,
    lightURL,
    darkURL,
  });
