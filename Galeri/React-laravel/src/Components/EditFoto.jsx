import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import SideNav from "./Template/SideNav";

export default function EditFoto() {
  const { foto_id } = useParams();
  const [fotoField, setFotoField] = useState({
    judul_foto: "",
    deskripsi_foto: "",
    tanggal_unggah: "",
    lokasi_file: "",
    album_id: "",
    user_id: "",
    newImage: null, // Menambahkan newImage sebagai state untuk gambar yang baru diunggah
  });

  const onDrop = (acceptedFiles) => {
    const newImage = acceptedFiles[0];
    setFotoField((prevfotoField) => ({
      ...prevfotoField,
      newImage,
      lokasi_file: URL.createObjectURL(newImage),
    }));
  };

  const dropzoneStyle = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const fetchData = async () => {
    try {
      const result = await axios.get(`http://127.0.0.1:8000/api/get-data/get-id-foto/${foto_id}`);
      setFotoField(result.data.results);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: 'Error fetching data:' + error
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [foto_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFotoField((prevfotoField) => ({
      ...prevfotoField, [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('judul_foto', fotoField.judul_foto);
      formData.append('deskripsi_foto', fotoField.deskripsi_foto);
      formData.append('tanggal_unggah', fotoField.tanggal_unggah);
      formData.append('album_id', fotoField.album_id);
      formData.append('user_id', fotoField.user_id);

      if (fotoField.newImage) {
        formData.append('lokasi_file', fotoField.newImage);
      }

      await axios.post(`http://127.0.0.1:8000/api/foto/update/${foto_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      Swal.fire({
        icon: 'success',
        text: 'Data berhasil diubah',
        showConfirmButton: false,
        toast: true,
        timer: 3000,
        position: 'top-end'
      });

      window.location.href = '/list/data/foto'
    } catch (error) {
      Swal.fire({
        icon: 'error',
        showConfirmButton: true,
        text: 'Data gagal diubah:' + error
      });
    }
  };

  return (
    <>
      <SideNav>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Form Edit</div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Lokasi File (Previous Image)
                </label>
                {fotoField.lokasi_file && (
                  <div style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    <img src={`http://127.0.0.1:8000/storage/${fotoField.lokasi_file}`} alt="Previous Image" style={{ maxWidth: '50%', maxHeight: '50%', margin: 'auto' }} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Upload New Image
                </label>
                <div {...useDropzone({ onDrop }).getRootProps()} style={dropzoneStyle} className={`dropzone ${useDropzone().isDragActive ? 'active' : ''}`}>
                  <input {...useDropzone().getInputProps()} />
                  {useDropzone().isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>Tarik dan jatuhkan, atau klik untuk memasukkan file  <i className="fas fa-hand-pointer"></i></p>
                  )}
                </div>
              </div>
              {fotoField.lokasi_file && (
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    New Image Preview
                  </label>
                  <div style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    <img src={fotoField.lokasi_file} alt="New Image" style={{ maxWidth: '50%', maxHeight: '50%', margin: 'auto' }} />
                  </div>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="" className="form-label">Judul Foto</label>
                <input type="text" name="judul_foto" value={fotoField && fotoField.judul_foto ? fotoField.judul_foto : ""} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">Deskripsi Foto</label>
                <textarea name="deskripsi_foto" className="form-control" value={fotoField && fotoField.deskripsi_foto ? fotoField.deskripsi_foto : ""} onChange={handleChange} id="" cols="30" rows="5"></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">Tanggal Unggah</label>
                <input type="date" name="tanggal_unggah" value={fotoField && fotoField.tanggal_unggah ? fotoField.tanggal_unggah : ""} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">Album ID</label>
                <input type="number" name="album_id" value={fotoField && fotoField.album_id ? fotoField.album_id : ""} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">User ID</label>
                <input type="number" name="user_id" value={fotoField && fotoField.user_id ? fotoField.user_id : ""} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-sm btn-success"><i className="fas fa-paper-plane"></i>Ubah Data</button>
              </div>
            </form>
          </div>
        </div>
      </SideNav>
    </>
  )
}
