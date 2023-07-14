import MapController from "./map_controller";
import {animatePath} from "../lib/animate-path";
import {loadScript} from "../lib/load-script";
import {download} from "../lib/download";
import {setNow} from "mapbox-gl";

export default class extends MapController {
  async drawRoute(e) {
    await this.setEncoder();
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

  async setEncoder() {
    await loadScript("/mp4-encode.js");
    this.encoder = await window.HME.createH264MP4Encoder();
    this.encoder.width = 100;
    this.encoder.height = 100;
    this.frame();
  }

  async frame() {
    this.encoder.initialize();
    const pixelArr = new Uint8Array(this.encoder.width * this.encoder.height * 4).fill(128);
    this.gl.readPixels(0, 0, this.encoder.width, this.encoder.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixelArr); // read pixels into encoder
    this.encoder.addFrameRgba(pixelArr)
    console.log(pixelArr);
    this.encoder.finalize();
    const uint8Array = this.encoder.FS.readFile(this.encoder.outputFilename);
    download(URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" })))
  }
}
