import { CustomTable } from "../components/custom-table";
import { HeroSection } from "../components/hero-section";
export const HomePage = () => {
	return (
		<main className="flex flex-column justify-content-between align-items-center px-4 ">
			<HeroSection />
			<div className="flex justify-content-between align-items-center px-4 py-2 ">
				<CustomTable />
			</div>
		</main>
	);
};
