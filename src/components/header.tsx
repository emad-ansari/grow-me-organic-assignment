import { Button } from "primereact/button";

export const Header = () => {
	return (
		<header className="flex justify-content-between align-items-center px-2 px-md-4 py-2 shadow-2 w-full">
			{/* Logo + Title */}
			<div className="flex align-items-center gap-2">
				<h2 className="m-0 text-lg md:text-2xl">MyApp</h2>
			</div>

			{/* Navigation - Hidden on mobile, visible on md+ */}
			<nav className="hidden md:flex gap-4">
				<a href="#" className="no-underline text-700 hover:text-900">
					Home
				</a>
				<a href="#" className="no-underline text-700 hover:text-900">
					Products
				</a>
				<a href="#" className="no-underline text-700 hover:text-900">
					About
				</a>
			</nav>

			{/* Login Button - Responsive sizing */}
			<Button
				label="Login"
				icon="pi pi-sign-in"
				className="p-button-rounded p-button-info text-sm md:text-base"
				size="small"
			/>
		</header>
	);
};
