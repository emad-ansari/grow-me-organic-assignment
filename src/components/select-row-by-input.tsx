import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import type React from "react";
import type { RefObject, SetStateAction } from "react";

interface SelectRowByInputProps {
	op: RefObject<OverlayPanel | null>;
	inputRows: string;
	setInputRows: React.Dispatch<SetStateAction<string>>;
	onSelectRows: () => void;
	handleIconClick: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

export const SelectRowByInput: React.FC<SelectRowByInputProps> = ({
	op,
	inputRows,
	setInputRows,
	onSelectRows,
	handleIconClick,
}) => {
	return (
		<div className="flex align-items-center mb-2 flex-wrap gap-2">
			<span
				className="pi pi-chevron-down text-lg md:text-xl cursor-pointer"
				onClick={handleIconClick}
				aria-label="Open panel"
			/>
			<span className="font-bold text-base md:text-lg">
				Artworks Table
			</span>
			<OverlayPanel ref={op} dismissable>
				<div className="flex flex-column gap-3" style={{ minWidth: 220 }}>
					<InputText
						value={inputRows}
						onChange={(e) => setInputRows(e.target.value)}
						placeholder="select rows..."
						className="w-full"
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                onSelectRows()
                            }
                        }}
					/>
					<button
						type="button"
						className="p-button p-component align-item-center w-full"
						onClick={onSelectRows}
					>
						Save
					</button>
				</div>
			</OverlayPanel>
		</div>
	);
};
