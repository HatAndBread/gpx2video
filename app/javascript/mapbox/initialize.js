import mapboxgl from "mapbox-gl";
import { debounce } from "lodash";
import { pipe } from "../lib/pipe";

let map;
let container = document.getElementById("map");

const initializeMapbox = () => {
  setAccessToken();
  setMap();
  setMapHeight();
  adjustSizeOnResize();
};

function setAccessToken() {
  const x = document.getElementById("x")
  mapboxgl.accessToken = x.dataset.x
  x.remove();
}

function setMap() {
  map = new mapboxgl.Map({
    container,
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
  });
}

function setMapHeight() {
  const distanceFromTop =
    window.pageYOffset + container.getBoundingClientRect().top;
  container.style.height = `${window.innerHeight - distanceFromTop}px`;
  map.resize();
}

function adjustSizeOnResize() {
  const handleResize = debounce(setMapHeight, 100);
  window.addEventListener("resize", handleResize);
}

export default initializeMapbox;
