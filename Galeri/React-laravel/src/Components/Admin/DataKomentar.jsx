import { useEffect, useState } from "react";
import axios from "axios";
import SideNav from "../Template/SideNav";
import { Hourglass } from "react-loader-spinner";

const DataKomentar = () =>{
    const [komentar,setKomentar] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() =>{
        const dataComment = async()=>{
            try{
                const response = await axios.get("http://127.0.0.1:8000/api/get-data/komentar");
                setKomentar(response.data.results);
            }catch(error){
                console.log(error);
            }finally{
                const timeoutId = setTimeout(() => {
                    setLoading(false);
                }, 3000);

                return () => clearTimeout(timeoutId);
            }
        }

        dataComment();
    },[]);

    return(
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
                    <div className="card-header"><div className="card-title">Data Komentar</div></div>
                    {loading && <p>Loading Table Data....</p>}
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-stripped">
                                <thead>
                                    <tr>
                                        <th>Foto</th>
                                        <th>User</th>
                                        <th>Komentar</th>
                                        <th>Tanggal Komentar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {komentar.map(komentar =>(
                                        <tr key={komentar.komentar_id}>
                                            <td>{komentar.judul_foto}</td>
                                            <td>{komentar.nama_lengkap}</td>
                                            <td>{komentar.isi_komentar}</td>
                                            <td>{komentar.tanggal_komentar}</td>
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
export default DataKomentar;