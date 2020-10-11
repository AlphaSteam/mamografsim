import {
  Balanza,
  Barometro,
  CamaraIonizacion,
  CintaMetrica,
  Electrometro,
  Termometro,
} from "./herramientas";

import { Maquina } from "./maquina";

import jQuery from "jquery";
<<<<<<< HEAD
import {drawMam,preloadImages} from "./vista";
=======
import { drawMam, drawMamOnLoad } from "./vista";
>>>>>>> 0f6f3ff0b27605121d4dfa344ced7ea3a5182b14
window.$ = window.jQuery = $ = jQuery;

class Main {
  constructor() {
    this.herr_activas = [];

    this.herr_disponibles = [
      new Balanza(),
      new Barometro(),
      new CamaraIonizacion(),
      new CintaMetrica(),
      new Electrometro(),
      new Termometro(),
    ];
<<<<<<< HEAD
    
    
=======

    // this.mamografo = new Maquina();

>>>>>>> 0f6f3ff0b27605121d4dfa344ced7ea3a5182b14
    this.c = document.getElementById("canvas");
    this.ctx = this.c.getContext("2d");

    // this.mamografo =
    // this.panel_control =
    //
    console.log("dibujar iconos");
    this.herr_disponibles.forEach((tool) => {
      let r = $(`<button title= "AD." class="herrams-boton"> </button>`).append(
        `<img src="icons/${tool.icon}" width=64><br>${tool.tipo}`
      );

      r.on("click", () => this.onClickTool(tool));
      r.appendTo("#herramientas-express");
      console.log("dibujar 1");
    });

    this.update();
  }

  update() {
    console.log("Update");
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    drawMam();
    // dibujar en el canvas las herramientas nuevas
    this.herr_activas.forEach((t) => t.dibujar(this.ctx));
    //dibujar el mamografo
  }

  onClickTool(tool) {
    console.log(tool);
    const i = this.herr_activas.indexOf(tool);
    if (i > -1) {
      this.herr_activas.splice(i, 1);
    } else {
      this.herr_activas.push(tool);
    }
    this.update();
  }

  // Este método se levanta cada vez que hay un click en el canvas
  // Checkea que se haya clickeado
  onCanvasClick(e) {}

  onCanvasReleaseClick(e) {}
}

export let init = () => {
 let m = new Main();
preloadImages().then(drawMam);
console.log("Simulador inicializado");
};
