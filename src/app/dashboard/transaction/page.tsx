/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import TransactionCard from "@/ui/TransactionCard";
import FormatRupiah from "@/utils/formatRupiah";
import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import {
	deleteTransaction,
	fetchTotalExpenseStat,
	fetchTransaction,
} from "@/services/Transaction";
import { Transaction } from "@/interfaces/IDashboard";
import { ModalProps } from "@/interfaces/IModal";
import Modal from "@/ui/Modal";

export default function TransactionPage() {
	const [search, setSearch] = useState("");
	const [transaction, setTransaction] = useState<Transaction[]>([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);
	const [stats, setStats] = useState({ total_expense: 0, count: 0 });
	const [modal, setModal] = useState<ModalProps | null>(null);

	const loadTransaction = async () => {
		try {
			const res = await fetchTransaction(page, limit, search);
			setTransaction(res.data);
			setTotalPages(res.pagination.totalPages);
		} catch (error) {
			if (error instanceof Error) {
				console.error({ message: error.message, type: "danger" });
			} else {
				console.error({ message: "Terjadi kesalahan", type: "danger" });
			}
		}
	};

	const loadStats = async () => {
		try {
			const res = await fetchTotalExpenseStat();
			setStats(res.data);
		} catch (error) {
			if (error instanceof Error) {
				console.error({ message: error.message, type: "danger" });
			} else {
				console.error({ message: "Terjadi kesalahan", type: "danger" });
			}
		}
	};

	useEffect(() => {
		loadStats();
		loadTransaction();
	}, [page, limit, search]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		setPage(1);
	};

	const handleDelete = async (id: number) => {
		setModal({
			type: "danger",
			message: "Apakah Kamu yakin ingin menghapus transaksi ini?",
			onOk: async () => {
				try {
					await deleteTransaction(id);
					setModal({
						type: "success",
						message: "Transaksi Berhasil Dihapus",
						onOk: () => setModal(null),
					});

					const res = await fetchTransaction(page, limit, search);
					setTransaction(res.data);
					setTotalPages(res.pagination.totalPages);
				} catch (error) {
					console.error(error);
					setModal({
						type: "danger",
						message: "Gagal menghapus transaksi",
						onOk: () => setModal(null),
					});
				}
			},
			onCancel: () => setModal(null),
		});
	};

	return (
		<div className="p-4 space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<TransactionCard
					title="Total Pengeluaran Hari Ini"
					value={FormatRupiah(stats.total_expense)}
				/>
				<TransactionCard
					title="Total Transaksi Hari Ini"
					value={stats.count}
				/>
			</div>
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
				<div className="relative w-full sm:max-w-xs">
					<FaSearch className="absolute top-5.5 left-3 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Cari transaksi..."
						value={search}
						onChange={handleSearch}
						className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
					/>
				</div>
				<Link
					href={"/dashboard/transaction/create"}
					className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 gap-2 flex items-center justify-center w-full sm:w-fit"
				>
					<FaPlus /> Buat Transaksi
				</Link>
			</div>

			<div className="bg-white rounded-lg shadow overflow-x-auto">
				<div className="min-w-full">
					<table className="w-full text-xs md:text-sm text-left">
						<thead>
							<tr className="text-gray-500 border-b">
								<th className="p-3 ">No</th>
								<th>Nama</th>
								<th>Waktu</th>
								<th>Jumlah</th>
								<th>Aksi</th>
							</tr>
						</thead>
						<tbody>
							{transaction.length > 0 ? (
								transaction.map((transaction, index) => {
									const tanggal = new Date(transaction.date).toLocaleDateString(
										"id-ID"
									);
									const no = (page - 1) * limit + index + 1;
									return (
										<tr
											key={transaction.id}
											className="border-t text-gray-700"
										>
											<td className="p-4">{no}</td>
											<td className="">
												<div className="font-semibold">
													{transaction.category.name}
												</div>
												<div className="text-xs">{transaction.note}</div>
											</td>
											<td className="">{tanggal}</td>
											<td
												className={`font-medium ${
													transaction.type === "expense"
														? "text-red-500"
														: "text-green-500"
												}`}
											>
												{transaction.type === "expense" ? "- " : "+ "}
												{FormatRupiah(transaction.amount)}
											</td>
											<td className="">
												<div className="flex items-center gap-4">
													<Link
														href={`/dashboard/transaction/edit/${transaction.id}`}
														className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
													>
														<FaEdit />
													</Link>
													<button
														onClick={() => handleDelete(transaction.id)}
														className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer"
													>
														<FaTrash />
													</button>
												</div>
											</td>
										</tr>
									);
								})
							) : (
								<tr className="border-t text-gray-700">
									<td
										className="p-4 text-center"
										colSpan={5}
									>
										Tidak ada transaksi
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<nav aria-label="Pagination">
				<div className="flex flex-wrap justify-end items-center gap-2 text-sm font-medium">
					{/* Tombol Previous */}
					<button
						onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
						disabled={page === 1}
						className="flex items-center justify-center px-3 h-9 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg
							className="w-3.5 h-3.5 mr-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M13 5H1m0 0 4 4M1 5l4-4"
							/>
						</svg>
						Previous
					</button>

					{/* Tombol Angka Halaman */}
					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i + 1}
							onClick={() => setPage(i + 1)}
							className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-colors focus:z-10 focus:ring-2 focus:ring-blue-400 ${
								page === i + 1
									? "bg-blue-600 border-blue-600 text-white cursor-default"
									: "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
							}`}
							aria-current={page === i + 1 ? "page" : undefined}
						>
							{i + 1}
						</button>
					))}

					{/* Tombol Next */}
					<button
						onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={page === totalPages}
						className="flex items-center justify-center px-3 h-9 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
						<svg
							className="w-3.5 h-3.5 ml-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 5h12m0 0L9 1m4 4L9 9"
							/>
						</svg>
					</button>
				</div>
			</nav>

			{modal && (
				<Modal
					type={modal.type}
					message={modal.message}
					onOk={modal.onOk}
					onCancel={modal.onCancel}
				/>
			)}
		</div>
	);
}
