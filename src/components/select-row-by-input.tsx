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
		<div
			style={{
				display: "flex",
				alignItems: "center",
				marginBottom: 8,
			}}
		>
			<span
				className="pi pi-chevron-down"
				style={{ fontSize: 20, cursor: "pointer", marginRight: 8 }}
				onClick={handleIconClick}
				aria-label="Open panel"
			/>
			<span style={{ fontWeight: "bold", fontSize: 18 }}>
				Artworks Table
			</span>
			<OverlayPanel ref={op} dismissable>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 12,
						minWidth: 220,
					}}
				>
					<InputText
						value={inputRows}
						onChange={(e) => setInputRows(e.target.value)}
						placeholder="select rows..."
                        onKeyDown={(e) => {
                            if(e.key === "Enter") {
                                onSelectRows()
                            }
                        }}
					/>
					<button
						type="button"
						className="p-button p-component align-item-center"
						onClick={onSelectRows}
					>
						Save
					</button>
				</div>
			</OverlayPanel>
		</div>
	);
};
