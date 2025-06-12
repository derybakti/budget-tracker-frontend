export default function FormatRupiah(harga: number | string) {
	return `Rp. ${harga.toLocaleString("id-ID")}`;
}
