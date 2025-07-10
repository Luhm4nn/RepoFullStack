CREATE TABLE `tarifa` (
  `idtarifa` int NOT NULL AUTO_INCREMENT,
  `precio` decimal(5,2) NOT NULL,
  `descripcionTarifa` varchar(45) NOT NULL,
  `fechaDesde` date NOT NULL,
  PRIMARY KEY (`idtarifa`)
);
CREATE TABLE `sala` (
  `idSala` int NOT NULL AUTO_INCREMENT,
  `Ubicacion` varchar(45) NOT NULL,
  `Capacidad` int DEFAULT NULL,
  PRIMARY KEY (`idSala`)
);
CREATE TABLE `cliente` (
  `DNI` int NOT NULL,
  `nombreCliente` varchar(45) NOT NULL,
  `apellidoCliente` varchar(45) NOT NULL,
  `email` varchar(70) NOT NULL,
  `telefono` int DEFAULT NULL,
  PRIMARY KEY (`DNI`)
);
CREATE TABLE `parametro` (
  `idParametro` int NOT NULL AUTO_INCREMENT,
  `descripcionParametro` varchar(45) NOT NULL,
  `valor` int NOT NULL,
  PRIMARY KEY (`idParametro`)
);
CREATE TABLE `pelicula` (
  `idPelicula` int NOT NULL AUTO_INCREMENT,
  `nombrePelicula` varchar(45) NOT NULL,
  `duracion` int NOT NULL,
  `generoPelicula` varchar(45) NOT NULL,
  `director` varchar(45) DEFAULT NULL,
  `fechaEstreno` date DEFAULT NULL,
  `sinopsis` varchar(500) DEFAULT NULL,
  `trailerURL` varchar(200) DEFAULT NULL,
  `portada` blob,
  `MPAA` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPelicula`)
);
CREATE TABLE `asiento` (
  `idSala` int NOT NULL,
  `filaAsiento` varchar(2) NOT NULL,
  `nroAsiento` int NOT NULL,
  `tipo` varchar(45) NOT NULL,
  `idTarifa` int DEFAULT NULL,
  PRIMARY KEY (`idSala`,`filaAsiento`,`nroAsiento`),
  KEY `idTarifa` (`idTarifa`),
  CONSTRAINT `asiento_ibfk_1` FOREIGN KEY (`idTarifa`) REFERENCES `tarifa` (`idtarifa`),
  CONSTRAINT `asiento_ibfk_2` FOREIGN KEY (`idSala`) REFERENCES `sala` (`idSala`)
);

CREATE TABLE `funcion` (
  `idSala` int NOT NULL,
  `fechaFuncion` date NOT NULL,
  `horaInicioFuncion` time NOT NULL,
  `idPelicula` int NOT NULL,
  PRIMARY KEY (`idSala`,`fechaFuncion`,`horaInicioFuncion`),
  KEY `idPelicula` (`idPelicula`),
  CONSTRAINT `funcion_ibfk_1` FOREIGN KEY (`idPelicula`) REFERENCES `pelicula` (`idPelicula`),
  CONSTRAINT `funcion_ibfk_2` FOREIGN KEY (`idSala`) REFERENCES `sala` (`idSala`)
);
CREATE TABLE `reserva` (
  `idSala` int NOT NULL,
  `fechaFuncion` date NOT NULL,
  `horaInicioFuncion` time NOT NULL,
  `DNI` int NOT NULL,
  `fechaHoraReserva` datetime NOT NULL,
  `fechaHoraCancelacion` datetime DEFAULT NULL,
  `estado` varchar(45) NOT NULL,
  `total` decimal(7,2) NOT NULL,
  PRIMARY KEY (`idSala`,`fechaFuncion`,`horaInicioFuncion`,`DNI`,`fechaHoraReserva`),
  KEY `DNI` (`DNI`),
  CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`DNI`) REFERENCES `cliente` (`DNI`),
  CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`idSala`, `fechaFuncion`, `horaInicioFuncion`) REFERENCES `funcion` (`idSala`, `fechaFuncion`, `horaInicioFuncion`)
);
CREATE TABLE `asiento-reserva` (
  `idSala` int NOT NULL,
  `filaAsiento` varchar(2) NOT NULL,
  `nroAsiento` int NOT NULL,
  `fechaFuncion` date NOT NULL,
  `horaInicioFuncion` time NOT NULL,
  `DNI` int NOT NULL,
  `fechaHoraReserva` datetime NOT NULL,
  PRIMARY KEY (`idSala`,`filaAsiento`,`nroAsiento`,`horaInicioFuncion`,`fechaFuncion`),
  KEY `idSala` (`idSala`,`fechaFuncion`,`horaInicioFuncion`,`DNI`,`fechaHoraReserva`),
  CONSTRAINT `asiento-reserva_ibfk_1` FOREIGN KEY (`idSala`, `filaAsiento`, `nroAsiento`) REFERENCES `asiento` (`idSala`, `filaAsiento`, `nroAsiento`),
  CONSTRAINT `asiento-reserva_ibfk_2` FOREIGN KEY (`idSala`, `fechaFuncion`, `horaInicioFuncion`, `DNI`, `fechaHoraReserva`) REFERENCES `reserva` (`idSala`, `fechaFuncion`, `horaInicioFuncion`, `DNI`, `fechaHoraReserva`)
);












