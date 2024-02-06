import axios from "axios";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import SideNav from "./Template/SideNav";

export default function Foto() {
  const { user } = useAuth();
  const [lokasiFile, setLokasiFile] = useState(null);
  const [judulFoto, setJudulFoto] = useState("");
  const [deskripsiFoto, setDeskripsiFoto] = useState("");
  const [tanggalUnggah, setTanggalUnggah] = useState(getCurrentDate());
  const [albumId, setAlbumId] = useState("");
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/album/get-data");
        setAlbumId(response.data.results);
        setFilteredAlbums(response.data.results);
      } catch (error) {
        console.error("Error fetching album data:", error);
      }
    };

    getData();
  }, []);

  const handleSearch = () => {
    const searchTerm = searchQuery.toLowerCase();
    const filtered = albumId.filter(album => album.nama_album.toLowerCase().includes(searchTerm));
    setFilteredAlbums(filtered);
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (user) {
      setUserId(user.user_id);
    }
  }, [user]);

  useEffect(() => {
    setTanggalUnggah(getCurrentDate());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("lokasi_file", lokasiFile);
    formData.append("judulFoto", judulFoto);
    formData.append("deskripsiFoto", deskripsiFoto);
    formData.append("tanggalUnggah", tanggalUnggah);
    formData.append("albumId", albumId);
    formData.append("userId", userId);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload/foto-proses", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      setLokasiFile(null);
      setJudulFoto("");
      setDeskripsiFoto("");
      setTanggalUnggah(getCurrentDate());
      setAlbumId("");
      setUserId("");

      Swal.fire({
        icon: 'success',
        text: 'Data berhasil disimpan',
        timer: 2500,
        showConfirmButton: false
      }).then(() =>{
        window.location.href= '/list/data/foto'
      })

    } catch (error) {
      console.error("Error uploading photo", error);
      Swal.fire({
        icon: 'error',
        text: 'Terjadi kesalahan, mohon dicek ulang!',
        showConfirmButton: true,
      });
    }
  };

  const dropzoneStyle = {
    border: '2px dashed #ccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer'
  };

  const previewStyle = {
    maxWidth: '50%',
    maxHeight: '100%'
  };

  const onDrop = (acceptedFile) => {
    const file = acceptedFile[0];
    setLokasiFile(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <SideNav>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Form Upload Foto
            </div>
            <button type="button" className="btn btn-info btn-sm" style={{ marginRight: '5px' }}><i className="fas fa-table"></i> Data Foto</button>
            <button type="button" onClick={() => window.location.href = '/'} className="btn btn-sm btn-danger"><i className="fas fa-times"></i> Batal</button>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here</p>
                ) : (
                  <p>Click or drag an image to this area</p>
                )}
              </div>
              {lokasiFile && (
                <div>
                  <p>Selected image:</p>
                  <img src={URL.createObjectURL(lokasiFile)} alt="Selected" style={{ maxHeight: '100%', maxWidth: '50%', marginLeft: '250px', marginRight: '250px' }} />
                </div>
              )}
              <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="" className="form-label">
                  Judul Foto
                </label>
                <input required
                  placeholder="Judul Foto..."
                  type="text"
                  className="form-control"
                  value={judulFoto}
                  onChange={(e) => setJudulFoto(e.target.value)}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="" className="form-label">
                  Album
                </label>
                <select
                  className="form-control custom-select"
                  value={albumId}
                  name="album_id"
                  id=""
                  onChange={(e) => setAlbumId(e.target.value)}
                >
                  <option value="" selected>--Pilih Album--</option>
                  {filteredAlbums.map(album => (
                    <option value={album.album_id} key={album.album_id}>
                      {album.nama_album}
                    </option>
                  ))}
                </select>
              </div>
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Deskripsi Foto
                </label>
                <textarea
                  placeholder="Deskripsi Foto...."
                  value={deskripsiFoto}
                  onChange={(e) => setDeskripsiFoto(e.target.value)}
                  cols="30"
                  rows="5"
                  className="form-control"
                ></textarea>
              </div>
              <div className="form-group">
                <input required
                  hidden
                  type="date"
                  className="form-control"
                  value={tanggalUnggah}
                  onChange={(e) => setTanggalUnggah(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input required
                  type="number"
                  hidden
                  className="form-control"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <button type="submit" className="btn btn-sm btn-success" style={{ marginRight: '10px' }}><i className="fas fa-paper-plane"></i> Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      </SideNav>
    </>
  );
}
