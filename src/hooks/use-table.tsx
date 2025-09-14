import type { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
const BASE_URL = "https://api.artic.edu/api/v1/artworks";

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
	const [selectedArtworks, setSelectedArtworks] = useState<Artist[] | null>(
		null
	);
    const [totalPages, setTotalPages] = useState<number>(15);
	const [page, setPage] = useState(1);
	const [inputRows, setInputRows] = useState("");
	const op = useRef<OverlayPanel>(null);

	// Global selection state that persists across pages
	const [globalSelectedIds, setGlobalSelectedIds] = useState<Set<string>>(new Set());
	
	// Track remaining rows to select across pages
	const [remainingRowsToSelect, setRemainingRowsToSelect] = useState<number>(0);

	useEffect(() => {
		searchParams.set("page", "1");
		setSearchParams(searchParams);
		fetchArtworks();
	}, []);

	useEffect(() => {
		searchParams.set("page", String(page));
		setSearchParams(searchParams);
		// fetch the new pages record over here.
		fetchArtworks();
	}, [page]);

	// Update selected artworks when artworks or global selection changes
	useEffect(() => {
		if (artworks.length === 0) {
			setSelectedArtworks([]);
			return;
		}
		const selected = artworks.filter((a) => globalSelectedIds.has(a.id));
		setSelectedArtworks(selected);
	}, [artworks, globalSelectedIds]);

	// Auto-select remaining rows when page changes and there are remaining rows to select
	useEffect(() => {
		if (remainingRowsToSelect > 0 && artworks.length > 0) {
			const newSelectedIds = new Set(globalSelectedIds);
			let selectedCount = 0;
			
			// Select remaining rows from current page
			for (const artwork of artworks) {
				if (!newSelectedIds.has(artwork.id) && selectedCount < remainingRowsToSelect) {
					newSelectedIds.add(artwork.id);
					selectedCount++;
				}
			}
			
			setGlobalSelectedIds(newSelectedIds);
			setRemainingRowsToSelect(remainingRowsToSelect - selectedCount);
		}
	}, [artworks, remainingRowsToSelect]);

	const onPageChange = (e: any) => {
		const newPage = e.page + 1;
		setPage(newPage);
	};

	const handleIconClick = (event: React.MouseEvent<HTMLSpanElement>) => {
		op.current?.toggle(event);
	};

	const onSelectRows = () => {
		op.current?.hide();
		const rows = Number(inputRows);
		if (rows > 0) {
			const newSelectedIds = new Set(globalSelectedIds);
			let selectedCount = 0;
			
			// Select rows from current page first
			for (const artwork of artworks) {
				if (!newSelectedIds.has(artwork.id) && selectedCount < rows) {
					newSelectedIds.add(artwork.id);
					selectedCount++;
				}
			}
			
			setGlobalSelectedIds(newSelectedIds);
			
			// Calculate remaining rows to select
			const remaining = rows - selectedCount;
			if (remaining > 0) {
				setRemainingRowsToSelect(remaining);
			} else {
				setRemainingRowsToSelect(0);
			}
		}
		setInputRows("");
	};

	// Handle individual row selection/deselection
	const handleSelectionChange = (selectedArtworks: Artist[] | null) => {
		// Reset remaining rows when user manually changes selection
		setRemainingRowsToSelect(0);
		
		if (!selectedArtworks) {
			// If null, deselect all current page items
			const newSelectedIds = new Set(globalSelectedIds);
			artworks.forEach(artwork => {
				newSelectedIds.delete(artwork.id);
			});
			setGlobalSelectedIds(newSelectedIds);
		} else {
			// Update selection for current page
			const newSelectedIds = new Set(globalSelectedIds);
			
			// Remove all current page items from selection
			artworks.forEach(artwork => {
				newSelectedIds.delete(artwork.id);
			});
			
			// Add newly selected items
			selectedArtworks.forEach(artwork => {
				newSelectedIds.add(artwork.id);
			});
			
			setGlobalSelectedIds(newSelectedIds);
		}
	};

	const fetchArtworks = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${BASE_URL}?page=${page}`);
			if (!res.ok) {
				throw new Error("Failed to fetch the data");
			}

			const { data, pagination } = await res.json();

			setTotalPages(pagination?.total_pages);
			// format the data over here.
			const formattedArtworks: Artist[] = data.map((art: any) => ({
				id: art.id,
				title: art.title,
				origin: art.place_of_origin,
				artist_display: art.artist_display,
				inscriptions: art.inscriptions,
				start_date: art.date_start,
				end_date: art.date_end,
			}));

			setArtworks(formattedArtworks);
		} catch (e) {
			console.log("Error occurred while data fetching: ", e);
		} finally {
			setLoading(false);
		}
	};

	return {
		artworks,
		page,
		setPage,
		onPageChange,
		onSelectRows,
		handleIconClick,
		inputRows,
		setInputRows,
		totalPages,
		selectedArtworks,
		handleSelectionChange,
		op,
		loading,
		globalSelectedIds,
		remainingRowsToSelect,
	};
};
