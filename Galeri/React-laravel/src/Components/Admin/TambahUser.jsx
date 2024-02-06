import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import SideNav from "../Template/SideNav";

export default function TambahUser() {
  const [userField, setUserField] = useState({
    profil_foto: "",
    nama_lengkap: "",
    username: "",
    password: "",
    email: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeUserFieldHandler = (e) => {
    setUserField((prevUserField) => ({
      ...prevUserField,
      [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value,
    }));
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('profil_foto', userField.profil_foto);
    formData.append('nama_lengkap', userField.nama_lengkap);
    formData.append('username', userField.username);
    formData.append('password', userField.password);
    formData.append('email', userField.email);
    formData.append('alamat', userField.alamat);
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.post("http://127.0.0.1:8000/api/users/register/store", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });
  
      
    } catch (err) {
      setError("Something went wrong");
      console.error(err.response?.data); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <SideNav>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Tambah User</div>
          </div>
          <div className="card-body">
            <form onSubmit={onSubmitChange}>
              <input type="file" name="profil_foto" onChange={changeUserFieldHandler} className="form-control mb-3" id="profile" />
              <div className="row">
              <div class="mb-3 col-md-6">
                <input style={{height: '45px'}} type="text" class="form-control" onChange={changeUserFieldHandler} value={userField.nama_lengkap} placeholder="Masukkan Nama Lengkap" name="nama_lengkap" />
              </div>
              <div class="mb-3 col-md-6">
                <input style={{height: '45px'}} autoComplete="username" type="text" class="form-control" onChange={changeUserFieldHandler} value={userField.username} placeholder="Masukkan Username" name="username" />
              </div>
              </div>
              <div className="row">
              <div class="mb-3 col-md-6">
                <input style={{height: '45px'}} type="password" class="form-control" autoComplete="current-password" onChange={changeUserFieldHandler} value={userField.password} placeholder="Masukkan Password" name="password" />
              </div>
              <div class="mb-3 col-md-6">
                <input style={{height: '45px'}} type="email" class="form-control" onChange={changeUserFieldHandler} value={userField.email} placeholder="Masukkan Email" name="email" />
              </div>
              </div>
              <div class="mb-3">
                <textarea name="alamat" id="" cols="30" rows="5" onChange={changeUserFieldHandler} value={userField.alamat} placeholder="Alamat Tempat Tinggal" className="form-control"></textarea>
              </div>
              <div className="form-group" style={{marginLeft: '350px'}}>
              <button type="submit" class="btn btn-block col-md-6 btn-primary btn-sm" disabled={loading}><i className="fas fa-paper-plane"></i> {loading ? "Submitting..." : "Register"}</button>
              </div>
            </form>
          </div>
        </div>
      </SideNav>
    </>
  )
}