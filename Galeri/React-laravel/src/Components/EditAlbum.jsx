import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SideNav from "./Template/SideNav";

const EditAlbum = () =>{
    const { album_id } = useParams();
    const [loading, setLoading] = useState(null);
    const [dataField,setDataField] = useState({
        nama_album: "",
        deskripsi: "",
        tanggal_dibuat: "",
        user_id: ""
    });

    const getData = async() =>{
        try{
            const result = await axios.get(`http://127.0.0.1:8000/api/album/edit-data/${album_id}`);
            setDataField(result.data.results);
        }catch(error){
            console.log("Something wrong");
        }
    }

    useEffect(() => {
        getData();
    }, [album_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataField((prevDataField) => ({ ...prevDataField, [name]: value }));
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{
            const response = await axios.put(`http://127.0.0.1:8000/api/album/edit-post/${album_id}`,dataField);
            
            Swal.fire({
                icon: 'success',
                text: 'Data berhasil diubah',
                showConfirmButton: false,
                timer: 3000,
            }).then(() =>{
                window.location.href='/data/album'
            });
        }catch (error){
            Swal.fire({
                icon: 'error',
                text: 'Data gagal diubah, Error:'+error,
            })
        }
    }
    return(
        <>
        <SideNav>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Edit Form</div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nama Album</label>
                                <input type="text" value={dataField && dataField.nama_album ? dataField.nama_album : ""} onChange={handleChange} name="nama_album" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Deskripsi</label>
                                <textarea name="deskripsi" value={dataField && dataField.deskripsi ? dataField.deskripsi : ""} onChange={handleChange} id="" cols="30" rows="5" className="form-control"></textarea>
                            </div>
                            <div className="form-group">
                                <input type="date" value={dataField && dataField.tanggal_dibuat ? dataField.tanggal_dibuat : ""} hidden onChange={handleChange} name="tanggal_dibuat" className="form-control" />
                            </div>
                            <div className="form-group">
                                <input type="number" value={dataField && dataField.user_id ? dataField.user_id : ""} hidden onChange={handleChange} name="user_id" className="form-control" />
                            </div>
                            <div className="form-group mt-3">
                               <button type="submit" className="btn btn-sm btn-success"><i className="fas fa-save"></i> Ubah Data</button>
                            </div>
                        </form>
                    </div>
                </div>
                </SideNav>
        </>
    )
}
export default EditAlbum;