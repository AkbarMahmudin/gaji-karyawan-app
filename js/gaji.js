class Gaji {
  constructor(data) {
    this._data = data;

    this.getGajiPokok = this.getGajiPokok.bind(this);
    this.getTotalGaji = this.getTotalGaji.bind(this);
    this.addGaji = this.addGaji.bind(this);
  }
  
  addGaji(nik, nama, jKelamin, golongan, tunjangan, potongan) {
    this._data.push({
      nik,
      nama,
      jKelamin,
      golongan,
      gajiPokok: this.getGajiPokok(),
      tunjangan,
      potongan,
      total: this.getTotalGaji(),
    });
  }

  getGajiPokok() {
    switch (this._golongan) {
      case 1:
        return 8000000;
      case 2:
        return 6000000;
      case 3:
        return 4500000;
      case 4:
        return 3500000;
    }
  }

  getTotalGaji() {
    return (this.getGajiPokok() + this._tunjangan) - this._potongan;
  }
}
