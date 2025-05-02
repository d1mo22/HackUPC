import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import CarViewer from "./components/CarViewer";

function App() {
	return (
		<div className="w-full h-screen">
			<Canvas
				className="w-full h-full"
				camera={{ position: [0, 0.5, 3], fov: 60 }}
			>
				<ambientLight intensity={0.7} />
				<directionalLight position={[5, 5, 5]} intensity={1.2} />
				<Environment preset="sunset" />
				<CarViewer />
				<OrbitControls
					minDistance={2}
					maxDistance={8}
					enablePan={true}
					enableZoom={true}
				/>
			</Canvas>
		</div>
	);
}

export default App;
