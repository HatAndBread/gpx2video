import MapController from "./map_controller";
import {animatePath} from "../lib/animate-path";

export default class extends MapController {
  drawRoute(e) {
    e.detail.features.forEach((data) => {
      const { name } = data.properties;
      switch (data.geometry.type.toLowerCase()) {
        case "linestring": {
          return this.drawLineString(name, data);
        }
        case "point": {
          return this.drawPoint(name, data);
        }
        default:
          throw new Error(`Unhandled geojson feature type: ${data.geometry.type}`);
      }
    });
  }

  drawLineString(name, data) {
    return this.addSource(name, data)
      .addLayer(this.layerOptions(name))
      .fitBounds(this.routeBoundingBox(data), {padding: 120})
      |> animatePath(
        {
          map: ^^,
          duration: 60000,
          path: data,
          startBearing: 41,
          startAltitude: 3000,
          pitch: 50,
          layerName: name
        }
      )
  }

  drawPoint(name, data) {
    console.log(name, data);
  }

  addSource(name, data) {
    return this.map.addSource(name, {
      type: "geojson",
      lineMetrics: true,
      data,
    });
  }

  layerOptions(name) {
    return {
      id: name,
      type: "line",
      source: name,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#f00",
        "line-width": 5,
      },
    };
  }
}
