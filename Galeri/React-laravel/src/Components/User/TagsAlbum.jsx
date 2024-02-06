import axios from "axios";
import { useEffect,useState } from "react";
import { Nav } from "react-bootstrap";

const TagsAlbum = ({onFilter}) => {
  const [tagAlbum,setTagAlbum] = useState([]);

  useEffect(()=>{
    getDataAlbum();
  },[]);

  const getDataAlbum = async () =>{
    const result = await axios.get("http://127.0.0.1:8000/api/album/get-data");
    setTagAlbum(result.data.results);
  }
  return (
    <>
      <Nav className="tag-scroll" variant="tabs" defaultActiveKey="#tag1" style={{ overflowX: 'auto',marginBottom: '20px' }}>
        <Nav.Item>
      <select name="filter" id="filter" className="custom-select">
        <option selected className="form-control">Filter</option>
        <option className="form-control"> Paling banyak disukai</option>
        <option className="form-control">Paling banyak komentar</option>
        <option className="form-control">Foto Terbaru</option>
      </select>
      </Nav.Item>
      <div className="d-flex flex-row flex-nowrap" style={{position: 'sticky',left: '0'}}>
      {tagAlbum.map(album =>(
        <Nav.Item key={album.album_id} style={{display: "flex"}}>
          <Nav.Link className="btn btn-outline-secondary text-dark border" style={{marginLeft: '5px'}} href={`/album/${album.album_id}`} >
          {/* <img
          src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
          alt={`Album ${album.nama_album}`}
          style={{ width: '20px', height: '20px', marginRight: '5px' }}
        /> */}
            {album.nama_album}
            </Nav.Link>
        </Nav.Item>
      ))}
      </div>
      </Nav>
    </>
  )
}
export default TagsAlbum;