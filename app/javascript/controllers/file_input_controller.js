import { Controller } from "@hotwired/stimulus";
import { gpx } from "@tmcw/togeojson";
import { DOMParser } from "xmldom";

export default class extends Controller {
  change() {
    new FileReader()
      |> ^^.readAsText(this.element.files[0]) || ^^
      |> (
          ^^.onload = () => ^^.result
          |> new DOMParser().parseFromString(^^, "text/xml")
          |> gpx(^^)
          |> this.drawRoute(^^) || ^^
          // |> map().drawRoute(^^)
        )
  }

  drawRoute(detail) {
    new CustomEvent("drawRoute", {detail}) |>
      window.dispatchEvent(^^);
  }
}
