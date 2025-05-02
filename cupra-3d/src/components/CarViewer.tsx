import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function CarViewer() {
	// Actualizar la ruta para que coincida con el nombre real del archivo extraído del ZIP
	const model = useGLTF("/assets/scene.gltf");

	// Añadir log para depuración
	useEffect(() => {
		console.log("Modelo cargado:", model);
	}, [model]);

	return (
		<primitive
			object={model.scene}
			scale={0.5} // Aumentado la escala a 0.5 para que el modelo ocupe más espacio en la ventana
			position={[0, -0.25, 0]} // Ajustado la posición en Y para centrarlo mejor
			rotation={[0, Math.PI / 2, 0]} // Modificado la rotación para mejor visualización
		/>
	);
}
