import { useEffect, useState } from "react";
import SideNav from "../Template/SideNav";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { NavLink } from "react-router-dom";
import axios from "axios";

const AlbumTags = () => {
    const { album_id } = useParams();
    const [fotoAlbum, setFotoAlbum] = useState([]);

    const getFotoAlbum = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/api/album/watch/${album_id}`);
        setFotoAlbum(response.data.results);
    }

    useEffect(() => {
        getFotoAlbum();
    }, [])

    return (
        <>
            <SideNav>
                <NavLink to="/beranda" className="btn btn-danger btn-sm"><i className="fas fa-arrow-alt-circle-left"></i> Kembali</NavLink>
                <hr />
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
                    {fotoAlbum.map((album, index) => (
                        <div className="col mb-3" key={album.album_id}>
                            <div className="card">
                                <div className="card-body">
                                    <LazyLoadImage
                                        alt={`Album ${index}`}
                                        height="100%"
                                        width="100%"
                                        effect="blur"
                                        src={`http://127.0.0.1:8000/storage/${album.lokasi_file}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SideNav>
        </>
    )
}
export default AlbumTags;