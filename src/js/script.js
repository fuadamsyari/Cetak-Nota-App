// Fungsi generate nomor nota
function generateNomorNota(indikator) {
  const angkaTetap = '5156';
  const waktuIndonesia = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  const waktu = new Date(waktuIndonesia);
  const bulan = String(waktu.getMonth() + 1).padStart(2, '0'); // Bulan (01-12)
  const tanggal = String(waktu.getDate()).padStart(2, '0'); // Tanggal (01-31)
  const tahun = String(waktu.getFullYear()).slice(-2); // Tahun (2 digit terakhir)
  const hari = waktu.getDay() === 0 ? 7 : waktu.getDay(); // Hari (1-7, dengan Minggu sebagai 7)
  const jam = String(waktu.getHours()).padStart(2, '0'); // Jam
  const menit = String(waktu.getMinutes()).padStart(2, '0'); // Menit

  const validIndikator = ['SV', 'SL', 'SS'];
  const kodeIndikator = validIndikator.includes(indikator) ? indikator : 'NA';

  return `${angkaTetap}${bulan}${tanggal}${tahun}${hari}${jam}${menit}${kodeIndikator}`;
}

// Fungsi untuk memperbarui nomor transaksi
function updateTransactionNumbers() {
  const nomorCells = document.querySelectorAll('td.nomor');
  nomorCells.forEach((cell, index) => {
    // Mengubah nomor berdasarkan urutan elemen dalam tabel
    cell.textContent = index + 1;
  });
}

// Fungsi format angka ke format mata uang
function formatCurrency(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// *****************************************************************************************************
// *****************************************************************************************************
// *****************************************************************************************************

// Fungsi submit header
function submitHeader() {
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;
  const admin = document.getElementById('Fadmin').value;
  const notaType = document.getElementById('nota-type').value;

  if (!to || !date || !admin || !notaType) {
    alert('Mohon lengkapi semua data header!');
    return;
  }

  document.getElementById('kepada').textContent = to;
  document.getElementById('tanggal').textContent = `Tanggal: ${date}`;
  document.getElementById('admin').textContent = `Admin: ${admin}`;
  document.getElementById('no-nota').textContent = `No Nota: ` + generateNomorNota(notaType);

  document.getElementById('form-header').classList.add('hidden');
  document.getElementById('reset-header-btn').classList.remove('hidden');
}

// Fungsi reset header
function resetHeader() {
  document.getElementById('kepada').textContent = '-';
  document.getElementById('tanggal').textContent = 'Tanggal: -';
  document.getElementById('admin').textContent = 'Admin: -';
  document.getElementById('no-nota').textContent = 'No Nota: -';

  document.getElementById('form-header').classList.remove('hidden');
  document.getElementById('reset-header-btn').classList.add('hidden');
}

// Fungsi tambah transaksi
function addTransaction() {
  const item = document.getElementById('item').value;
  const price = parseInt(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  if (!item || isNaN(price) || isNaN(quantity) || quantity <= 0 || price <= 0) {
    alert('Mohon isi data transaksi dengan benar!');
    return;
  }

  const subtotal = price * quantity;

  // Mengambil jumlah transaksi yang ada di tabel
  const transactionRows = document.querySelectorAll('tr[id^="transaction-"]');
  const transactionCount = transactionRows.length + 1; // Menambahkan 1 untuk nomor baru

  const row = `
      <tr id="transaction-${transactionCount}">
          <td class="nomor border py-1 border-gray-300 p-2 text-center text-gray-600">${transactionCount}</td>
          <td class="border py-1 border-gray-300 p-2 text-gray-600">${item}</td>
          <td class="border py-1 border-gray-300 p-2 text-right text-gray-600">${quantity}</td>
          <td class="border py-1 border-gray-300 p-2 text-right text-gray-600">${formatCurrency(price)}</td>
          <td class="border py-1 border-gray-300 p-2 text-right text-gray-600">${formatCurrency(subtotal)}</td>
      </tr>
    `;
  document.getElementById('nota-body').insertAdjacentHTML('beforeend', row);

  const transactionAction = `
      <div id="transaction-action-${transactionCount}" class="flex justify-between items-center border-b pb-2 mb-2">
          <p>Transaksi: ${item} - ${quantity} x ${formatCurrency(price)}</p>
          <button class="bg-red-500 text-white px-2 py-1 rounded shadow" onclick="removeTransaction(${transactionCount})">Hapus</button>
      </div>
    `;
  document.getElementById('transaction-list').insertAdjacentHTML('beforeend', transactionAction);

  const grandTotal = document.getElementById('grand-total');
  grandTotal.textContent = formatCurrency(parseInt(grandTotal.textContent.replace(/\./g, '')) + subtotal);

  updateTransactionNumbers();
  document.getElementById('nota-form').reset();
}

// Fungsi menghapus transaksi
function removeTransaction(id) {
  const row = document.getElementById(`transaction-${id}`);
  const subtotal = parseInt(row.children[4].textContent.replace(/\./g, ''));

  const grandTotal = document.getElementById('grand-total');
  grandTotal.textContent = formatCurrency(parseInt(grandTotal.textContent.replace(/\./g, '')) - subtotal);

  row.remove();
  document.getElementById(`transaction-action-${id}`).remove();

  // Memperbarui nomor transaksi setelah penghapusan
  updateTransactionNumbers();
}
