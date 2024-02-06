import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { NavLink } from "react-router-dom";
import SideNav from "./Template/SideNav";
import { Audio, Hourglass } from "react-loader-spinner";

export default function ListFoto() {
    const [foto, setFoto] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const gethData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/get-data/foto");
                setFoto(response.data.results);
            } catch (error) {
                setError('Terjadi kesalahan mohon periksa sambungan database atau dll!');
            } finally {
                const timeoutId = setTimeout(() => {
                    setLoading(false);
                }, 3000);

                return () => clearTimeout(timeoutId);
            }
        };

        gethData();
    }, []);

    const handleDelete = async (foto_id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/delete/delete-foto/${foto_id}`);
            const newFotoData = foto.filter((item) => item.foto_id !== foto_id);
            Swal.fire({
                icon: 'success',
                text: 'Data berhasil dihapus',
                showConfirmButton: false,
                toast: true,
                timer: 3000,
                position: 'top-end'
            })
            setFoto(newFotoData);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'Data gagal dihapus' + error,
                showConfirmButton: true,
            })
        }
    }

    return (
        <>
            <SideNav>
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
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Data Foto</div>
                    </div>
                    <div className="card-body">
                        <button type="button" onClick={() => window.location.href = '/upload/foto'} className="btn btn-sm btn-primary mb-2"><i className="fas fa-plus-circle"></i> Upload Foto</button>
                        <div className="table-responsive">
                            {error && <p className="alert alert-danger">{error}</p>}
                            {loading && <p>Loading Table Data....</p>}
                            <table className="table table-hover table-striped">
                                <thead>
                                    <tr>
                                        <th>Judul Foto</th>
                                        <th>Deskripsi Foto</th>
                                        <th>Tanggal Unggah</th>
                                        <th>Lokasi File</th>
                                        <th>Album</th>
                                        <th>User</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foto.map(foto => (
                                        <tr key={foto.foto_id}>
                                            <td>{foto.judul_foto}</td>
                                            <td>{foto.deskripsi_foto}</td>
                                            <td>{foto.tanggal_unggah}</td>
                                            <td>
                                                {foto.lokasi_file && (
                                                    <img src={`http://127.0.0.1:8000/storage/${foto.lokasi_file}`} alt={foto.judul_foto} style={{ maxWidth: '40%', maxHeight: '40%' }} />
                                                )}
                                            </td>
                                            <td>{foto.nama_album}</td>
                                            <td>{foto.nama_lengkap}</td>
                                            <td>
                                                <NavLink to={`/edit/edit-foto/${foto.foto_id}`} className="btn text-warning fas fa-edit" style={{ marginRight: "5px" }}></NavLink>
                                                <hr />
                                                <button type="button" onClick={() => handleDelete(foto.foto_id)} className="btn fas fa-trash-alt text-danger"></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </SideNav>
        </>
    )
}