import { BaseNula } from "./herramientas";
import { preloadImages, drawMam, drawPedal } from "./vista";

import { check_pos, hide_alerta_correcta, hide_alerta_incorrecta, hide_mesa } from "./main";
//import { setearParamsMamografo } from "./control-panel";

const alturaMax = 80;
const margenF = 0;
const rangemargenKV = 0;
const rangemargenmA = 1;
const margenAlt = 2;


function rand(lowest, highest) {
  var adjustedHigh = (highest - lowest) + 1;
  return Math.floor(Math.random() * adjustedHigh) + parseFloat(lowest);
}

export default class Maquina {
  constructor(errors, ctx) {
    this.herramienta = new BaseNula();
    //Errores
    this.errorKilovolt = parseInt(errors["errorkv"]);
    this.errorMiliamperios = parseInt(errors["errorma"]);
    this.errorFuerza = errors["errorf"];
    this.errorAltura = errors["erroralt"];
    this.errorVisor = errors["errorvis"];

    this.alturaCompresor = 80;
    this.alturaEspesor = 25;
    this.fuerza = 0.0;
    this.fuerzamax = this.errorFuerza; 
    this.fuerzamaxManual = this.errorFuerza;
    //Movimiento compresor
    this.velocY = 0.8;
    this.velocYManual = 0.5;

    //Formula de compresión
    this.factorCompresiónini = 1;
    this.factorCompresion = this.factorCompresiónini;
    this.velocCompresion = 0.1;
    this.multCompresion  = 0.8;
    this.sumaCompresion = 8;
    this.sumaCompresionManual = 8;

    //NOSE SI COLOCAR VALORES POR DEFECTO EN EL CONSTRUCTOR
    this.kilovolt = null;
    this.miliamperios = null;
    this.modo = null;
    this.filtro = null;
    this.anodo = null;

    
    
    

    preloadImages().then(() => {
      drawMam(ctx, this.alturaDesplegada());
      drawPedal(ctx, false, false)});

    //setearParamsMamografo();
  }


  mError(x) {
    return Math.random() * x - (x / 2);
  }
  //para margen de error aleatorio involuntario, devuelve un numero entero entre min y max
  mErrorInt(min, max) {
    return (Math.floor(Math.random() * ((max+1) - min + 1) ) + min);
  
  }



  construirEstado(isActivo) {
    //let errorF = rand(-this.errorFuerza,this.errorFuerza)
    let margenKV = 0;
    let margenmA = this.mErrorInt(-rangemargenmA,rangemargenmA)

    //console.log(this.errorFuerza);
    return {
      altura: (this.alturaCompresor),
         fuerza: this.factorCompresion > this.factorCompresiónini
         ? (this.fuerza)
         : 0,
      kilovolt: this.kilovolt + this.errorKilovolt,
      miliamperios: this.miliamperios + this.errorMiliamperios,

      filtro: this.filtro,
      anodo: this.anodo,
      modo: this.modo,
      activo: isActivo,
    };
  }

  valoresMedidos() {
    return {
      altura: this.alturaCompresor == this.alturaMinima()
        ? (this.alturaCompresor + this.errorAltura) * 10
        : this.alturaCompresor < this.alturaEspesor
          ? (this.alturaCompresor) * 10
          : 0,
          fuerza: this.factorCompresion > this.factorCompresiónini
          ? (this.fuerza+this.errorVisor)
          : 0
    };
  }

  alturaMinima() {
    return this.herramienta.getAltura();
  }

  alturaDesplegada() {
    return this.alturaCompresor * 2
  }


  actualizar(activo = false) {

    if (!activo) {
      this.herramienta.actualizar(this.construirEstado(activo));
    } else {

      let estado = this.construirEstado(activo);

      let request = {
        "kvp": estado.kilovolt,
        "mas": estado.miliamperios,
        "anodo": estado.anodo,
        "filtro": estado.filtro,
      };

      $.ajax({
        url: "http://moodle2.cimt.cl/api/kerma",
        type: "get",
        data: request,
        async: false,
        success: (data) => {
          estado.kerma = data.kerma;
          this.herramienta.actualizar(estado);
        }
      });
    }

  }

  dibujar(ctx) {
    drawMam(
      ctx,
      this.alturaDesplegada(),
      [this.herramienta],
      this.valoresMedidos().fuerza.toFixed(2),
      this.valoresMedidos().altura
    );
  }

  // Setea los parametros del panel de control
  setearParams(kv, ma, md, fltr, anod) {
    console.log("seteo nuevos parametros");
    this.kilovolt = kv;
    this.miliamperios = ma;
    this.modo = md;
    this.filtro = fltr;
    this.anodo = anod;
  }

  // Selecciona una nueva herramienta o deselecciona la antigua
  setHerramienta(herram, addon = false) {
    if (this.factorCompresion != this.factorCompresiónini || this.alturaCompresor - 5 < herram.altura) {
      throw 'No se puede posicionar la herramienta con el compresor tan bajo';
      // return;
    }
    if (addon) {

      herram.action(this);

    }
    else {

      //La idea es que se compare con un arreglo de herramientas que permiten la vista desde arriba
      if (herram.getTipo() === "Detector de Radiación") {
        //MOSTRAR BOTON
        document.getElementById("vista-desde-arriba").style.display = "block";
        //CARGAR VISTA TOP DOWN
        //await Promise($("#container-vista-arriba").load(`configuraciones_top_down/top_down_rendimiento.html`));
        console.log("BOTON CONFIGURADO");
      }
      else {
        document.getElementById("vista-desde-arriba").style.display = "none";
      }
      if (this.herramienta.getTipo() == herram.getTipo()) {
        if (herram.getTipo() === "Detector de Radiación") {
          //OCULTAR BOTON
          document.getElementById("vista-desde-arriba").style.display = "none";

        }
        this.herramienta = new BaseNula();
      } else {
        this.herramienta = herram;
      }

      this.actualizar();
    }
  }

  getHerramienta() {
    return this.herramienta;
  }

  activar() {
    this.actualizar(true);
  }

  subirCompresor() {
    if (
      this.alturaCompresor + 1 > alturaMax
    ) {
      throw "compresor tope arriba";
    }
    if(this.factorCompresion === this.factorCompresiónini){
      this.alturaCompresor += this.velocY;
    }
    this.factorCompresion = Math.max(this.factorCompresion - this.velocCompresion * 10,this.factorCompresiónini);
    this.fuerza = Math.max(Math.log2(this.factorCompresion)*this.multCompresion + this.sumaCompresion,0);
    this.actualizar();
  }

  bajarCompresor() {
    console.log(this.fuerza);
    console.log(this.fuerzamax);
    console.log(this.factorCompresion);
    if (this.alturaCompresor <= this.herramienta.altura) {
      if(this.fuerza < this.fuerzamax){
       
        this.factorCompresion = this.factorCompresion + this.velocCompresion;
        this.fuerza = Math.max(Math.min(Math.log2(this.factorCompresion)*this.factorCompresion + this.sumaCompresion,this.fuerzamax),this.fuerza);
      }
   
    } else {
      this.alturaCompresor = Math.max(this.alturaCompresor - this.velocY, this.alturaMinima());
    }
    this.actualizar();
  }


  subirCompresorPerilla() {
    if (
      this.alturaCompresor + 1 > alturaMax
    ) {
      throw "compresor tope arriba";
    }
    if(this.factorCompresion == this.factorCompresiónini){
      this.alturaCompresor += this.velocYManual;
    }
    
    this.factorCompresion = Math.max(this.factorCompresion - this.velocCompresion * 10,this.factorCompresiónini);
    this.fuerza = Math.max(Math.log2(this.factorCompresion)*this.multCompresion + this.sumaCompresionManual,0);
    this.actualizar();
  }

  bajarCompresorPerilla() {
    
    if (this.alturaCompresor <= this.herramienta.altura) {
      if(this.fuerza  < this.fuerzamaxManual){
        this.factorCompresion = this.factorCompresion + this.velocCompresion;
        this.fuerza = Math.max(Math.min(Math.log2(this.factorCompresion)*this.factorCompresion + this.sumaCompresionManual,this.fuerzamaxManual),this.fuerza);
      }
     
    } else {
      this.alturaCompresor = Math.max(this.alturaCompresor - this.velocYManual, this.alturaMinima());
    }
    this.actualizar();
  }


}


