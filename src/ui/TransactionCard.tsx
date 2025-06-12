export default function TransactionCard({
	title,
	value,
}: {
	title: string;
	value: string | number;
}) {
	return (
		<div className="relative group">
			{/* Main Card */}
			<div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl hover:shadow-indigo-200/50 transition-all duration-300 transform hover:-translate-y-1">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

				{/* Content */}
				<div className="relative z-10">
					{/* Title with improved typography */}
					<div className="flex items-center justify-between mb-4">
						<p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
							{title}
						</p>
						{/* Decorative icon */}
						<div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
							<div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
						</div>
					</div>

					{/* Value with enhanced styling */}
					<div className="flex items-end gap-2">
						<p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200 origin-left">
							{value}
						</p>
						{/* Subtle accent line */}
						<div className="h-0.5 bg-gradient-to-r from-indigo-300 to-transparent flex-1 mb-2 opacity-60"></div>
					</div>
				</div>

				{/* Subtle bottom accent */}
				<div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-30"></div>
			</div>
		</div>
	);
}
