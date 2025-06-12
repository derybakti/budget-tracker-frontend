export default function TransactionCard({
	title,
	value,
}: {
	title: string;
	value: string|number;
    }) {
    return (
			<div className="bg-indigo-100 p-4 rounded-xl shadow">
				<p className="text-sm text-gray-500">{title}</p>
				<p className="text-xl font-bold text-red-400">{value}</p>
			</div> 
            
		);
}
