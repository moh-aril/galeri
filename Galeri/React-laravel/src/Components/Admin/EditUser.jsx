import { useParams } from "react-router-dom";
import React,{ useState,useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SideNav from "../Template/SideNav";

export default function EditUser(){
    const { user_id } = useParams();
    const [userField, setUserField] = useState({
        profil_foto: "", 
        nama_lengkap: "",
        username: "",
        email: "",
        alamat: "",
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUser();
    }, [user_id]);
    
    const fetchUser = async () => {
        try {
            const result = await axios.get(`http://127.0.0.1:8000/api/users/edit-id/${user_id}`);
            setUserField(result.data.results);
        } catch (err) {
            setError(`Error fetching user data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

    setUserField((prevUserField) => ({
        ...prevUserField,
        [name]: e.target.type === 'file' ? files[0] : value,
    }));
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            formData.append('profil_foto', userField.profil_foto);
            formData.append('nama_lengkap', userField.nama_lengkap);
            formData.append('username', userField.username);
            formData.append('email', userField.email);
            formData.append('alamat', userField.alamat);
    
            await axios.post(`http://127.0.0.1:8000/api/users/update/${user_id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });
          
            Swal.fire({
                icon: "success",
                title: "User berhasil dirubah",
                timer: "2000",
                showConfirmButton: false
            }).then(()=>{
                window.location.href='/list/data/user';
            });
        } catch (err) {
            console.error(`Error updating user data: ${err.message}`);
        }
    };
    return(
        <>
        <SideNav>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Edit User Form</div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                        <div className="form-group">
                                <label htmlFor="" className="form-label">Profil Foto</label>
                                <input type="file" onChange={handleChange} name="profil_foto" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Nama Lengkap</label>
                                <input type="text" value={userField && userField.nama_lengkap ? userField.nama_lengkap : ""} onChange={handleChange} name="nama_lengkap" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Username</label>
                                <input type="username" value={userField && userField.username ? userField.username : ""} onChange={handleChange} name="username" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" className="form-label">Email</label>
                                <input type="email" value={userField && userField.email ? userField.email : ""} onChange={handleChange} name="email" className="form-control" />
                            </div>
                            <div className="form-group">
                                <textarea name="alamat" className="form-control" value={userField && userField.alamat ? userField.alamat : ""} onChange={handleChange} cols="30" rows="5"></textarea>
                            </div>
                            <div className="form-group mt-3">
                                <button type="submit" className="btn btn-success btn-sm"><i className="fas fa-save"></i> Ubah data</button>
                                <a href="/list/data/user" className="btn btn-sm btn-danger"><i className="fas fa-times"></i> Kembali</a>
                            </div>
                        </form>
                    </div>
                </div>
            </SideNav>
        </>
    )
}