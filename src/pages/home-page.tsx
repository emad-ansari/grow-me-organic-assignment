import { CustomTable } from "../components/custom-table";
import { HeroSection } from "../components/hero-section";
export const HomePage = () => {
	return (
		<main className="flex flex-column align-items-center px-2 px-md-4 min-h-screen">
			<HeroSection />
			<div className="flex justify-content-center align-items-center px-2 px-md-4 py-2 w-full">
				<CustomTable />
			</div>
		</main>
	);
};
