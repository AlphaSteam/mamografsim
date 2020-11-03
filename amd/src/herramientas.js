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

  dibujar_resultado() {
    throw new TypeError("Do not call abstract method dibujar_resultados from child");
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

  dibujar_resultado(ctx) {  
    ctx.font = "28px Arial";
    ctx.fillText("Balanza: " + this.fuerza.toFixed(2) + " Kg.", 10, 80);
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
    this.y = 265;

    this.slabs = new Image();
    //nuevo sprite aca
    this.slabs.src = 'img/balanza.svg';

  }

  actualizar(estado){
    // nada
  }

  dibujar(ctx) {
    // ctx.drawImage(this.slabs, this.x, this.y, this.slabs.width * this.scale, this.slabs.height * this.scale);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.x,
      this.y,
      this.slabs.width * this.scale,
      this.slabs.height * this.scale
    );

  }

  dibujar_resultado(ctx) {
    ctx.font = "28px Arial";
    ctx.fillText("Altura Slabs: " + this.getAltura()  * 10 + " mm.", 10, 80);
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
    this.y = 265;

    this.slabs = new Image();
    //nuevo sprite aca
    this.slabs.src = 'img/balanza.svg';

  }

  actualizar(estado){
    // nada
  }

  dibujar(ctx) {
    // ctx.drawImage(this.slabs, this.x, this.y, this.slabs.width * this.scale, this.slabs.height * this.scale);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.x,
      this.y,
      this.slabs.width * this.scale,
      this.slabs.height * this.scale
    );

  }

  dibujar_resultado(ctx) {
    ctx.font = "28px Arial";
    ctx.fillText("Altura Slabs: " + this.getAltura() * 10 + " mm.", 10, 80);
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
    this.y = 265;

    this.slabs = new Image();
    //nuevo sprite aca
    this.slabs.src = 'img/balanza.svg';

  }

  actualizar(estado){
    // nada
  }

  dibujar(ctx) {
    // ctx.drawImage(this.slabs, this.x, this.y, this.slabs.width * this.scale, this.slabs.height * this.scale);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.x,
      this.y,
      this.slabs.width * this.scale,
      this.slabs.height * this.scale
    );

  }

  dibujar_resultado(ctx) {
    ctx.font = "28px Arial";
    ctx.fillText("Altura Slabs: " + this.getAltura() * 10 + " mm.", 10, 80);
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
    if (estado.activo == true){
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

  dibujar_resultado(ctx) {
    ctx.font = "14px Arial";
    ctx.fillText("KV: " + this.kilovolt , 10, 150);
    ctx.font = "14px Arial";
    ctx.fillText("mAs: " + this.miliamperios , 10, 170);
    ctx.font = "14px Arial";
    ctx.fillText("modo: " + this.modo , 10, 190);
    ctx.font = "14px Arial";
    ctx.fillText("filtro: " + this.filtro , 10, 210);
    ctx.font = "14px Arial";
    ctx.fillText("anodo: " + this.anodo , 10, 230);
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

  dibujar_resultado(ctx) {

  }
}

class Termometro extends AbstractTool {
  constructor() {
    super();
    this.tipo = "termometro";
    this.image = new Image();
    this.image.src = "icons/thermometer.png";
    this.icon = "thermometer.png";
    this.estado = "inactivo";
    this.description = "Este es un termometro.";
  }

  actualizar(estado) {
    // TODO
    console.log("haha Termometro go brrrr");
  }

  dibujar(ctx) {
  
  }

  dibujar_resultado(ctx) {

  }
}

class Barometro extends AbstractTool {
  constructor() {
    super();
    this.tipo = "barometro";
    this.icon = "barometer.png";
    this.estado = "inactivo";
    this.description = "Este es un barometro.";
  }

  actualizar(estado) {
    // TODO
    console.log("haha Barometro go brrrr");
  }

  dibujar(ctx) {
  
  }

  dibujar_resultado(ctx) {

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

  dibujar_resultado(ctx) {

  }
}

export {
  BaseNula,
  Balanza,
  Barometro,
  CamaraIonizacion,
  CintaMetrica,
  Electrometro,
  Termometro,
  Slab_20mm,
  Slab_45mm,
  Slab_70mm
};
