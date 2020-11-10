// Abstract Herramienta
"use strict";
class AbstractTool {
  constructor() {
    if (this.constructor === AbstractTool) {
      throw new TypeError("Cannot construct abstract class");
    }
    if (this.actualizar === AbstractTool.prototype.actualizar) {
      throw new TypeError("Please implement abstract method actualizar");
    }
    if (this.dibujar === AbstractTool.prototype.dibujar) {
      throw new TypeError("Please implement abstract method dibujar");
    }

    this.altura = 0;
  }

  actualizar(estado) {
    throw new TypeError("Do not call abstract method actualizar from child");
  }

  dibujar() {
    throw new TypeError("Do not call abstract method dibujar from child");
  }

  getResultado() {
    return {};
  }

  getTipo() {
    return this.tipo;
  }

  getAltura() {
    return this.altura;
  }
}

class BaseNula extends AbstractTool {
  constructor() {
    super();
    this.tipo = "null";
    this.estado = "null";
    this.altura = 0;
  }

  actualizar(estado) {
    // Undefined method
  }

  dibujar() {
    // Undefined method
  }
}

class Balanza extends AbstractTool {

  constructor() {
    super();
    this.toalla = false;
    this.tipo = "Balanza";
    this.icon = "balanza.png";
    this.altura = 5;
    this.estado = "inactivo";
    this.fuerza = 0;
    this.scale = 0.5;
    this.x = 152;
    this.y = 265;
    this.description = "Esta es una balanza.";

    this.balanza = new Image();
    this.balanza.src = 'img/balanza.svg';

  }

  actualizar(estado) {
    if (estado.fuerza != 0) {
      this.fuerza = estado.fuerza;
      this.estado = "activo";
    } else {
      this.fuerza = 0;
      this.estado = "inactivo";
    }
  }

  dibujar(ctx) {
    ctx.drawImage(this.balanza, this.x, this.y, this.balanza.width * this.scale, this.balanza.height * this.scale);
  }

  getResultado() {
    return { balanza: ["Balanza: " + this.fuerza.toFixed(2) + " Kg."] };
  }
}
class Toalla extends AbstractTool {

  constructor() {
    super();
    this.addon = true;
    this.tipo = "Toalla";
    this.icon = "balanza.png";
    this.altura = 5;
    this.scale = 0.5;
    this.x = 152;
    this.y = 265;
    this.description = "Poner la toalla encima de la balanza.";

    //this.toalla = new Image();
    //this.toalla.src = 'img/balanzatoalla.svg';

  }

  action(maquina){
    if(maquina.herramienta.tipo == "Balanza"){
      let balanza = maquina.herramienta
      if (!balanza.toalla){
        balanza.balanza = new Image();
        balanza.balanza.src = 'img/balanzatoalla.svg';
        balanza.toalla = true;
      }
      else{
        balanza.balanza = new Image();
        balanza.balanza.src = 'img/balanza.svg';
        balanza.toalla = false;
      }
      
      maquina.actualizar();
      console.log("balanza: ",balanza);
    }
  }
  actualizar(ctx){
    //nada
  }
  dibujar(ctx) {
   //nada
  }

}

class Slab_20mm extends AbstractTool {
  constructor() {
    super();
    this.tipo = "Slab20";
    this.icon = "slabs.png";
    this.estado = "inactivo";
    this.fuerza = 0;
    this.description = "Estos son unos slabs.";
    this.altura = 2.0;

    this.scale = 0.5;
    this.x = 152;
    this.y = 260;

    this.slabs = new Image();
    this.slabs.src = 'img/slab20.svg';

  }

  actualizar(estado) {
    // nada
  }

  dibujar(ctx) {
    ctx.drawImage(this.slabs, this.x, this.y, this.slabs.width * this.scale, this.slabs.height * this.scale);
  }

  getResultado() {
    return { slab20: ["Altura Slabs: " + this.getAltura() * 10 + " mm."] };
  }
}
class Slab_45mm extends AbstractTool {
  constructor() {
    super();
    this.tipo = "Slab45";
    this.icon = "slabs.png";
    this.altura = 4.5;

    // pasar parametros a vista?
    this.scale = 0.5;
    this.x = 152;
    this.y = 260;

    this.slabs = new Image();
    //nuevo sprite aca
    this.slabs.src = 'img/slab45.svg';

  }

  actualizar(estado) {
    // nada
  }

  dibujar(ctx) {
    ctx.drawImage(this.slabs, this.x, this.y, this.slabs.width * this.scale, this.slabs.height * this.scale);
  }

  getResultado() {
    return { slab45: ["Altura Slabs: " + this.getAltura() * 10 + " mm."] };
  }
}

class Slab_70mm extends AbstractTool {
  constructor() {
    super();
    this.tipo = "Slab70";
    this.icon = "slabs.png";
    this.altura = 7.0;

    // pasar parametros a vista?
    this.scale = 0.5;
    this.x = 152;
    this.y = 250;

    this.slabs = new Image();
    //nuevo sprite aca
    this.slabs.src = 'img/slab70.svg';

  }

  actualizar(estado) {
    // nada
  }

  dibujar(ctx) {
    ctx.drawImage(this.slabs, this.x, this.y, this.slabs.width * this.scale, this.slabs.height * this.scale);
  }

  getResultado() {
    return { slab70: ["Altura Slabs: " + this.getAltura() * 10 + " mm."] };
  }
}

class CamaraIonizacion extends AbstractTool {
  constructor() {
    super();
    this.tipo = "camIonizacion";
    this.icon = "ionizador.png";
    this.estado = "inactivo";
    this.description = "Esta es una camara de ionizacion.";
    this.kilovolt = 0;
    this.miliamperios = 0;
    this.modo = null;
    this.filtro = null;
    this.anodo = null;
  }

  actualizar(estado) {
    console.log(estado);
    console.log("haha Camara de Ionizacion go brrrr");
    if (estado.activo == true) {
      this.kilovolt = estado.kilovolt;
      this.miliamperios = estado.miliamperios;
      this.modo = estado.modo;
      this.filtro = estado.filtro;
      this.anodo = estado.anodo;
      console.log("haha Camara de Ionizacion go brrrr");
    }
  }

  dibujar(ctx) {
    // var img = obtener imagen de la herramienta
    // ctx.drawImage(img, 10, 10);
    //ctx.beginPath();
    //ctx.arc(95, 50, 20, 0, 2 * Math.PI);
    //ctx.stroke();
    //ctx.fillStyle = "yellow";
    //ctx.fill();
  }
  getResultado() {
    return {
      camara: [
        "Camara de Ionización",
        "\t\t\tKV: " + this.kilovolt,
        "\t\t\tmAs: " + this.miliamperios,
        "\t\t\tmodo: " + this.modo,
        "\t\t\tfiltro: " + this.filtro,
        "\t\t\tanodo: " + this.anodo,
      ]
    }
  }
}

class Electrometro extends AbstractTool {
  constructor() {
    super();
    this.tipo = "electrometro";
    this.icon = "box.png";
    this.estado = "inactivo";
    this.description = "Este es un electrometro.";
  }

  actualizar(estado) {
    // TODO
    console.log("haha Electrometro go brrrr");
  }

  dibujar(ctx) {

  }
}

class Termometro extends AbstractTool {
  constructor() {
    super();
    this.tipo = "termometro";
    this.icon = "thermometer.png";
    this.estado = "inactivo";
    this.description = "Este es un termometro.";
    this.termometro = new Image();
    this.termometro.src = 'img/thermometer.svg';
    this.x = 10;
    this.y = 10;
    this.scale = 0.18;
    this.temperatura = 22;
  }

  actualizar(estado) {
    this.temperatura = estado.temperatura;
  }

  dibujar(ctx) {
    ctx.drawImage(this.termometro, this.x, this.y, this.termometro.width * this.scale, this.termometro.height * this.scale);
  }

  getResultado() {
    return { termometro: ["Temperatura: " + this.temperatura + " °C"] };
  }

}

class Barometro extends AbstractTool {
  constructor() {
    super();
    this.tipo = "barometro";
    this.icon = "barometer.png";
    this.estado = "inactivo";
    this.description = "Este es un barometro.";
    this.barometro = new Image();
    this.barometro.src = "img/barometer.svg";
    this.scale = 0.15;
    this.x = 33;
    this.y = 13;
    this.presion = 1013;
  }

  actualizar(estado) {
    this.presion = estado.presion;
  }

  dibujar(ctx) {
    ctx.drawImage(this.barometro, this.x, this.y, this.barometro.width * this.scale, this.barometro.height * this.scale);
  }

  getResultado() {
    return { barometro: ["Presión: " + this.presion + " hPa"] };
  }
}

class CintaMetrica extends AbstractTool {
  constructor() {
    super();
    this.tipo = "cinta";
    this.icon = "tape.png";
    this.estado = "inactivo";
    this.description = "Esta es una cinta.";
  }

  actualizar(estado) {
    // TODO
    console.log("haha CintaMetrica go brrrr");
  }

  dibujar(ctx) {
  }
}

export {
  BaseNula,
  Balanza,
  Toalla,
  Barometro,
  CamaraIonizacion,
  CintaMetrica,
  Electrometro,
  Termometro,
  Slab_20mm,
  Slab_45mm,
  Slab_70mm
};
