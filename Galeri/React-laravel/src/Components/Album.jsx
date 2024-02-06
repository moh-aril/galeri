import { Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import ListAlbum from "./ListAlbum";
import Swal from "sweetalert2";
import { useAuth } from "./Context/AuthContext";
import SideNav from "./Template/SideNav";

export default function Album() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [namaAlbum, setNamaAlbum] = useState("");
  const [deskripsiAlbum, setDeskripsiAlbum] = useState("");
  const [userId, setUserId] = useState(0);
  const [tanggal, setTanggal] = useState(getCurrentDate());

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
      setUserId(user.user_id)
    }
  }, [user]);

  useEffect(() => {
    setTanggal(getCurrentDate());
  }, []);

  const OpenModal = () => setShowModal(true);
  const CloseModal = () => setShowModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:8000/api/album/store', {
      namaAlbum,
      deskripsiAlbum,
      userId,
      tanggal,
    })

    Swal.fire({
      icon: 'success',
      text: 'Data berhasil di buat',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      window.location.href = '/data/album'
    });
  };

  return (
    <>
      <SideNav>
            <div className="card">
              <div className="card-header">
                <button className="btn  btn-outline-primary btn-sm" style={{borderRadius: '30px'}} onClick={OpenModal}><i className="fas fa-folder-plus"></i> Buat Album</button>
                {/* <Button className="btn" onClick={OpenModal}>
                  <i className="fas fa-folder-plus inline-block"></i> Buat Album
                </Button> */}

                <Modal show={showModal} onHide={CloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modal Title</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nama Album...."
                        value={namaAlbum}
                        onChange={(e) => setNamaAlbum(e.target.value)}
                      />
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="3"
                        className="form-control mt-2"
                        placeholder="Deskripsi Album...."
                        value={deskripsiAlbum}
                        onChange={(e) => setDeskripsiAlbum(e.target.value)}
                      ></textarea>
                      <input
                        type="date"
                        className="form-control mt-2"
                        value={tanggal}
                        hidden
                      />
                      <input
                        type="number"
                        className="form-control mt-2"
                        value={userId}
                        hidden
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="danger" className="btn-sm" onClick={CloseModal}>
                      <i className="fas fa-times"></i> Tutup
                    </Button>
                    <Button variant="success" className="btn-sm" onClick={handleSubmit}>
                      <i className="fas fa-paper-plane"></i> Buat Album
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              <ListAlbum />
      </div>
              </SideNav>
    </>
  );
}
