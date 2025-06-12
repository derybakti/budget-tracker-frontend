"use client";

import { TransaksiProps } from "@/interfaces";
import React, { useState, useEffect } from "react";
import { CategoryOption, TransactionFormData } from "@/interfaces/ITransaction";
import { fetchAllCategories } from "@/services/categori";
import formatRupiah from "@/utils/convertNumRupiah";

const TransactionForm: React.FC<TransaksiProps> = ({
	initialData,
	onSubmit,
}) => {
	const [form, setForm] = useState<TransactionFormData>({
		type: "expense",
		amount: "",
		date: new Date().toISOString().split("T")[0],
		note: "",
		categoryId: 1,
	});

	const [categories, setCategories] = useState<CategoryOption[]>([]);
	const loadCategories = async () => {
		try {
			const res = await fetchAllCategories();
			setCategories(res.data);
		} catch (error) {
			if (error instanceof Error) {
				console.error({ message: error.message, type: "danger" });
			} else {
				console.error({ message: "Terjadi kesalahan", type: "danger" });
			}
		}
	};

	useEffect(() => {
		if (initialData) {
			setForm({
				...initialData,
				amount: formatRupiah(initialData.amount),
				categoryId: String(initialData.categoryId),
			});
		}
	}, [initialData]);

	useEffect(() => {
		loadCategories();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		if (name === "amount") {
			const clean = value.replace(/\D/g, "");
			const formatted = formatRupiah(clean);
			setForm((prev) => ({ ...prev, [name]: formatted }));
			return;
		}
		if (name === "categoryId") {
			setForm((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
			return;
		}
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const cleanedAmount = form.amount.replace(/\D/g, "");

		const payload: TransactionFormData = {
			...form,
			amount: cleanedAmount,
        };
        console.log(payload);
		onSubmit(payload);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid grid-cols-1 gap-3">
				<div>
					<label
						htmlFor="type"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Jenis
					</label>
					<select
						name="type"
						id="type"
						value={form.type}
						onChange={handleChange}
						className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						required
					>
						<option disabled>-- Pilih Jenis Transaksi --</option>
						<option value="expense">Pengeluaran</option>
						<option value="income">Pemasukan</option>
					</select>
				</div>

				{/* Input Jumlah */}
				<div>
					<label
						htmlFor="amount"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Jumlah
					</label>
					<div className="relative">
						<input
							type="string"
							id="amount"
							name="amount"
							value={form.amount}
							onChange={handleChange}
							placeholder="Rp. 50.000"
							className="block w-full pl-5 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
							required
						/>
					</div>
				</div>
				<div>
					<label
						htmlFor="categoryId"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Kategori
					</label>
					<select
						id="categoryId"
						name="categoryId"
						value={form.categoryId}
						onChange={handleChange}
						className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						required
					>
						<option disabled>-- Pilih Kategori --</option>
						{categories.map((category) => (
							<option
								value={category.id}
								key={category.id}
							>
								{category.name}
							</option>
						))}
					</select>
				</div>

				{/* Input Tanggal */}
				<div>
					<label
						htmlFor="date"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Tanggal
					</label>
					<input
						type="date"
						id="date"
						value={form.date}
						onChange={handleChange} // Set tanggal hari ini sebagai default
						className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
					/>
				</div>

				{/* Input Catatan */}
				<div>
					<label
						htmlFor="note"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Catatan
					</label>
					<input
						type="text"
						name="note"
						value={form.note}
						onChange={handleChange}
						placeholder="Makan siang di warteg..."
						className="block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
						required
					/>
				</div>

				{/* Tombol Aksi */}
				<div className="pt-4">
					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
					>
						Simpan Transaksi
					</button>
				</div>
			</div>
		</form>
	);
};

export default TransactionForm;
