// timestamp.js

/**
 * Fungsi untuk menghasilkan timestamp dengan format ISO 8601
 * @returns {string} Timestamp dengan format "YYYY-MM-DDTHH:mm:ssZ"
 */
function generateTimestamp() {
    const now = new Date();

    // Dapatkan bagian waktu dalam format UTC
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Tambahkan 1 karena bulan dimulai dari 0
    const date = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    // Formatkan menjadi ISO 8601
    return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}Z`;
}

export default generateTimestamp;
