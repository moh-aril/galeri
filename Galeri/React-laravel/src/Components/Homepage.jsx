import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./Context/AuthContext";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import Slider from "./Template/Slider";
import Footer from "./Template/Footer";
import SideNav from "./Template/SideNav";
import TagsAlbum from "./User/TagsAlbum";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FallingLines } from "react-loader-spinner";

export default function Homepage() {
  const { user } = useAuth();
  const [showSlider, setShowSlider] = useState(true);
  const [selectedFotoId, setSelectedFotoId] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [tanggal_komentar, setTanggal_Komentar] = useState(getCurrentDate());
  const [like, setLike] = useState({ likedPhotos: [], totalLike: 0,});
  const userId = user ? user.user_id : null;
  const [foto, setFoto] = useState([]);
  const [comment, setComment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [foto_id, setFoto_Id] = useState();
  const [user_id, setUser_Id] = useState(null);
  const [isi_komentar, setIsi_Komentar] = useState();
  const [showModal, setShowModal] = useState(false);
  const [inputText, setInputText] = useState({});
  const [countLike, setCountLike] = useState([]);
  const CloseModal = () => setShowModal(false);

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
    const getCountLike = async () => {
      try {
        let storedCountLike = localStorage.getItem(`countLike_${userId}`);
        storedCountLike = storedCountLike ? JSON.parse(storedCountLike) : [];

        const likeCounts = await Promise.all(
          foto.map(async (photo) => {
            const countResult = await axios.get(`http://127.0.0.1:8000/api/most/${photo.foto_id}/like`);
            return { foto_id: photo.foto_id, count: countResult.data.count };
          })
        );

        // console.log("Received like counts:", likeCounts);

        setCountLike(likeCounts);
        localStorage.setItem(`countLike_${userId}`, JSON.stringify(likeCounts));
      } catch (error) {
        console.log(error);
      }
    };

    getCountLike();
  }, [foto]);

  useEffect(() => {
    if (user) {
      setUser_Id(user.user_id);
    }

    const userId = user ? user.user_id : null;

    const storedLikedPhotos = localStorage.getItem(`likedPhotos_${userId}`);
    const storedTotalLike = localStorage.getItem(`totalLike_${userId}`);

    try {
      setLike({
        likedPhotos: JSON.parse(storedLikedPhotos) || [],
        totalLike: parseInt(storedTotalLike) || 0,
      });
    } catch (error) {
      // console.error("Error parsing liked photos from localStorage:", error);
      setLike({ likedPhotos: [], totalLike: 0 });
      setCountLike([]);
    }

    setTanggal_Komentar(getCurrentDate());

    // const fetchData = async () => {
    //   try {
    //     const photoResponse = await axios.get("http://127.0.0.1:8000/api/get-data/foto");
    //     const likedPhotosResponse = await axios.get(`http://127.0.0.1:8000/api/like/get-liked-photos/${user.user_id}`);
    //     const likedPhotoIds = likedPhotosResponse.data.map((like) => like.foto_id);

    //     const likedPhotos = photoResponse.data.results.filter((photo) => likedPhotoIds.includes(photo.foto_id));

    //     setFoto(likedPhotos);
    //   } catch (error) {
    //     setError('An error occurred. Please check your database connection or other issues.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchData();

    const gethData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/get-data/foto");
        setFoto(response.data.results);
      } catch (error) {
        setError('Terjadi kesalahan mohon periksa sambungan database atau dll!');
      } finally {
        const timeoutId = setTimeout(() => {
          setLoading(false);
      }, 6000);
      }
    };

    gethData();

    const getComment = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/get-data/komentar");

        const organizedComments = {};
    response.data.results.forEach((komentar) => {
      const fotoId = komentar.foto_id;
      if (!organizedComments[fotoId]) {
        organizedComments[fotoId] = [];
      }
      organizedComments[fotoId].push(komentar);
    });
    setComment(organizedComments);
      } catch (error) {
        setError('Terjadi kesalahan mohon periksa sambungan database atau dll!');
      } finally {
        setLoading(false);
      }
    };

    getComment();

  }, [user]);

const handleComment = (fotoId) => {
  setFoto((prevFoto) => {
    return prevFoto.map((foto) => {
      if (foto.foto_id === fotoId) {
        return { ...foto, showCommentInput: !foto.showCommentInput };
      } else {
        return { ...foto, showCommentInput: false };
      }
    });
  });
};

  const handleSearchChange = (value) => {
    setSearchInput(value);

    if (searchInput.trim() === '') {
      setShowSlider(true);
    } else {
      setShowSlider(false);
    }
  };

  const filteredFoto = foto.filter(foto =>
    (foto.judul_foto && foto.judul_foto.toLowerCase().includes(searchInput.toLowerCase())) ||
    (foto.judul_foto && foto.judul_foto.toLowerCase().includes(searchInput.toLowerCase()))
  );

  const handleSubComment = async (e, fotoId) => {
    e.preventDefault();
    setLoadingComment(true);

    const formData = new FormData();
    formData.append("foto_id", fotoId);
    formData.append("isi_komentar", inputText[fotoId]);
    formData.append("user_id", user_id);
    formData.append("tanggal_komentar", tanggal_komentar);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/komentar/post-komentar`, formData);

      setComment((prevComments) => {
        const updatedComments = { ...prevComments };
        if (updatedComments[fotoId]) {
          const existingComment = updatedComments[fotoId].find(
            (comment) => comment.komentar_id === response.data.komentar_id
          );
      
          if (!existingComment) {
            updatedComments[fotoId].push({
              user_id,
              tanggal_komentar,
              nama_lengkap: user?.nama_lengkap,
              isi_komentar: inputText[fotoId],
            });
          }
        } else {
          updatedComments[fotoId] = [
            {
              user_id,
              tanggal_komentar,
              isi_komentar: inputText[fotoId],
            },
          ];
        }
        return updatedComments;
      });

      setInputText(prevInputText => ({ ...prevInputText, [fotoId]: '' }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: 'Komentar anda gagal simpan, error:' + error,
        showConfirmButton: true,
      })
    }finally{
      setLoadingComment(false);
    }
  }

  const OpenModal = (fotoId) => {
    setSelectedFotoId(fotoId);
    setShowModal(true);
  };

  const handleLike = async (photoId, userId) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/like/post-like", { photoId, user_id: userId });
      const updatedLikedPhotos = response.data.liked
        ? [...(like?.likedPhotos || []), photoId]
        : (like?.likedPhotos || []).filter((id) => id !== photoId);

      const updatedTotalLike = isNaN(like.totalLike) ? 0 : like.totalLike + (response.data.liked ? 1 : -1);

      setLike((prevLike) => ({
        ...prevLike,
        likedPhotos: updatedLikedPhotos,
        totalLike: updatedTotalLike,
      }));

      const countResult = await axios.get(`http://127.0.0.1:8000/api/most/${photoId}/like`);
      const updatedLikeCounts = countLike.map((likeInfo) =>
        likeInfo.foto_id === photoId ? { foto_id: photoId, count: countResult.data.count } : likeInfo
      );

      setCountLike(updatedLikeCounts);

      localStorage.setItem(`likedPhotos_${userId}`, JSON.stringify(updatedLikedPhotos));
      localStorage.setItem(`totalLike_${userId}`, updatedTotalLike.toString());
      localStorage.setItem(`countLike_${userId}`, JSON.stringify(updatedLikeCounts));
    } catch (error) {
      console.error(error);
    }
  };

  const isLiked = (photoId) => {
    // console.log("Like State in isLiked:", like);
    // console.log("Liked Photos in isLiked:", like?.likedPhotos);
    return like && like.likedPhotos && like.likedPhotos.includes(photoId);
  };

  return (
    <>
      <SideNav onSearchChange={handleSearchChange}>
      <div className="loading-spinner-container full-screen-loader" style={{ display: loading ? 'flex' : 'none' }}>
                    <div className="card shadow">
                        <div className="card-body" style={{ display: 'flex' }}>
                            <FallingLines
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
        <Modal show={showModal} onHide={CloseModal} size="lg" scrollable>
          <Modal.Header closeButton>
            <Modal.Title style={{ textAlign: 'center' }}>Komentar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="row d-flex justify-content-center">
              {selectedFotoId && comment[selectedFotoId] && (
                <div class="col-md-8 col-lg-12">
                  {comment[selectedFotoId].map((komentar) => (
                    <div class="card-body" key={komentar.komentar_id}>
                      <div class="card mb-3">
                        <div class="card-body">
                          <div class="d-flex justify-content-between border-bottom">
                            <div class="d-flex flex-row align-items-center">
                              {/* <img src={`http://127.0.0.1:8000/storage/${komentar.profil_foto}`} alt="avatar" className=""
                                height="25" /> */}
                              <p class="small mb-0 ms-2">{komentar.nama_lengkap}</p>
                            </div>
                            <div class="d-flex flex-row align-items-center">
                              <p class="small text-muted mb-0">{komentar.tanggal_komentar}</p>
                            </div>
                          </div>
                          <p className="mt-3">{komentar.isi_komentar}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal.Body>
          <hr />
            <form onSubmit={(e) => handleSubComment(e, selectedFotoId)} className="row p-3">
              <div className="col-md-11">
              <input type="text" onChange={(e) => setUser_Id(e.target.value)} hidden name="" value={selectedFotoId} id="" />
                <input
                  type="text"
                  onChange={(e) => setInputText((prevInputText) => ({ ...prevInputText, [selectedFotoId]: e.target.value }))}
                  value={inputText[selectedFotoId] || ''}
                  className="form-control ml-3"
                  placeholder="Add a comment..."
                  style={{borderRadius: '30px'}}
                />
              </div>
              <input type="number" hidden readOnly value={user_id} onChange={(e) => setUser_Id(e.target.value)} className="form-control ml-3" />
              <input type="date" hidden onChange={(e) => setTanggal_Komentar(e.target.value)} value={tanggal_komentar} className="form-control ml-3" />
              <div className="col-md-1">
                <button type="submit" className="btn btn-success"><i className="fas fa-paper-plane"></i></button>
              </div>
            </form>
        </Modal>
        <div style={{ marginTop: "10px", minHeight: "100vh" }}>
          {showSlider && (
            <Slider />
            )}
            <TagsAlbum />
          <div className="card-body">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4">
              {filteredFoto.map((foto, index) => (
                <div key={foto.foto_id} className="col mb-3">
                  <div className="card">
                    <div className="card-body">
                      {foto.lokasi_file && (
                        <LazyLoadImage
                          alt={`Foto ${index}`}
                          height="100%"
                          width="100%"
                          effect="blur"
                          src={`http://127.0.0.1:8000/storage/${foto.lokasi_file}`}
                        />
                      )}
                    </div>
                    <div className="align-items-center" style={{ display: 'flex' }}>
                      <button
                        className="btn btn-light fas fa-heart"
                        style={{
                          color: isLiked(foto.foto_id) ? 'red' : 'black',
                          marginLeft: '10px'
                        }}
                        onClick={() => handleLike(foto.foto_id, user.user_id)}
                      >
                      </button>
                      <div className="mt-3">
                        {countLike.map((likeInfo) => (
                          likeInfo.foto_id === foto.foto_id && (
                            <p key={likeInfo.foto_id} className="ml-2">{likeInfo.count}</p>
                          )
                        ))}
                      </div>
                      <button className="btn fas fa-comment" onClick={() => OpenModal(foto.foto_id)}>
                      </button>
                      {/* <button className="btn fas fa-comment" onClick={() => handleComment(foto.foto_id)}>
                      </button> */}
                      <h6 className="text-center mt-2" style={{ fontSize: 'small' }}>{foto.judul_foto}</h6>
                    </div>
                  </div>

                  {/* {foto.showCommentInput && (
                    <div className="row mt-2" style={{ display: 'flex' }} key={foto.foto_id}>
                      <form onSubmit={(e) => handleSubComment(e, foto.foto_id)}>
                        <input type="text" onChange={(e) => setUser_Id(e.target.value)} hidden name="" value={foto.foto_id} id="" />
                        <div className="col-6">
                          <input
                            type="text"
                            onChange={(e) => setInputText((prevInputText) => ({ ...prevInputText, [foto.foto_id]: e.target.value }))}
                            value={inputText[foto.foto_id] || ''}
                            className="form-control ml-3"
                            placeholder="Add a comment..."
                          />
                        </div>
                        <input type="number" hidden readOnly value={user_id} onChange={(e) => setUser_Id(e.target.value)} className="form-control ml-3" />
                        <input type="date" hidden onChange={(e) => setTanggal_Komentar(e.target.value)} value={tanggal_komentar} className="form-control ml-3" />
                        <div className="col-4">
                          <button type="submit" className="btn btn-primary ml-2">Submit</button>
                        </div>
                      </form>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </SideNav>

    </>
  )
}
