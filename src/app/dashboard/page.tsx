import { StatCard } from "@/ui/StatCard";
import { FaWallet, FaPiggyBank, FaArrowDown, FaArrowUp } from "react-icons/fa";
import FormatRupiah from "@/utils/formatRupiah";

export default function DashboardPage() {
	const dateNow = new Date().toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<>
			<div className="p-3 space-y-3">
				<div className="flex flex-col gap-8 text-white bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-xl p-6">
					<div className="flex justify-between items-start flex-wrap gap-2">
						<div>
							<h2 className="text-sm md:text-3xl font-semibold">
								Wellcome back, User
							</h2>
							<p className="text-xs md:text-sm mt-1 font-normal">
								Insight at a glance: your dashboard provides you with a quick
								overview of your finances.
							</p>
						</div>
						<div className=" text-right text-xl md:text-md text-white">
							<p className="font-medium">{dateNow}</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<StatCard
							title="Total Balance"
							value={FormatRupiah(1000000)}
							icon={<FaWallet size={24} />}
							change="This Month"
							color="text-gray-600"
						/>
						<StatCard
							title="Total Savings"
							value={FormatRupiah(500000)}
							icon={
								<FaPiggyBank
									size={24}
									color="green"
								/>
							}
							change="For Recomendation"
							color="text-gray-600"
						/>
						<StatCard
							title="Total Income"
							value={FormatRupiah(1000000)}
							icon={
								<FaArrowUp
									size={24}
									color="green"
								/>
							}
							change="This Month"
							color="text-gray-600"
						/>
						<StatCard
							title="Total Expense"
							value={FormatRupiah(200000)}
							icon={
								<FaArrowDown
									size={24}
									color="red"
								/>
							}
							change="This Month"
							color="text-gray-600"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
