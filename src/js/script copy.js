// Fungsi
// generate nomor nota
function generateNomorNota(indikator) {
  const angkaTetap = '5156';
  const waktuIndonesia = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  const waktu = new Date(waktuIndonesia); // Konversi ke objek Date
  const bulan = String(waktu.getMonth() + 1).padStart(2, '0'); // Bulan (01-12)
  const tanggal = String(waktu.getDate()).padStart(2, '0'); // Tanggal (01-31)
  const tahun = String(waktu.getFullYear()).slice(-2); // Tahun (2 digit terakhir)
  const hari = waktu.getDay() === 0 ? 7 : waktu.getDay(); // Hari (1-7, dengan Minggu sebagai 7)
  const jam = String(waktu.getHours()).padStart(2, '0'); // Jam dalam format 24 jam
  const menit = String(waktu.getMinutes()).padStart(2, '0'); // Menit
  const jamFormat24 = `${jam}${menit}`; // Gabungkan jam dan menit

  const validIndikator = ['SV', 'SL', 'SS'];
  const kodeIndikator = validIndikator.includes(indikator) ? indikator : 'NA'; // Default "NA" jika indikator tidak valid

  const nomorNota = `${angkaTetap}${bulan}${tanggal}${tahun}${hari}${jamFormat24}${kodeIndikator}`;
  return nomorNota;
}

let transactionCount = 0;

function formatCurrency(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
// Fungsi
// Tombol submit Header
function submitHeader() {
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;
  const admin = document.getElementById('Fadmin').value;
  const notaType = document.getElementById('nota-type').value;

  document.getElementById('kepada').textContent = to;
  document.getElementById('tanggal').textContent = `Tanggal: ${date}`;
  document.getElementById('admin').textContent = `Admin: ${admin}`;
  document.getElementById('no-nota').textContent = `No Nota: ` + generateNomorNota(notaType);

  document.getElementById('form-header').classList.add('hidden');
  document.getElementById('reset-header-btn').classList.remove('hidden');
}

function resetHeader() {
  document.getElementById('kepada').textContent = '-';
  document.getElementById('tanggal').textContent = 'Tanggal: -';
  document.getElementById('admin').textContent = 'Admin: -';
  document.getElementById('no-nota').textContent = 'NO Nota: -';

  document.getElementById('form-header').classList.remove('hidden');
  document.getElementById('reset-header-btn').classList.add('hidden');
}

//   Fungsi
//   Tambah Transaksi
function addTransaction() {
  const item = document.getElementById('item').value;
  const price = parseInt(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);
  const subtotal = price * quantity;

  // Validasi input
  if (!item || isNaN(price) || isNaN(quantity) || quantity <= 0) {
    alert('Mohon isi semua kolom dengan benar!');
    return;
  }

  //   start nomor
  transactionCount++;

  // Tambahkan transaksi ke tabel
  const row = `
      <tr id="transaction-${transactionCount}">
        <td class="border py-1 border-gray-300 p-2 text-center text-gray-600">${transactionCount}</td>
        <td class="border py-1 border-gray-300 p-2 text-gray-600">${item}</td>
        <td class="border py-1 border-gray-300 p-2 text-right text-gray-600">${quantity}</td>
        <td class="border py-1 border-gray-300 p-2 text-right text-gray-600">${formatCurrency(price)}</td>
        <td class="border py-1 border-gray-300 p-2 text-right text-gray-600">${formatCurrency(subtotal)}</td>
      </tr>
    `;
  document.getElementById('nota-body').insertAdjacentHTML('beforeend', row);

  // Tambahkan transaksi ke daftar List Transaksi
  const transactionAction = `
      <div id="transaction-action-${transactionCount}" class="flex justify-between items-center border-b pb-2 mb-2">
        <p>Transaksi #${transactionCount}: ${item} - ${quantity} x ${formatCurrency(price)}</p>
        <button class="bg-red-500 text-white px-2 py-1 rounded shadow" onclick="removeTransaction(${transactionCount})">Hapus</button>
      </div>
    `;
  document.getElementById('transaction-list').insertAdjacentHTML('beforeend', transactionAction);

  // Perbarui total keseluruhan
  const grandTotal = document.getElementById('grand-total');
  grandTotal.textContent = formatCurrency(parseInt(grandTotal.textContent.replace(/\./g, '')) + subtotal);

  // Reset form input transaksi
  document.getElementById('nota-form').reset();
}

// Fungsi
// Menghapus Transaksi
function removeTransaction(id) {
  const row = document.getElementById(`transaction-${id}`);
  const subtotal = parseInt(row.children[4].textContent.replace(/\./g, ''));

  // Hapus total dari subtotal transaksi yang dihapus
  const grandTotal = document.getElementById('grand-total');
  grandTotal.textContent = formatCurrency(parseInt(grandTotal.textContent.replace(/\./g, '')) - subtotal);

  // Hapus transaksi dari tabel dan List Transaksi
  row.remove();
  document.getElementById(`transaction-action-${id}`).remove();
}
