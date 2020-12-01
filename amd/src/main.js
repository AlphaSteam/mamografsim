import jQuery from "jquery";
import {
  Balanza,
  Barometro,
  DetectRad,
  Termometro,
  Slab_20mm,
  Slab_45mm,
  Slab_70mm,
  Toalla
} from "./herramientas";

import Habitacion from "./habitacion";
import Maquina from "./maquina";
import { Pedal } from "./pedal";
import { ClickeableObject } from "./utils";
import { 
  getCompresorPosY,
  drawPedal
} from "./vista";

import PanelResultados from "./panel-resultados";
import MesaTopDown from "./vista-top-down";

import { getError } from "./valor-errores";


import { drawReceptor } from "./vista";

window.$ = window.jQuery = $ = jQuery;

var m = null;

class Main {
  constructor(errors) {
    this.herramientas_hab = [new Barometro(), new Termometro()];
    this.herramientas_mam = [
      new Balanza(),
      new Toalla(),
      new Slab_20mm(),
      new Slab_45mm(),
      new Slab_70mm(),
      new DetectRad(),
    ];

    this.c = document.getElementById("canvas");
    this.c.addEventListener("mousedown", (e) => this.onCanvasClick(e), false);
    this.c.addEventListener("mouseup", () => this.releaseCanvasClick(), false);

    this.ctx = this.c.getContext("2d");

    //this.cr = document.getElementById("canvas-receptor");
    //this.ctxr = this.cr.getContext("2d");


    errors.errorf = getError("errorFuerzaEjercida", errors.errorf);
    errors.erroralt = getError("errorAltura", errors.erroralt);
    errors.errorvis = getError("errorFuerzaMedida", errors.errorvis);
    errors.errorma = getError("errorMiliampere", errors.errorma);
    errors.errorkv = getError("errorKilovolt", errors.errorkv);
    console.log(errors);
    this.mamografo = new Maquina(errors, this.ctx);
    this.habitacion = new Habitacion();
    this.panelResultados = new PanelResultados();
    this.mesaTopDown = new MesaTopDown(this.mamografo);

    // pedal derecho sube el compresor
    this.pedalUp = new Pedal(() => {
      this.mamografo.subirCompresor();
      this.actualizar();
    }, [220, 500]);

    // pedal izquierdo baja el compresor
    this.pedalDown = new Pedal(() => {
      this.mamografo.bajarCompresor();
      this.actualizar();
    }, [130, 500]);

    // perilla derecha sube el compresor
    this.perrillaUp = new ClickeableObject(
      () => {
        this.mamografo.subirCompresorPerilla();
        this.actualizar();
      },
      [230, getCompresorPosY()],
      [50, 50],
      20
    );

    // perilla izqueirda baja el compresor
    this.perrillaDown = new ClickeableObject(
      () => {
        this.mamografo.bajarCompresorPerilla();
        this.actualizar();
      },
      [140, getCompresorPosY()],
      [50, 50],
      20
    );

    this.herramientas_mam.forEach((tool) => {
      crearHerramButton(tool, () => this.onClickTool(this.mamografo, tool))
    });

    this.herramientas_hab.forEach((tool) => {
      crearHerramButton(tool, () => this.onClickTool(this.habitacion, tool))
    });

    this.clickeableOnCanvas = [
      this.pedalUp,
      this.pedalDown,
      this.perrillaDown,
      this.perrillaUp,
    ];
    this.clicked = null;

    this.actualizar();
  }

  actualizar() {
    // Debemos actualizar la posición de la perilla
    this.perrillaUp.posicion = [
      this.perrillaUp.posicion[0],
      getCompresorPosY(),
    ];
    this.perrillaDown.posicion = [
      this.perrillaDown.posicion[0],
      getCompresorPosY(),
    ];

    // actualizar significa que vamos a dibujar
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    //dibujar el mamografo
    // this.mamografo.actualizar(false, this.herr_activas);
    // dibujar en el canvas las herramientas nuevas
    drawPedal(this.ctx, this.pedalDown.getState(), this.pedalUp.getState());
    this.mamografo.dibujar(this.ctx);
    this.habitacion.dibujar(this.ctx);

    // dibujar en el canvas las herramientas nuevas
    // this.herr_activas.forEach((t) => t.dibujar(this.ctx));

    //dibujar resultados
    //this.herr_activas.forEach((t) => t.dibujar_resultado(this.ctxres));

    this.panelResultados.limpiarResultados();
    try {
      this.panelResultados.registrarResultado(this.mamografo.getHerramienta().getResultado());
    } catch (error) {
      console.log(error);
    }
    try {
      this.panelResultados.registrarResultado(this.habitacion.getHerramienta().getResultado());
    } catch (error) {
      console.log(error);
    }
    this.panelResultados.escribirResultados();
  }

  getMamografo() {
    console.log("Conseguimos mamografo");
    return this.mamografo;
  }

  onClickTool(herramientaHolder, tool) {
    if (tool.addon){
      herramientaHolder.setHerramienta(tool,true);
    }
    else{
      herramientaHolder.setHerramienta(tool);
    }

    this.actualizar();
  }

  // Este método se levanta cada vez que hay un click en el canvas
  // Checkea que se haya clickeado
  onCanvasClick(e) {
    let click = [e.layerX, e.layerY];

    for (let index = 0; index < this.clickeableOnCanvas.length; index++) {
      let elemento = this.clickeableOnCanvas[index];
      if (elemento.isClicked(click)) {
        this.clicked = elemento;
        elemento.on_click();
        break;
      }
    }
  }

  // Checkea que se elementó se clickeo y activa su callback
  releaseCanvasClick(e) {
    if (this.clicked !== null) {
      this.clicked.on_release();
      this.clicked = null;
      this.actualizar();
    }
  }
}

export const init = (errors,pruebas2) => {
  //console.log(errors);
  let errordict = {}
  errors.forEach((pair) => {
    errordict[pair[0]] = pair[1];

  });
  console.log(errordict);
  m = new Main(errordict);
  let elems;
  document.getElementById("herrams-mas").onclick = show_h;
  document.getElementById("herrams-menos").onclick = hide_h;


  // botones de herramientas en popup
  elems = document.getElementsByClassName("herrams-btn");
  for (let i = 0; i < elems.length; i++) {
    elems[i].onclick = hide_h;
  }
  document.getElementById("plantilla-abrir").onclick = show_p;
  document.getElementById("plantilla-cerrar").onclick = hide_p;
  document.getElementById("vista-desde-arriba").onclick = show_mesa;
  document.getElementById("Guardar-pos").onclick = () => m.mesaTopDown.check_pos();
  document.getElementById("cerrar_alerta_posicion_incorrecta").onclick = () => m.mesaTopDown.hide_alerta_incorrecta();
  document.getElementById("cerrar_alerta_posicion_correcta").onclick = () => m.mesaTopDown.hide_alerta_correcta();
  document.getElementById("cerrar-vista-desde-arriba").onclick = () => m.mesaTopDown.hide_mesa();
  elems = document.getElementsByClassName("open-sim");
  for (let i = 0; i < elems.length; i++) {
    elems[i].onclick = show_sim;
  }


  //Agregar una nueva prueba 
  let pruebas = ['compresion', 'rendimiento', 'imagen'];
  
 
  pruebas = [];
  pruebas2.forEach((prueba)=>{
    pruebas.push(prueba);
   if(prueba !== ""){
    console.log("prueba pusheada");
     
   }
  });
  //pruebas = [pruebas2[0],pruebas2[1]];
  
  //Agregar una nueva prueba 
  var label_prueba = {};
  label_prueba["compresion"] = "Fuerza de Compresión y Precisión de Espesor";
  label_prueba["rendimiento"] = "Rendimiento: Repetibilidad y Linealidad";
  label_prueba["imagen"] = "Control de Calidad de un Objeto de Prueba y Artefactos en el Receptor de Imagen";

  $('<h2> Seleccionar una prueba: </h2> <br>').appendTo("#contenedor-button")

  let r;
  for (let x of pruebas) {
    console.log(x);
    r = $(`<button id = "inicio-${x}" class="open-sim"><img src="icons/play.png" width=64><br>${label_prueba[x]}</button>`);
    r.on("click", () => cargarPrueba(x));
    r.appendTo("#contenedor-button");
  }

  $("#volver-menu").on('click', () => {
    $("#contenedor-button").show();
    $("#contenedor-sim").hide();
  })
  $("#loader").remove();

  $("body").on("click","#volver",function(){

    $("#modal-volver").modal("show");

    //appending modal background inside the contenedor-main div
    $('.modal-backdrop').appendTo('#contenedor-sim');

    //remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    $('body').removeClass("modal-open");
    $('body').css("padding-right","");
  });

  console.log("Simulador inicializado");
};

function show_h() {
  let x = document.getElementById("herrams");
  x.style.display = "block";
}

function hide_h() {
  let x = document.getElementById("herrams");
  x.style.display = "none";
}

function show_p() {
  let x = document.getElementById("plantilla");
  x.style.display = "block";
}

function hide_p() {
  let x = document.getElementById("plantilla");
  x.style.display = "none";
}

function show_mesa() {
  let x = document.getElementById("vista-arriba-receptor");
  x.style.display = "block";
  var receptor = new Image();
  receptor.src = "img/receptor.svg";
  var cr = document.getElementById("canvasReceptor");
  cr.style.display = "block";
  var ctxr = cr.getContext("2d");
  ctxr.clearRect(0, 0, cr.width, cr.height);
  var scale = 1.0;
  
  ctxr.drawImage(receptor,155,-30,receptor.width*scale*0.8,receptor.height*scale*0.8)

}


// FIN VISTA CAMARA DE IONIZACION


function crearHerramButton(tool, onClickF) {

  let r = $(
    `<button title= "${tool.description}" class="herrams-btn btn btn-light her-b-s"> </button>`
  ).append(`<img src="icons/${tool.icon}" width=48><br>${tool.tipo}`);
  r.on("click", onClickF);
  r.appendTo("#herramientas-express");

  let r_col = $(`<div class="col-sm-2"></div>`);
  let r2 = r.clone().removeClass("her-b-s").addClass("her-b-l");
  r2.on("click", onClickF);
  r_col.append(r2);
  r_col.appendTo("#herrams-lista-completa");
}

function cargarPrueba(prueba) {
  console.log(`cargar prueba ${prueba}`);
  $("#container-pasos").load(`pasos/pasos_prueba_${prueba}.html`);
  $("#container-plantilla").load(`plantillas/plantilla_prueba_${prueba}.html`);
  $("#contenedor-sim").css('display', 'flex');
  $("#contenedor-button").hide();
};

//error: null has no properties
export let setear_params = (kv, ma, md, fltr, anod) => {
  m.getMamografo().setearParams(kv, ma, md, fltr, anod);
};

//disparo mamografo apretando boton shoot
export let disparo = () => {
  console.log("Shoot2");
  m.getMamografo().activar();
  m.actualizar();
};
function disparoMamografo() {

};


// ESTO DEBERIA ESTAR SOLO EN drag-drop-receptor

document.addEventListener("drag", function (event) {
  console.log("pick");
}, false);

document.addEventListener("dragstart", function (event) {
  console.log("dragstart");
  // store a ref. on the dragged elem
  this.dragged = event.target;
  // make it half transparent
  event.target.opacity = 0.5;
}, false);

document.addEventListener("dragend", function (event) {
  console.log("reseteo transparencia");
  // reset the transparency
  event.target.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function (event) {
  // prevent default to allow drop
  event.preventDefault();
}, false);

document.addEventListener("dragenter", function (event) {
  console.log("Estoy dentro de un dropzone")
  // highlight potential drop target when the draggable element enters it
  if (event.target.className == "dropzone") {
      event.target.style.background = "red";
  }

}, false);

document.addEventListener("dragleave", function (event) {
  console.log("salgo de mi posicion original");
  // reset background of potential drop target when the draggable element leaves it
  if (event.target.className == "dropzone") {
      event.target.style.background = "";
  }

}, false);

document.addEventListener("drop", function (event) {
  // prevent default action (open as link for some elements)
  event.preventDefault();
  // move dragged elem to the selected drop target
  if (event.target.className == "dropzone") {
      event.target.style.background = "";
      this.dragged.parentNode.removeChild(this.dragged);
      event.target.appendChild(this.dragged);
      //PARA CHECKEAR SI ESTA EN POSICION CORRECTA
      if (event.target.id == "posicion_buena"){
        m.mesaTopDown.check_pos_correct()
      }
      else{
        m.mesaTopDown.check_pos_incorrect()
      }
  }

}, false);