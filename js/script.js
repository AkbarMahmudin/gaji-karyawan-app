document.addEventListener('DOMContentLoaded', () => {
  const formAddKaryawan = document.getElementById('form-add-karyawan');

  formAddKaryawan.addEventListener('submit', (event) => {
    event.preventDefault();

    addNewGajiKaryawan();
    document.getElementById('nik').value = '';
    document.getElementById('nama').value = '';
    document.getElementById('L').checked = true;
    document.getElementById('golongan')[0].selected = true;
  });

  if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener('ondatasaved', () => {
  createToast('Data berhasil disimpan');
});

document.addEventListener('ondataupdated', () => {
  createToast('Data berhasil diubah');
  refreshDataFromGajiKaryawan();
});

document.addEventListener('ondatadeleted', () => {
  createToast('Data berhasil dihapus');
});

document.addEventListener('ondataloaded', () => {
  refreshDataFromGajiKaryawan();
});