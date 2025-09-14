import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { SelectRowByInput } from "./select-row-by-input";
import { useDataTable } from "../hooks/use-table";
import type { Artist } from "../hooks/use-table";

export const CustomTable = () => {
	const {
		op,
		page,
		artworks,
		loading,
		inputRows,
		totalPages,
		onPageChange,
		onSelectRows,
		handleIconClick,
		setInputRows,
		setSelectedArtworks,
		selectedArtworks,
	} = useDataTable();

	return (
		<div className="card">
			<SelectRowByInput
				op={op}
				onSelectRows={onSelectRows}
				inputRows={inputRows}
				setInputRows={setInputRows}
				handleIconClick={handleIconClick}
			/>
			<DataTable
				value={artworks}
				className="datatable-responsive"
				selection={selectedArtworks}
				onSelectionChange={(e) => {
					setSelectedArtworks(e.value as Artist[] | null);
				}}
			>
				<Column
					selectionMode="multiple"
					headerStyle={{ width: "3rem" }}
				/>
				<Column field="title" header="Title" />
				<Column
					field="origin"
					header="Place Of Origin"
					style={{ whiteSpace: "nowrap" }}
				/>
				<Column
					field="artist_display"
					header="Artist Display"
					body={(rowData: Artist) => (
						<span title={rowData.artist_display}>
							{rowData.artist_display}
						</span>
					)}
					style={{
						whiteSpace: "normal",
						wordBreak: "break-word",
					}}
				/>
				<Column field="inscriptions" header="Inscriptions" />
				<Column
					field="start_date"
					header="Start Date"
					style={{ whiteSpace: "nowrap" }}
				/>
				<Column
					field="end_date"
					header="End Date"
					style={{ whiteSpace: "nowrap" }}
				/>
				{loading && (
					<tbody>
						<tr>
							<td
								colSpan={7}
								style={{ textAlign: "center", padding: "2rem" }}
							>
								Loading...
							</td>
						</tr>
					</tbody>
				)}
			</DataTable>
			<Paginator
				first={(page - 1) * 12}
				rows={12}
				totalRecords={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
};
