function formatDate(isoDate) {
    const date = new Date(isoDate);

    // Ambil waktu UTC secara manual
    const year = date.getUTCFullYear();
    const month = date.toLocaleString("id-ID", { month: "long", timeZone: "UTC" });
    const day = date.getUTCDate();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    // Format string dengan format 24 jam
    return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
}
