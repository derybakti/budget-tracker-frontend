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
	const [limit] = useState(6);
	const [totalPage, setTotalPage] = useState(1);
	const [stats, setStats] = useState({ total_expense: 0, count: 0 });
	const [modal, setModal] = useState<ModalProps | null>(null);

	const loadTransaction = async () => {
		try {
			const res = await fetchTransaction(page, limit, search);
			setTransaction(res.data);
			// if (res.pagination && typeof res.pagination.totalPages === "number") {
			// 	setTotalPage(res.pagination.totalPages);
			// }
			setTotalPage(res.pagination.totalPage);

			console.log(res);
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
			console.log(res.data);
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
					setTotalPage(res.pagination.totalPage);
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
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
				<TransactionCard
					title="Total Pengeluaran Hari Ini"
					value={FormatRupiah(stats.total_expense)}
				/>
				<TransactionCard
					title="Total Transaksi Hari Ini"
					value={stats.count}
				/>
			</div>
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl border border-gray-100">
				{/* Search Input Section */}
				<div className="relative w-full sm:max-w-md group">
					{/* Search Icon */}
					<div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
						<FaSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
					</div>

					{/* Input Field */}
					<input
						type="text"
						placeholder="Cari transaksi..."
						value={search}
						onChange={handleSearch}
						className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm
						focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
						hover:border-gray-300 transition-all duration-200
						placeholder:text-gray-400 text-gray-700"
					/>

					{/* Focus Ring Effect */}
					<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
				</div>

				{/* Action Button */}
				<Link
					href="/dashboard/transaction/create"
					className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 w-full sm:w-auto font-medium"
				>
					{/* Background Effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

					{/* Content */}
					<div className="relative z-10 flex items-center gap-3">
						<FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-200" />
						<span>Buat Transaksi</span>
					</div>

					{/* Shine Effect */}
					<div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
				</Link>
			</div>

			<div className="w-full">
				{/* Desktop Table View */}
				<div className="hidden md:block bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
					<div className="min-w-full">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
									<th className="p-6 font-semibold text-left text-xs uppercase tracking-wider">
										No
									</th>
									<th className="p-6 font-semibold text-left text-xs uppercase tracking-wider">
										Nama
									</th>
									<th className="p-6 font-semibold text-left text-xs uppercase tracking-wider">
										Waktu
									</th>
									<th className="p-6 font-semibold text-left text-xs uppercase tracking-wider">
										Jumlah
									</th>
									<th className="p-6 font-semibold text-left text-xs uppercase tracking-wider">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{transaction.length > 0 ? (
									transaction.map((transaction, index) => {
										const tanggal = new Date(
											transaction.date
										).toLocaleDateString("id-ID");
										const no = (page - 1) * limit + index + 1;
										return (
											<tr
												key={transaction.id}
												className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
											>
												<td className="p-6">
													<div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
														<span className="font-bold text-indigo-700 text-sm">
															{no}
														</span>
													</div>
												</td>
												<td className="p-6">
													<div className="space-y-1">
														<div className="font-semibold text-gray-900 text-base group-hover:text-indigo-700 transition-colors">
															{transaction.category.name}
														</div>
														<div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
															{transaction.note}
														</div>
													</div>
												</td>
												<td className="p-6">
													<div className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
														<svg
															className="w-4 h-4 mr-2"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<path
																fillRule="evenodd"
																d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
																clipRule="evenodd"
															/>
														</svg>
														{tanggal}
													</div>
												</td>
												<td className="p-6">
													<div
														className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-base ${
															transaction.type === "expense"
																? "bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-200"
																: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 border border-green-200"
														}`}
													>
														<span className="mr-1">
															{transaction.type === "expense" ? "−" : "+"}
														</span>
														{FormatRupiah(transaction.amount)}
													</div>
												</td>
												<td className="p-6">
													<div className="flex items-center gap-3">
														<Link
															href={`/dashboard/transaction/edit/${transaction.id}`}
															className="group/btn relative p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-110 active:scale-95"
															title="Edit"
														>
															<FaEdit className="w-4 h-4" />
															<div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
														</Link>
														<button
															onClick={() => handleDelete(transaction.id)}
															className="group/btn relative p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-110 active:scale-95"
															title="Hapus"
														>
															<FaTrash className="w-4 h-4" />
															<div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
														</button>
													</div>
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td
											className="p-12 text-center"
											colSpan={5}
										>
											<div className="flex flex-col items-center space-y-4">
												<div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
													<div className="text-4xl">📋</div>
												</div>
												<div className="space-y-2">
													<div className="text-lg font-medium text-gray-900">
														Tidak ada transaksi
													</div>
													<div className="text-sm text-gray-500">
														Mulai tambahkan transaksi pertama Anda
													</div>
												</div>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Mobile Card View */}
				<div className="md:hidden space-y-3">
					{transaction.length > 0 ? (
						transaction.map((transaction, index) => {
							const tanggal = new Date(transaction.date).toLocaleDateString(
								"id-ID",
								{
									day: "numeric",
									month: "short",
									year: "numeric",
								}
							);
							const no = (page - 1) * limit + index + 1;

							return (
								<div
									key={transaction.id}
									className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
								>
									{/* Header dengan nomor dan tanggal */}
									<div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
										<span className="text-xs font-medium text-gray-500">
											#{no}
										</span>
										<span className="text-xs text-gray-500">{tanggal}</span>
									</div>

									{/* Content */}
									<div className="p-4">
										<div className="flex justify-between items-start mb-3">
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
													{transaction.category.name}
												</h3>
												<p className="text-xs text-gray-500 truncate">
													{transaction.note}
												</p>
											</div>

											<div className="ml-3 text-right flex-shrink-0">
												<div
													className={`font-bold text-sm ${
														transaction.type === "expense"
															? "text-red-500"
															: "text-green-500"
													}`}
												>
													{transaction.type === "expense" ? "- " : "+ "}
													{FormatRupiah(transaction.amount)}
												</div>
												<div
													className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
														transaction.type === "expense"
															? "bg-red-50 text-red-600"
															: "bg-green-50 text-green-600"
													}`}
												>
													{transaction.type === "expense"
														? "Pengeluaran"
														: "Pemasukan"}
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-3 border-t border-gray-100">
											<Link
												href={`/dashboard/transaction/edit/${transaction.id}`}
												className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
											>
												<FaEdit className="w-3 h-3" />
												Edit
											</Link>
											<button
												onClick={() => handleDelete(transaction.id)}
												className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
											>
												<FaTrash className="w-3 h-3" />
												Hapus
											</button>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
							<div className="text-4xl mb-3">📋</div>
							<div className="text-gray-500 font-medium">
								Tidak ada transaksi
							</div>
							<div className="text-sm text-gray-400 mt-1">
								Transaksi Anda akan muncul di sini
							</div>
						</div>
					)}
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
					{Array.from({ length: totalPage }, (_, i) => (
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
						onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
						disabled={page === totalPage}
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
