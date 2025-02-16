class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.puntosElement = document.getElementById("puntos");
    this.vidasElement = document.getElementById("vidas");
    this.reiniciar = document.getElementById("boton-reinicio");
    this.btnIzquierda = document.getElementById("boton-izquierda");
    this.btnArriba = document.getElementById("boton-arriba");
    this.btnDerecha = document.getElementById("boton-derecha");

    this.personaje = null;
    this.personajeGolpeado = null;
    this.golpe = null;
    this.secundarios = [];
    this.amigos = [];
    this.enemigos = [];
    this.puntuacion = 0;
    this.vida = 3;
    this.sonidoPunch = new Audio("../../public/sound/punch.mp3");
    this.sonidoCancion = new Audio("../../public/sound/cancion.mp3");

    this.crearEscenario();
    this.agregarEventos();
    this.reiniciarJuego();
  }

  crearEscenario() {
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);
    this.golpe = new Golpe();
    this.container.appendChild(this.golpe.element);

    for (let i = 0; i < 5; i++) {
      const amigo = new Amigo();
      this.secundarios.push(amigo);
      this.container.appendChild(amigo.element);
      const enemigo = new Enemigo();
      this.secundarios.push(enemigo);
      this.container.appendChild(enemigo.element);
    }
    this.sonidoCancion.play();
  }

  agregarEventos() {
    window.addEventListener("keydown", (evento) => {
      if (((evento.key === "ArrowUp") && this.personaje.y === 0)) {
        this.golpe.caer(evento);
        if (window.addEventListener("keyup", (evento))) {
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
      this.golpe.mover({ key: "ArrowUp" });
    })
    this.btnDerecha.addEventListener("click", () => {
      this.personaje.mover({ key: "ArrowRight" });
      this.golpe.mover({ key: "ArrowRight" });
    })
  }

  checkColisiones() {
    setInterval(() => {
      this.secundarios.forEach((secundario, index) => {
        if (this.golpe.colisionaCon(secundario)) {
          secundario.salirPantalla(() => {
            this.container.removeChild(secundario.element);
            this.secundarios.splice(index, 1);
            if (secundario instanceof Enemigo) {    //aca puedo diferenciar objetos de diferentes clases
              this.actualizarPuntuacion(10);
            } else {
              this.actualizarPuntuacion(-10);
              this.actualizarVida(-1);
            }
            this.sonidoPunch.play();
          });
        }
      });
    }, 100);
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
    if (this.puntuacion >= 50) {
      this.ganarJuego();
    }
  }
  actualizarVida(vidas) {
    this.vida += vidas;
    this.vidasElement.textContent = `Vidas: ${this.vida}`;
    if (this.vida <= 0) {
      this.perderJuego();
    }
  }

  ganarJuego() {
      this.container.innerHTML = "";
      const ganaste = document.createElement("img");
      ganaste.classList.add("mensajeGanar");
      this.container.appendChild(ganaste);
  }

  perderJuego() {
    this.container.innerHTML = "";
      const perdiste = document.createElement("img");
      perdiste.classList.add("mensajePerder");
      this.container.appendChild(perdiste);
}

  reiniciarJuego() {
    this.reiniciar.addEventListener("click", () => {
      this.puntuacion = 0;
      this.vida = 3;
      this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
      this.vidasElement.textContent = `Vidas: ${this.vida}`;
      this.container.innerHTML = ""; // Para que no se repitan los elementos
      this.secundarios = [];
      this.crearEscenario();
    });
  }
}

class Principal {
  constructor(x, y, width, height, velocidad) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocidad = velocidad;
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

class Personaje extends Principal {
  constructor() {
    super(5, 320, 50, 50, 10);
    this.element = document.createElement("div");
    this.element.classList.add("personaje");
    this.actualizarPosicion();
  }

  
  mover(evento) {
    if (evento.key === "ArrowRight") {
      this.x += this.velocidad;
      if (this.x > 930) {
        this.x = 930;
        this.actualizarPosicion();
        3
      }
    } else if (evento.key === "ArrowLeft") {
      this.x -= this.velocidad;
      if (this.x < 5) {
        this.x = 5;
        this.actualizarPosicion();
      }
    }
    this.actualizarPosicion();
  }

}

class Golpe extends Principal {
  constructor() {
    super(35, 290, 50, 50, 10);
    this.golpeando = false;
    this.element = document.createElement("div");
    this.element.classList.add("golpe");

    this.actualizarPosicion();
  }

  mover(evento) {
    if (evento.key === "ArrowRight") {
      this.x += this.velocidad;
      if (this.x > 960) {
        this.x = 960;
        this.actualizarPosicion();
      }
    } else if (evento.key === "ArrowLeft") {
      this.x -= this.velocidad;
      if (this.x < 35) {
        this.x = 35;
        this.actualizarPosicion();
      }
    } else if (evento.key === "ArrowUp" && !this.golpeando) {
      this.golpear();
    }
    this.actualizarPosicion();
  }

  golpear() {
    this.golpeando = true;
    let alturaMaxima = this.y - 100;

    const golpePunch = setInterval(() => {
      if (this.golpeando && this.y > alturaMaxima) {
        this.y -= 10;
      } else if (this.y <= 0) {
        this.y = 0;
        this.caer();
      } else {
        clearInterval(golpePunch);
        this.caer();
      }
      this.actualizarPosicion();
    }, 20);
  }

  caer() {
    this.golpeando = false;
    const gravedad = setInterval(() => {
      if (!this.golpeando && this.y < 300) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        !this.golpeando
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

class Secundario {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static posicionRandomX() {
    if (window.innerWidth > 719) {
      return Math.random() * 900 + 50;
    } else {
      return Math.random() * 200 + 30;
    }
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

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

}

class Amigo extends Secundario {
  constructor() {
    super(Secundario.posicionRandomX(), Math.random() * 300 + 30, 30, 30);
    this.element = document.createElement("div");
    this.element.classList.add("amigo");
    this.actualizarPosicion();
  }

}

class Enemigo extends Secundario {
  constructor() {
    super(Secundario.posicionRandomX(), Math.random() * 300 + 30, 30, 30);
    this.element = document.createElement("div");
    this.element.classList.add("enemigo");
    this.actualizarPosicion();
  }
}

const juego = new Game();