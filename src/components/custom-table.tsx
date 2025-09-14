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
		selectedArtworks,
		onPageChange,
		onSelectRows,
		setInputRows,
		handleIconClick,
		handleSelectionChange,
	} = useDataTable();

	return (
		<div className="card w-full">
			<SelectRowByInput
				op={op}
				onSelectRows={onSelectRows}
				inputRows={inputRows}
				setInputRows={setInputRows}
				handleIconClick={handleIconClick}
			/>
			
			<div className="overflow-x-auto">
				<DataTable
					value={artworks}
					className="datatable-responsive"
					selection={selectedArtworks}
					onSelectionChange={(e) => {
						handleSelectionChange(e.value as Artist[] | null);
					}}
					scrollable
					scrollHeight="530px"
				>
					<Column
						selectionMode="multiple"
						headerStyle={{ width: "3rem" }}
						style={{ width: "3rem" }}
					/>
					
					<Column 
						field="title" 
						header="Title" 
						style={{ minWidth: "150px" }}
					/>
					
					<Column
						field="origin"
						header="Place Of Origin"
						style={{ 
							whiteSpace: "nowrap",
							minWidth: "120px"
						}}
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
							minWidth: "150px"
						}}
					/>
					
					<Column 
						field="inscriptions" 
						header="Inscriptions" 
						style={{ minWidth: "120px" }}
					/>
					
					<Column
						field="start_date"
						header="Start Date"
						style={{ 
							whiteSpace: "nowrap",
							minWidth: "100px"
						}}
					/>
					
					<Column
						field="end_date"
						header="End Date"
						style={{ 
							whiteSpace: "nowrap",
							minWidth: "100px"
						}}
					/>
					{loading && (
						<tbody>
							<tr>
								<td
									colSpan={7}
									style={{ textAlign: "center", padding: "2rem" }}
								>
									Loading artworks...
								</td>
							</tr>
						</tbody>
					)}
				</DataTable>
			</div>
			
			<Paginator
				first={(page - 1) * 12}
				rows={12}
				totalRecords={totalPages}
				onPageChange={onPageChange}
				className="mt-3"
			/>
		</div>
	);
};
