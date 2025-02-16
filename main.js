class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.puntosElement = document.getElementById("puntos");
    this.reiniciar = document.getElementById("boton-reinicio");
    this.btnIzquierda = document.getElementById("boton-izquierda");
    this.btnArriba = document.getElementById("boton-arriba");
    this.btnDerecha = document.getElementById("boton-derecha");


    this.personaje = null;
    this.personajeGolpeado = null;
    this.golpe = null;
    this.monedas = [];
    this.skulls = [];
    this.puntuacion = 0;
    this.sonido = new Audio("./public/sound/punch-sound.mp3");

    this.crearEscenario();
    this.agregarEventos();
    // this.reiniciarJuego();
  }

  crearEscenario() {
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);
    this.golpe = new Golpe();
    this.container.appendChild(this.golpe.element);

    for (let i = 0; i < 5; i++) {
      const moneda = new Moneda();
      this.monedas.push(moneda);
      this.container.appendChild(moneda.element);
      const skull = new Skull();
      this.skulls.push(skull);
      this.container.appendChild(skull.element);
    }
  }

  agregarEventos() {
    window.addEventListener("keydown", (evento) => {
      if (((evento.key === "ArrowUp") && this.personaje.y === 0)) {
        // this.personaje.caer(evento);
        this.golpe.caer(evento);
        if (window.addEventListener("keyup", (evento))) {
          // this.personaje.caer(evento);
          this.golpe.caer(evento);
        }
      }
      this.personaje.mover(evento);
      this.golpe.mover(evento);
      this.checkColisiones();
    })
    this.btnIzquierda.addEventListener("click", () => {
      this.personaje.mover({ key: "ArrowLeft" });
      this.golpe.mover({ key: "ArrowLeft" });
    })
    this.btnArriba.addEventListener("click", () => {
      // this.personaje.mover({ key: "ArrowUp" });
      this.golpe.mover({ key: "ArrowUp" });
    })
    this.btnDerecha.addEventListener("click", () => {
      this.personaje.mover({ key: "ArrowRight" });
      this.golpe.mover({ key: "ArrowRight" });
    })
  }

  checkColisiones() {
    setInterval(() => {
      this.monedas.forEach((moneda, index) => {
        if (this.golpe.colisionaCon(moneda)) {
          //efecto de salir de la pantalla
          moneda.salirPantalla(() => {
            this.container.removeChild(moneda.element);
            this.monedas.splice(index, 1);
            this.actualizarPuntuacion(10);
            this.sonido.play();
          });

        }
      });
      this.skulls.forEach((skull, index) => {
        if (this.golpe.colisionaCon(skull)) {
          this.container.removeChild(skull.element);
          this.skulls.splice(index, 1);
          this.actualizarPuntuacion(-10);
        }
      });
    }, 100);
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }

  reiniciarJuego() {
    this.reiniciar.addEventListener("click", () => {
      this.reiniciarJuego();
    });
    this.crearEscenario();
  }
}

class Personaje {
  constructor() {
    this.x = 50;
    this.y = 320;
    this.width = 50;
    this.height = 50;
    this.velocidad = 10;
    this.saltando = false;

    this.element = document.createElement("div");
    this.element.classList.add("personaje");

    this.actualizarPosicion();
  }

  mover(evento) {
    if (evento.key === "ArrowRight") {
      this.x += this.velocidad;
    } else if (evento.key === "ArrowLeft") {
      this.x -= this.velocidad;
      if (this.x <= 0) {
        this.x = 20;
      }
    }
    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

class Golpe {
  constructor() {
    this.x = 80;
    this.y = 290;
    this.width = 50;
    this.height = 50;
    this.velocidad = 10;
    this.saltando = false;

    this.element = document.createElement("div");
    this.element.classList.add("golpe");

    this.actualizarPosicion();
  }

  mover(evento) {
    if (evento.key === "ArrowRight") {
      this.x += this.velocidad;
    } else if (evento.key === "ArrowLeft") {
      this.x -= this.velocidad;
      if (this.x <= 0) {
        this.x = 20;
      }
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar();
    }
    this.actualizarPosicion();
  }

  saltar() {
    this.saltando = true;
    let alturaMaxima = this.y - 100;

    const salto = setInterval(() => {
      if (this.saltando && this.y > alturaMaxima) {
        this.y -= 10;
      } else if (this.y <= 0) {
        this.y = 0;
        this.caer();
      } else {
        clearInterval(salto);
        this.caer();
      }
      this.actualizarPosicion();
    }, 20);
  }

  caer() {
    this.saltando = false;
    const gravedad = setInterval(() => {
      if (!this.saltando && this.y < 300) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        !this.saltando
      }
      this.actualizarPosicion();
    }, 20);
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

class Moneda {
  constructor() {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 30;
    this.height = 30;
    this.element = document.createElement("div");
    this.element.classList.add("moneda");
    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  salirPantalla(callback) {
    let salir = setInterval(() => {
      this.y -= 10;
      this.element.style.top = `${this.y}px`;

      if (this.y < -30) {
        clearInterval(salir);
        callback();
      }
    }, 20);
  }

}

class Skull {
  constructor() {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 30;
    this.height = 30;
    this.element = document.createElement("div");
    this.element.classList.add("skull");
    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const juego = new Game();