import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import SideNav from "../Template/SideNav";
import { Hourglass } from "react-loader-spinner";

export default function DataUser() {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await axios("http://127.0.0.1:8000/api/users/get-data");
            setUserData(result.data.results);
        } catch (err) {
            setError("Something went wrong while fetching data.");
        } finally {
            const timeoutId = setTimeout(() => {
                setLoading(false);
            }, 3000);

            return () => clearTimeout(timeoutId);
        }
    };

    const beforeHandleDelete = (user_id) =>{
        Swal.fire({
            icon:'warning',
            title: 'Apakah anda yakin ingin menghapus data ini?',
            text: "Data akan dihapus secara permanen",
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(user_id);
            }else{
                Swal.fire({
                    icon: 'info',
                    timer: 2000,
                    showConfirmButton: false,
                    title: "Data batal di hapus"
                })
            }
        });
    }

    const handleDelete = async (user_id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/users/delete-data/${user_id}`);
            const newUserData = userData.filter((item) => item.user_id !== user_id);
            Swal.fire({
                icon: "success",
                title: "Data berhasil dihapus",
                showConfirmButton: false,
                timer: 3000
            });
            setUserData(newUserData);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Data gagal dihapus" + error,
                showConfirmButton: true
            }).then(() => {
                window.location.href = '/admin-homepage';
            })
            console.error("Error deleting user:", error);
        }
    };

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
                        <div className="card-title">Data User</div>
                    </div>
                    <div className="card-body">
                        <button onClick={() => window.location.href = "/tambah-user"} className="btn btn-primary btn-sm mb-3"><i className="fas fa-plus"></i> Tambah</button>
                        {loading && <p>Loading...</p>}
                        {error && <p className="alert alert-danger">{error}</p>}
                        {userData && (
                            <table className="table table-hover table-stripped">
                                <thead>
                                    <tr>
                                        {/* <th>User Id</th> */}
                                        <th>Profil Foto</th>
                                        <th>Nama Lengap</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Alamat</th>
                                        <th>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData.map((user, i) => (
                                        <tr key={i}>
                                            {/* <td>{i + 1}</td> */}
                                            <td>
                                            {user.profil_foto && (
                                                <img src={`http://127.0.0.1:8000/storage/${user.profil_foto}`} height="50" width="50" alt={user.nama_lengkap} className="me-2 rounded-circle align-middle" />
                                            )}
                                            </td>
                                            <td>{user.nama_lengkap}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.alamat}</td>
                                            <td>
                                                <NavLink to={`/user-edit/${user.user_id}`} title="edit" className='btn text-warning fas fa-edit'></NavLink>
                                                <button title="hapus" onClick={() => beforeHandleDelete(user.user_id)} className="btn text-danger fas fa-trash-alt"></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </SideNav>
        </>
    )
}