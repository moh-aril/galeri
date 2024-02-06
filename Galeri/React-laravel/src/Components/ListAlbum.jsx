import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Hourglass } from "react-loader-spinner";
import { useAuth } from "./Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ListAlbum() {
  const { album_id } = useParams();
  const [album, setAlbum] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/album/get-data");
        setAlbum(response.data.results);
      } catch (error) {
        setError('Terjadi kesalahan mohon periksa sambungan database atau dll!');
      } finally {
        const timeoutId = setTimeout(() => {
          setLoading(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
      }
    };

    getData();
  }, []);

  const beforeHandleDelete = async(album_id) =>{
    Swal.fire({
      icon: 'question',
      title: 'Anda yakin ingin menghapus album ini?',
      text: 'Album akan dihapus secara permanen!',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) =>{
      if(result.isConfirmed){
        handleDelete(album_id);
      }else{
        Swal.fire({
          icon: 'info',
          title: 'Batal hapus',
          text: 'Album batal dihapus',
          showConfirmButton: true,
        })
      }
    })
  }

  const handleDelete = async(album_id) =>{
    try{
      await axios.delete(`http://127.0.0.1:8000/api/album/delete-data/${album_id}`);
      const newAlbumData = album.filter((item) => item.album_id !== album_id);

      Swal.fire({
        icon: 'success',
        text: 'Data berhasil dihapus',
        timer: 2000,
        showConfirmButton: false
      })
      setAlbum(newAlbumData);
    }catch (error){
      Swal.fire({
        icon: 'error',
        text: 'Data gagal dihapus',
      })
    }
  }

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <>
    <div className="loading-spinner-container full-screen-loader" style={{ display: loading ? 'flex' : 'none' }}>
                    <div className="card shadow">
                        <div className="card-body" style={{ display: 'flex' }}>
                            <Hourglass
                                height="70"
                                width="70"
                                color="#4fa94d"
                                ariaLabel="hourglass-loading"
                                wrapperStyle={{}}
                                wrapperClass="wrapper-class"
                                visible={true}
                            />
                            <h4 className="mt-3" style={{ marginLeft: '10px' }}>Loading....</h4>
                        </div>
                    </div>
                </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="card-body">
        <table className="table table-hover table-borderles">
            <thead>
                <tr>
                    <th>Nama Album</th>
                    <th>Deskripsi</th>
                    <th>Tanggal Dibuat</th>
                    <th>User Id</th>
                    <th>#</th>
                </tr>
            </thead>
        <tbody>
        {album.map(album => (
            <tr key={album.album_id}>
                <td>{album.nama_album}</td>
                <td>{album.deskripsi}</td>
                <td>{album.tanggal_dibuat}</td>
                <td>{album.nama_lengkap}</td>
                <td>
                    <NavLink style={{marginRight: '5px'}} to={`/album/edit/${album.album_id}`} className="btn fas fa-edit text-warning"></NavLink>
                    <button onClick={() =>beforeHandleDelete(album.album_id)} className="btn fas fa-trash-alt text-danger"></button>
                </td>
            </tr>
        ))}
        </tbody>
        </table>
      </div>
    </>
  );
}
