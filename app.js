new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },

        empezarPartida: function () {
            this.saludJugador=100;
            this.saludMonstruo=100;
            this.hayUnaPartidaEnJuego=true;
        },

        atacar: function () {
            let danioJugador= this.calcularHeridas(this.rangoAtaque);
            let danioMonstruo= this.ataqueDelMonstruo();
            this.saludMonstruo -= danioJugador;
            this.saludJugador -= danioMonstruo;
            
            //Hago los dos daños y después verifico si alguien ganó. En dicho caso, el metodo
            //verificarGanador() le va a asignar el 0 al perdedor.

            this.registrarEvento(`El jugador hizo ${danioJugador} puntos de daño`, true); //Registrar el evento sucedido, en caso de haber derrota no se va a llamar
            this.registrarEvento(`El monstruo hizo ${danioMonstruo} puntos de daño`, false);

            this.verificarGanador();

        },

        ataqueEspecial: function () {
            let danioJugador= this.calcularHeridas(this.rangoAtaqueEspecial);
            let danioMonstruo= this.ataqueDelMonstruo();
            this.saludMonstruo -= danioJugador;
            this.saludJugador -= danioMonstruo;

            this.registrarEvento(`El jugador hizo ${danioJugador} puntos de daño`, true); //Registrar el evento sucedido, en caso de haber derrota no se va a llamar
            this.registrarEvento(`El monstruo hizo ${danioMonstruo} puntos de daño`, false);
            this.verificarGanador();

        },

        curar: function () {
            if (this.saludJugador<90){
                this.saludJugador+=10;
            }
            else {this.saludJugador=100;}
            let danioMonstruo= this.ataqueDelMonstruo();
            this.saludJugador-= danioMonstruo;
            
            this.registrarEvento(`El jugador se curó 10 puntos de vida`, true); //Registrar el evento sucedido, en caso de haber derrota no se va a llamar
            this.registrarEvento(`El monstruo hizo ${danioMonstruo} puntos de daño`, false);

            this.verificarGanador();

            

            //En este caso si el monstruo me mata a pesar de curarme, va a pasar lo mismo que en los ataques,
            //se verifica el ganador y no llega a llamar a registrar evento
        },

        registrarEvento(evento, estadoJugador) {
            this.turnos.unshift({
                text: evento,
                isPlayer: estadoJugador,
            })
            
        },

        terminarPartida: function () {
            if (this.esJugador) {
                this.registrarEvento("Enhorabuena, has ganado esta emocionante batalla.",true);
                this.esJugador=false;
            } else {
               this.registrarEvento("Mala suerte. Inténtalo nuevamente",false);
            }

            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            return this.calcularHeridas(this.rangoAtaqueDelMonstruo);
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random()*rango[1])+1,rango[0]);
        },
        
        verificarGanador: function () {
            if (this.saludJugador<=0) {
                this.esJugador = false;
                this.saludJugador = 0;
                this.terminarPartida();
                //Acá llamamos a terminar y se acaba la ejecución. Ganó el monstruo
            } else if (this.saludMonstruo<= 0) {
                this.esJugador = true;
                this.saludMonstruo=0;
                this.terminarPartida();
                //Acá llamamos a terminar y se acaba la ejecución. Ganó el jugador
            } else {
                return;
            }
        },
        
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});