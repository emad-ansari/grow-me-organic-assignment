import type { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = "https://api.artic.edu/api/v1/artworks";

export interface Artist {
	id: string;
	title: string;
	origin: string;
	artist_display: string;
	inscriptions: string | null;
	start_date: string;
	end_date: string;
}

export const useDataTable = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [loading, setLoading] = useState<boolean>(false);
	const [artworks, setArtworks] = useState<Artist[]>([]);
	const [selectedArtworks, setSelectedArtworks] = useState<Artist[] | null>(null);
	const [totalPages, setTotalPages] = useState<number>(15);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowInput, setRowInput] = useState("");
	const overlayRef = useRef<OverlayPanel>(null);

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [pendingSelections, setPendingSelections] = useState<number>(0);

	useEffect(() => {
		searchParams.set("page", "1");
		setSearchParams(searchParams);
		loadArtworks();
	}, []);

	useEffect(() => {
		searchParams.set("page", String(currentPage));
		setSearchParams(searchParams);
		loadArtworks();
	}, [currentPage]);

	useEffect(() => {
		if (artworks.length === 0) {
			setSelectedArtworks([]);
			return;
		}
		const currentPageSelected = artworks.filter((artwork) => selectedIds.has(artwork.id));
		setSelectedArtworks(currentPageSelected);
	}, [artworks, selectedIds]);

	useEffect(() => {
		if (pendingSelections > 0 && artworks.length > 0) {
			const newSelectedIds = new Set(selectedIds);
			let selectedCount = 0;
			
			for (const artwork of artworks) {
				if (!newSelectedIds.has(artwork.id) && selectedCount < pendingSelections) {
					newSelectedIds.add(artwork.id);
					selectedCount++;
				}
			}
			
			setSelectedIds(newSelectedIds);
			setPendingSelections(pendingSelections - selectedCount);
		}
	}, [artworks, pendingSelections]);

	const handlePageChange = (e: any) => {
		const newPage = e.page + 1;
		setCurrentPage(newPage);
	};

	const togglePanel = (event: React.MouseEvent<HTMLSpanElement>) => {
		overlayRef.current?.toggle(event);
	};

	const selectMultipleRows = () => {
		overlayRef.current?.hide();
		const numRows = Number(rowInput);
		
		if (numRows <= 0) return;
		
		const newSelectedIds = new Set(selectedIds);
		let selectedCount = 0;
		
		for (const artwork of artworks) {
			if (!newSelectedIds.has(artwork.id) && selectedCount < numRows) {
				newSelectedIds.add(artwork.id);
				selectedCount++;
			}
		}
		
		setSelectedIds(newSelectedIds);
		
		const stillNeeded = numRows - selectedCount;
		if (stillNeeded > 0) {
			setPendingSelections(stillNeeded);
		} else {
			setPendingSelections(0);
		}
		
		setRowInput("");
	};

	const handleSelectionChange = (selectedArtworks: Artist[] | null) => {
		setPendingSelections(0);
		
		const newSelectedIds = new Set(selectedIds);
		
		artworks.forEach(artwork => {
			newSelectedIds.delete(artwork.id);
		});
		
		if (selectedArtworks) {
			selectedArtworks.forEach(artwork => {
				newSelectedIds.add(artwork.id);
			});
		}
		
		setSelectedIds(newSelectedIds);
	};

	const loadArtworks = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}?page=${currentPage}`);
			
			if (!response.ok) {
				throw new Error("Couldn't load the artworks");
			}

			const result = await response.json();
			const { data, pagination } = result;

			setTotalPages(pagination?.total_pages || 1);
			
			const cleanArtworks: Artist[] = data.map((item: any) => ({
				id: item.id,
				title: item.title || "Untitled",
				origin: item.place_of_origin || "Unknown",
				artist_display: item.artist_display || "Unknown Artist",
				inscriptions: item.inscriptions,
				start_date: item.date_start || "",
				end_date: item.date_end || "",
			}));

			setArtworks(cleanArtworks);
		} catch (error) {
			console.error("Failed to load artworks:", error);
		} finally {
			setLoading(false);
		}
	};

	return {
		artworks,
		page: currentPage,
		setPage: setCurrentPage,
		onPageChange: handlePageChange,
		onSelectRows: selectMultipleRows,
		handleIconClick: togglePanel,
		inputRows: rowInput,
		setInputRows: setRowInput,
		totalPages,
		selectedArtworks,
		handleSelectionChange,
		op: overlayRef,
		loading,
		globalSelectedIds: selectedIds,
		remainingRowsToSelect: pendingSelections,
	};
};
