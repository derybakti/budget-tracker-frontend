"use client";

import TransactionForm from "@/pages/TransactionForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/ui/Modal";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import { createTransaction } from "@/services/Transaction";

export default function CreateTransactionPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modal, setModal] = useState<ModalProps | null>(null);

	const handleSubmit = async (form: TransactionFormData) => {
		setIsSubmitting(true);
		try {
			await createTransaction({
				...form,
				category_id: form.categoryId,
			});
            console.log(form);
			setModal({
				message: "Transaksi berhasil dibuat",
				type: "success",
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

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Buat Transaksi Baru</h1>
			{isSubmitting && <LoadingSpinnerScreen />}
			{modal && (
				<Modal
					message={modal.message}
					type={modal.type}
					onOk={() => {
						setModal(null);
						if (modal.type === "success") {
							router.push("/dashboard/transaction");
						}
					}}
				/>
			)}
			<TransactionForm onSubmit={handleSubmit} />
		</div>
	);
}
