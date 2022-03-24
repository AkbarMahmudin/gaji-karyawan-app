const GAJI_KARYAWAN_ID = 'gajiKaryawanId';
const ROW_GAJI_KARYAWAN = 'row-gaji-karyawan';

const addNewGajiKaryawan = () => {
  const nik = document.getElementById('nik').value;
  const nama = document.getElementById('nama').value;
  const golongan = document.getElementById('golongan').value;
  const searchJKelamin = () => {
    const radioElm = document.getElementsByName('jKelamin');
    for (const radio of radioElm) {
      if (radio.checked) {
        return radio.value;
      }
    }
  };
  const jKelamin = searchJKelamin();

  const gajiKaryawanData = createGajiKaryawan(nik, nama, jKelamin, golongan);

  if (gajiKaryawanData === false) {
    createToast('NIK tidak boleh sama!', 'bg-danger');
    return false;
  } else {
    const gajiKaryawanRow = createRowGajiKaryawan(nik, nama, jKelamin, golongan);
  
    gajiKaryawanRow[GAJI_KARYAWAN_ID] = gajiKaryawanData.nik;
  
    const rowItem = document.getElementById(ROW_GAJI_KARYAWAN);
    rowItem.append(gajiKaryawanRow);
    return true;
  }
};

const createRowGajiKaryawan = (nik, nama, jKelamin, golongan) => {
  const rowElm = document.createElement('tr');
  rowElm.classList.add('row-data');

  const no = gajiKaryawan.findIndex((karyawan) => karyawan.nik == nik) + 1;

  const noElm = document.createElement('td');
  noElm.classList.add('text-center')
  noElm.innerText = no;
  const nikElm = document.createElement('td');
  nikElm.innerText = nik;
  const namaElm = document.createElement('td');
  namaElm.innerText = nama;
  const jKelaminElm = document.createElement('td');
  jKelaminElm.innerText = jKelamin;
  const golonganElm = document.createElement('td');
  golonganElm.classList.add('text-center')
  golonganElm.innerText = golongan;
  const actionElm = document.createElement('td');
  const detailButton = createDetailButton();
  const editButton = createEditButton();
  const deleteButton = createDeleteButton();

  actionElm.classList.add('d-flex', 'justify-content-around');
  actionElm.append(detailButton, editButton, deleteButton);

  rowElm.append(noElm, nikElm, namaElm, jKelaminElm, golonganElm, actionElm);
  return rowElm;
};

const createButton = (classType, text, evenListener) => {
  const button = document.createElement('button');
  if (typeof classType === 'object') {
    button.classList.add(...classType);
  } else {
    button.classList.add(classType);
  }
  button.innerText = text;

  button.addEventListener('click', (event) => {
    evenListener(event);
  });

  return button;
};

const createDetailButton = () => {
  return createButton(
    ['btn', 'btn-info', 'btn-sm', 'inline-block'],
    'Detail',
    (event) => {
      showDetailModal(event.target.parentElement.parentElement);
    }
  );
};

const createEditButton = () => {
  return createButton(
    ['btn', 'btn-warning', 'btn-sm', 'inline-block'],
    'Edit',
    (event) => {
      showEditModal(event.target.parentElement.parentElement);
    }
  );
};

const createDeleteButton = () => {
  return createButton(
    ['btn', 'btn-danger', 'btn-sm', 'inline-block'],
    'Delete',
    (event) => {
      showDeleteModal(event.target.parentElement.parentElement);
    }
  );
};

const showDetailModal = (rowItem) => {
  const modal = new bootstrap.Modal(document.getElementById('detailModal'));
  modal.show();

  const gajiKaryawanFiltered = gajiKaryawan.filter(
    (karyawan) => karyawan.nik == rowItem[GAJI_KARYAWAN_ID]
  )[0];

  const imgProfile = document.getElementById('img-profile');

  if (gajiKaryawanFiltered.jKelamin === 'laki-laki') {
    imgProfile.setAttribute('src', './assets/male-avatar.svg');
  } else {
    imgProfile.setAttribute('src', './assets/female-avatar.svg');
  }

  const [
    rowNik,
    rowNama,
    rowJKelamin,
    rowGolongan,
    rowGajiPokok,
    rowTunjangan,
    rowPotongan,
    rowTotalGaji,
  ] = document.getElementsByClassName('row-value');

  rowNik.innerText = gajiKaryawanFiltered.nik;
  rowNama.innerText = gajiKaryawanFiltered.nama;
  rowJKelamin.innerText = gajiKaryawanFiltered.jKelamin;
  rowGolongan.innerText = gajiKaryawanFiltered.golongan;
  rowGajiPokok.innerText = `Rp. ${formatNumber(gajiKaryawanFiltered.gajiPokok)}`;
  rowTunjangan.innerText = `Rp. ${formatNumber(gajiKaryawanFiltered.tunjangan)}`;
  rowPotongan.innerText = `Rp. ${formatNumber(gajiKaryawanFiltered.potongan)}`;
  rowTotalGaji.innerText = `Rp. ${formatNumber(gajiKaryawanFiltered.totalGaji)}`;
};

const showEditModal = (rowItem) => {
  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();

  const filteredData = gajiKaryawan.filter(
    (karyawan) => karyawan.nik == rowItem[GAJI_KARYAWAN_ID]
  )[0];

  document.getElementById('edit-nik').value = filteredData.nik;
  document.getElementById('edit-nama').value = filteredData.nama;
  document.getElementById('edit-tunjangan').value = filteredData.tunjangan;
  document.getElementById('edit-potongan').value = filteredData.potongan;

  const radioElm = document.getElementsByName('edit-jKelamin');
  for (const radio of radioElm) {
    if (radio.value === filteredData.jKelamin) {
      radio.checked = true;
    }
  }

  const selectedElm = document.getElementById('edit-golongan');
  let i = 1;
  for (const select of selectedElm) {
    select.innerText = `${i} (Rp. ${formatNumber(getGapok(select.value))})`;
    if (select.value == filteredData.golongan) {
      select.selected = true;
    }
    i++;
  }

  const saveButton = document.getElementById('form-edit-karyawan');
  saveButton.addEventListener('submit', (event) => {
    event.preventDefault();
    editGajiKaryawan();
    modal.hide();
  });
};

const showDeleteModal = (rowItem) => {
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();

  const buttonDelete = document.getElementById('confirm-delete');
  buttonDelete.addEventListener('click', (event) => {
    event.preventDefault();
    deleteGajiKaryawan(rowItem[GAJI_KARYAWAN_ID]);
    
    rowItem.remove();
    modal.hide();
  });
};

const editGajiKaryawan = () => {
  const nik = document.getElementById('edit-nik').value;
  const nama = document.getElementById('edit-nama').value;
  const tunjangan = document.getElementById('edit-tunjangan').value;
  const potongan = document.getElementById('edit-potongan').value;
  const golongan = document.getElementById('edit-golongan').value;
  const searchJKelamin = () => {
    const radioElm = document.getElementsByName('edit-jKelamin');
    for (const radio of radioElm) {
      if (radio.checked) {
        return radio.value;
      }
    }
  };
  const jKelamin = searchJKelamin();

  updateGajiKaryawan(nik, nama, jKelamin, golongan, tunjangan, potongan);
};

const createToast = (msg, bgColor = 'bg-success') => {
  const toast = document.getElementById('toast');
  toast.innerHTML = `
  <div class="toast ${bgColor} text-white align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="toast-msg">
    <div class="d-flex">
      <div class="toast-body">
      ${msg}
    </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
  `;
  const toastList = new bootstrap.Toast(document.getElementById('toast-msg'));
  toastList.show();
  setTimeout(() => {
    toastList.hide();
  }, 2000);
};

const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
