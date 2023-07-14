import { Controller } from "@hotwired/stimulus";
import mapboxgl, {LngLatBounds} from "mapbox-gl";
import debounce from "lodash.debounce";
import useStyleUrls from "../lib/use-style-urls";
import maxCoordinates from "../lib/max-coordinates";

export default class extends Controller {
  connect() {
    useStyleUrls(this);
    this.setAccessToken();
    this.setMap();
    this.set3D();
    this.setMapHeight();
    this.adjustSizeOnResize();
  }

  setAccessToken() {
    "pk" |> (mapboxgl.accessToken = this.element.dataset[^^]) || ^^ |> this.element.setAttribute(^^, null)
  }

  setMap() {
    this.map = new mapboxgl.Map({
      container: this.element,
      projection: "globe",
      preserveDrawingBuffer: true,
      style: this.satelliteURL, // style URL
      center: [139.6503, 35.6762], // starting position [lng, lat]
      zoom: 9, // starting zoom
    })
    window.ctx = this.map.painter.context
    this.gl = this.map.painter.context.gl;
    window.gl = this.gl
    console.log(this.gl)
    this.setSize();
  }

  set3D() {
    this.map.on('style.load', () => {
      this.map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      }).setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 }).setPitch(80).setBearing(41);
    });
  }

  setMapHeight() {
    window.pageYOffset + this.element.getBoundingClientRect().top
      |> (this.element.style.height = `${window.innerHeight - ^^}px`);
    this.map.resize();
    this.setSize()
  }

  setSize(){
    this.width = this.gl.drawingBufferWidth;
    this.height = this.gl.drawingBufferHeight;
  }

  adjustSizeOnResize() {
    debounce(this.setMapHeight, 100).bind(this)
      |> window.addEventListener("resize", ^^);
  }

  routeBoundingBox = (data) => {
    const bbox = {...maxCoordinates};
    data.geometry.coordinates.forEach((p) => {
      if (p[0] < bbox.ne.lng) bbox.ne.lng = p[0];
      if (p[0] > bbox.sw.lng) bbox.sw.lng = p[0];
      if (p[1] < bbox.ne.lat) bbox.ne.lat = p[1];
      if (p[1] > bbox.sw.lat) bbox.sw.lat = p[1];
    });
    return new LngLatBounds([bbox.sw.lng, bbox.sw.lat, bbox.ne.lng, bbox.ne.lat]);
  };
}
