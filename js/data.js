const STORAGE_KEY = 'GAJI_KARYAWAN';
let gajiKaryawan = [];

const isStorageExist = () => {
  if (!typeof Storage) {
    alert('Yahh!!! Browser kamu tidak mendukung Storage.');
    return false;
  }
  return true;
};

const updateDataToStorage = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(gajiKaryawan);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
};

const createGajiKaryawan = (nik, nama, jKelamin, golongan) => {
  const gajiPokok = getGapok(golongan);
  const { tunjangan, potongan } = getGapokTunjPotg(golongan);

  const dataFiltered = gajiKaryawan.filter((karyawan) => karyawan.nik == nik);
  if (dataFiltered.length) {
    return false;
  }

  const newGajiKaryawan = {
    nik,
    nama,
    jKelamin,
    golongan: parseInt(golongan),
    gajiPokok,
    tunjangan,
    potongan,
    totalGaji: gajiPokok + tunjangan - potongan,
  };

  gajiKaryawan.push(newGajiKaryawan);
  updateDataToStorage();

  document.dispatchEvent(new Event('ondatasaved'));
  return newGajiKaryawan;
};

const updateGajiKaryawan = (nik, nama, jKelamin, golongan, tunjangan, potongan) => {
  const dataFiltered = gajiKaryawan.filter((karyawan) => karyawan.nik === nik)[0];
  dataFiltered.nama = nama;
  dataFiltered.jKelamin = jKelamin;
  dataFiltered.golongan = golongan;
  dataFiltered.tunjangan = parseInt(tunjangan);
  dataFiltered.potongan = parseInt(potongan);
  dataFiltered.totalGaji = getGapok(golongan) + parseInt(tunjangan) - parseInt(potongan);

  updateDataToStorage();
  document.dispatchEvent(new Event('ondataupdated'));

  return dataFiltered;
};

const deleteGajiKaryawan = (nik) => {
  const dataIndex = gajiKaryawan.findIndex((karyawan) => {
    return karyawan.nik === nik;
  });
  gajiKaryawan.splice(dataIndex, 1);
  
  updateDataToStorage();
  document.dispatchEvent(new Event('ondatadeleted'));
};

const getGapok = (gol) => {
  switch (parseInt(gol)) {
    case 1:
      return 1486500;
    case 2:
      return 1926000;
    case 3:
      return 2456700;
    case 4:
      return 2899500;
  }
}

const getGapokTunjPotg = (gol) => {
  let tunjangan;
  let potongan;

  switch (parseInt(gol)) {
    case 1:
      tunjangan = 250000;
      break;
    case 2:
      tunjangan = 300000;
      break;
    case 3:
      tunjangan = 350000;
      break;
    case 4:
      tunjangan = 400000;
      break;
    default:
      return false;
  }
  potongan = tunjangan * 0.2;

  return {
    tunjangan,
    potongan,
  };
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data) gajiKaryawan = data;

  document.dispatchEvent(new Event('ondataloaded'));
};

const refreshDataFromGajiKaryawan = () => {
  const rowGajiKaryawan = document.getElementById(ROW_GAJI_KARYAWAN);
  const rowData = document.querySelectorAll('.row-data');

  if (rowData.length !== 0) {
    for (row of rowData) {
      row.remove();
    }
  }

  for (karyawan of gajiKaryawan) {
    const newRow = createRowGajiKaryawan(
      karyawan.nik,
      karyawan.nama,
      karyawan.jKelamin,
      karyawan.golongan,
    );
    newRow[GAJI_KARYAWAN_ID] = karyawan.nik;
    rowGajiKaryawan.append(newRow);
  }
};
