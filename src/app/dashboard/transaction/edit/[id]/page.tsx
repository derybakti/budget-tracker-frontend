/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import TransactionForm from "@/pages/TransactionForm";
import { fetchTransactionById, editTransaction } from "@/services/Transaction";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "@/ui/Modal";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import { updateCategory } from "@/services/categori";


export default function EditTransactionPage() {
	//const searchParams = useSearchParams();
	//const id = searchParams?.get("id");
	const { id } = useParams() as { id: string };
	const router = useRouter();

	const [initialData, setInitialData] = useState<TransactionFormData>();
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modal, setModal] = useState<ModalProps | null>(null);

	console.log(id);
	if (!id || typeof id !== "string") {
		return <>Invalid Transaction ID</>;
	}

	useEffect(() => {
		const loadTransaction = async () => {
			try {
				const res = await fetchTransactionById(Number(id));
				const tx = res.data;

				setInitialData({
					type: tx.type,
					amount: tx.amount.toString(),
					categoryId: tx.category_id,
					note: tx.note,
					date: tx.date.slice(0, 10),
				});
				setLoading(false);
			} catch (error) {
				if (error instanceof Error) {
					setModal({ message: error.message, type: "danger" });
				} else {
					setModal({ message: "Terjadi kesalahan", type: "danger" });
				}
			} finally {
				setLoading(false);
			}
		};

		loadTransaction();
	}, [id]);

	const handleSubmit = async (form: TransactionFormData) => {
		setIsSubmitting(true);
		try {
			await editTransaction(Number(id), {
				...form,
			});

			setModal({
				type: "success",
				message: "Transaksi berhasil diubah",
			});
		} catch (error) {
			if (error instanceof Error) {
				setModal({
					message: error.message,
					type: "danger",
				});
			} else {
				setModal({
					message: "Terjadi kesalahan",
					type: "danger",
				});
			}
		} finally {
			setIsSubmitting(false);
			
		}
	};

	if (loading) return <LoadingSpinnerScreen />;
	console.log({initialData});
	

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Edit Transaksi</h1>
			{isSubmitting && <LoadingSpinnerScreen />}
			{modal && (
				<Modal
					type={modal.type}
					message={modal.message}
					onOk={() => {
						setModal(null);
						if (modal.type === "success") router.push("/dashboard/transaction");
					}}
				/>
			)}
			{initialData && (
				<TransactionForm
					initialData={initialData}
					onSubmit={handleSubmit}
				/>
			)}
		</div>
	);
}
