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

	const [totalRowsToSelect, setTotalRowsToSelect] = useState<number>(0); 
	const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]); 

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

	
	useEffect(() => {
		if (artworks.length === 0 || totalRowsToSelect === 0) return;

		let alreadySelected = selectedRowIds.length;
		let toSelect = Math.min(
			totalRowsToSelect - alreadySelected,
			artworks.length
		);
		if (toSelect > 0) {
			const newSelectedIds = artworks
				.filter((a) => !selectedRowIds.includes(a.id))
				.slice(0, toSelect)
				.map((a) => a.id);
			setSelectedRowIds([...selectedRowIds, ...newSelectedIds]);
		}
	}, [artworks, totalRowsToSelect]);

	useEffect(() => {
		if (artworks.length === 0) {
			setSelectedArtworks([]);
			return;
		}
		const selected = artworks.filter((a) => selectedRowIds.includes(a.id));
		setSelectedArtworks(selected);
	}, [artworks, selectedRowIds]);

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
		setTotalRowsToSelect(rows);
		// Reset selection logic
		setSelectedRowIds([]);
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
		setSelectedArtworks,
		op,
		loading,
		totalRowsToSelect,
		selectedRowIds,
	};
};
