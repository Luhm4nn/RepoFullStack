CREATE TABLE `tarifa` (
  `idTarifa` int NOT NULL AUTO_INCREMENT,
  `precio` decimal(5,2) NOT NULL,
  `descripcionTarifa` varchar(45) NOT NULL,
  `fechaDesde` date NOT NULL,
  PRIMARY KEY (`idTarifa`)
);
CREATE TABLE `sala` (
  `idSala` int NOT NULL AUTO_INCREMENT,
  `ubicacion` varchar(45) NOT NULL,
  `capacidad` int DEFAULT NULL,
  PRIMARY KEY (`idSala`)
);
CREATE TABLE `cliente` (
  `DNI` int NOT NULL,
  `nombreCliente` varchar(45) NOT NULL,
  `apellidoCliente` varchar(45) NOT NULL,
  `email` varchar(70) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
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
  CONSTRAINT `asiento_ibfk_1` FOREIGN KEY (`idTarifa`) REFERENCES `tarifa` (`idtarifa`),
  CONSTRAINT `asiento_ibfk_2` FOREIGN KEY (`idSala`) REFERENCES `sala` (`idSala`)
);

CREATE TABLE `funcion` (
  `idSala` int NOT NULL,
  `fechaHoraFuncion` datetime NOT NULL,
  `idPelicula` int NOT NULL,
  PRIMARY KEY (`idSala`,`fechaHoraFuncion`),
  CONSTRAINT `funcion_ibfk_1` FOREIGN KEY (`idPelicula`) REFERENCES `pelicula` (`idPelicula`),
  CONSTRAINT `funcion_ibfk_2` FOREIGN KEY (`idSala`) REFERENCES `sala` (`idSala`)
);
CREATE TABLE `reserva` (
  `idSala` int NOT NULL,
  `fechaHoraFuncion` datetime NOT NULL,
  `DNI` int NOT NULL,
  `fechaHoraReserva` datetime NOT NULL,
  `fechaHoraCancelacion` datetime DEFAULT NULL,
  `estado` varchar(45) NOT NULL,
  `total` decimal(7,2) NOT NULL,
  PRIMARY KEY (`idSala`,`fechaHoraFuncion`,`DNI`,`fechaHoraReserva`),
  CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`DNI`) REFERENCES `cliente` (`DNI`),
  CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`idSala`, `fechaHoraFuncion`) REFERENCES `funcion` (`idSala`, `fechaHoraFuncion`)
);
CREATE TABLE `asiento-reserva` (
  `idSala` int NOT NULL,
  `filaAsiento` varchar(2) NOT NULL,
  `nroAsiento` int NOT NULL,
  `fechaHoraFuncion` datetime NOT NULL,
  `DNI` int NOT NULL,
  `fechaHoraReserva` datetime NOT NULL,
  PRIMARY KEY (`idSala`,`filaAsiento`,`nroAsiento`,`fechaHoraFuncion`),
  CONSTRAINT `asiento-reserva_ibfk_1` FOREIGN KEY (`idSala`, `filaAsiento`, `nroAsiento`) REFERENCES `asiento` (`idSala`, `filaAsiento`, `nroAsiento`),
  CONSTRAINT `asiento-reserva_ibfk_2` FOREIGN KEY (`idSala`, `fechaHoraFuncion`, `DNI`, `fechaHoraReserva`) REFERENCES `reserva` (`idSala`, `fechaHoraFuncion`, `DNI`, `fechaHoraReserva`)
);


