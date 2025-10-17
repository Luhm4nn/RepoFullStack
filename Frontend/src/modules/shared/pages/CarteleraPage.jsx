import { PeliculaCard } from "../../shared";

import { ClaquetaPersonaje } from "../../shared";
import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import { getPeliculasEnCartelera } from "../../user";


function CarteleraPage() {
	const [peliculas, setPeliculas] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getPeliculasEnCartelera().then((data) => {
			setPeliculas(data);
			setLoading(false);
		});
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center">
			<div className="w-full max-w-6xl mx-auto flex flex-col items-center py-20 px-4">
				<h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 text-center drop-shadow-2xl">
					¡Bienvenido a <span className="text-purple-400">Cutzy Cinema</span>!
				</h1>
				<p className="text-2xl md:text-3xl text-gray-200 mb-12 text-center max-w-3xl">
					Tu lugar para vivir la mejor experiencia de cine. Disfruta de los últimos estrenos, reserva tus asientos y sumérgete en la magia del séptimo arte.
				</p>
				<div className="w-full max-w-6xl mb-12 !scrollbar-hide">
					{loading ? (
						<div className="flex justify-center items-center h-154">
							<span className="text-white text-2xl">Cargando cartelera...</span>
						</div>
					) : (
						<Carousel slideInterval={3500} className="rounded-2xl shadow-2xl overflow-hidden h-154 !scrollbar-hide">
							{peliculas.length === 0 ? (
								<div className="flex flex-col items-center justify-center h-96 bg-slate-800">
									<span className="text-gray-400 text-2xl">No hay películas en cartelera.</span>
								</div>
							) : (
								peliculas.map((pelicula) => (
									<div key={pelicula.idPelicula} className="!scrollbar-hide relative h-154 flex items-center justify-center bg-black">
										
										<img
											src={pelicula.portada || "/placeholder.svg"}
											alt={pelicula.nombrePelicula}
											className="object-cover w-full h-full opacity-80 "
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-10">
											<h2 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
												{pelicula.nombrePelicula}
											</h2>
											<p className="text-gray-200 text-lg line-clamp-2 mb-4">{pelicula.sinopsis}</p>
											<span className="text-purple-300 text-lg font-semibold bg-purple-900/40 rounded px-3 py-1 inline-block mb-2">
												{pelicula.generoPelicula}
											</span>
										</div>
									</div>
								))
							)}
						</Carousel>
					)}
				</div>
				<div className="mb-12">
					<h3 className="text-3xl md:text-4xl font-semibold text-white mb-4 text-center">
						Descubre qué te espera en nuestra cartelera...
					</h3>
				</div>
				{/* Cartelera grid */}
				<div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
					{peliculas.length === 0 ? (
						<div className="col-span-full text-center text-gray-400">
							No hay películas en cartelera.
						</div>
					) : (
						peliculas.map((pelicula) => (
							<PeliculaCard key={pelicula.idPelicula} pelicula={pelicula} />
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default CarteleraPage;
