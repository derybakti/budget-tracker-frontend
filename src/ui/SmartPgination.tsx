"use client";

import React from "react";

// Fungsi helper untuk membuat daftar halaman yang akan ditampilkan
const generatePagination = (currentPage: number, totalPages: number) => {
	// Jika total halaman kurang dari 7, tampilkan semua
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	// Jika halaman saat ini dekat dengan awal
	if (currentPage <= 4) {
		return [1, 2, 3, 4, 5, "...", totalPages];
	}

	// Jika halaman saat ini dekat dengan akhir
	if (currentPage >= totalPages - 3) {
		return [
			1,
			"...",
			totalPages - 4,
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		];
	}

	// Jika di tengah-tengah
	return [
		1,
		"...",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"...",
		totalPages,
	];
};

// Tipe props untuk komponen utama
interface SmartPaginationProps {
	page: number;
	totalPages: number;
	setPage: (page: number) => void;
}

export const SmartPagination: React.FC<SmartPaginationProps> = ({
	page,
	totalPages,
	setPage,
}) => {
	if (totalPages <= 1) return null; // Jangan tampilkan paginasi jika hanya ada 1 halaman

	const pages = generatePagination(page, totalPages);

	return (
		<nav aria-label="Pagination">
			<ul className="flex flex-wrap justify-end items-center gap-2 text-sm">
				{/* Tombol Previous */}
				<li>
					<button
						onClick={() => setPage(page - 1)}
						disabled={page === 1}
						className="flex items-center justify-center px-3 h-8 rounded-lg text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<svg
							className="w-4 h-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 6 10"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 1 1 5l4 4"
							/>
						</svg>
						<span className="sr-only">Previous</span>
					</button>
				</li>

				{/* Tombol Angka Halaman */}
				{pages.map((p, index) => (
					<li key={`${p}-${index}`}>
						{p === "..." ? (
							<span className="flex items-center justify-center px-3 h-8 text-gray-500">
								...
							</span>
						) : (
							<button
								onClick={() => setPage(p as number)}
								className={`flex items-center justify-center px-3 h-8 rounded-lg border transition-colors ${
									page === p
										? "bg-indigo-600 text-white border-indigo-600 cursor-default"
										: "bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
								}`}
								aria-current={page === p ? "page" : undefined}
							>
								{p}
							</button>
						)}
					</li>
				))}

				{/* Tombol Next */}
				<li>
					<button
						onClick={() => setPage(page + 1)}
						disabled={page === totalPages}
						className="flex items-center justify-center px-3 h-8 rounded-lg text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<span className="sr-only">Next</span>
						<svg
							className="w-4 h-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 6 10"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m1 9 4-4-4-4"
							/>
						</svg>
					</button>
				</li>
			</ul>
		</nav>
	);
};
