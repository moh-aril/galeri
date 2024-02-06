import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import SideNav from "../Template/SideNav";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Profile = () => {
    const { user } = useAuth();
    const [onlyOneUser, setOnlyOneUser] = useState([]);

    const userId = user ? user.user_id : undefined;

    useEffect(() => {
        const getDataFotoUser = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/users/get-foto-user/${userId}`);
                setOnlyOneUser(response.data.results);

                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }

        getDataFotoUser();
    }, [userId]);
    return (
        <>
            <SideNav>
                <section class="h-100 gradient-custom-2">
                    <div class="container h-100">
                        <div class="row d-flex justify-content-center align-items-center h-100">
                            <div class="col col-lg-">
                                <div class="card">
                                    {user ? (
                                        <div class="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                                            <div class="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                                <img src={`http://127.0.0.1:8000/storage/${user.profil_foto}`}
                                                    alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2"
                                                    style={{ width: '150px', zIndex: '1' }} />
                                                <button type="button" onClick={() => window.location.href = `/edit/profile/user/${user.user_id}`} class="btn btn-outline-dark" data-mdb-ripple-color="dark"
                                                    style={{ zIndex: '1' }}>
                                                    Edit profile
                                                </button>
                                            </div>
                                            <div class="ms-3" style={{ marginTop: '130px' }}>
                                                <h5>{user.nama_lengkap}</h5>
                                                <p>{user.alamat}</p>
                                            </div>

                                        </div>
                                    ) : (
                                        <div class="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                                            <div class="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                                <img src={`http://127.0.0.1:8000/storage/`}
                                                    alt="Generic placeholder image" class="img-fluid img-thumbnail mt-4 mb-2"
                                                    style={{ width: '150px', zIndex: '1' }} />
                                                <button type="button" class="btn btn-outline-dark" data-mdb-ripple-color="dark"
                                                    style={{ zIndex: '1' }}>
                                                    Edit profile
                                                </button>
                                            </div>
                                            <div class="ms-3" style={{ marginTop: '130px' }}>
                                                <h5>guest</h5>
                                                <p>Unknown??</p>
                                            </div>

                                        </div>
                                    )}
                                    <div class="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                        <div class="d-flex justify-content-end text-center py-1">
                                            <div>
                                                <p class="mb-1 h5">253</p>
                                                <p class="small text-muted mb-0">Photos</p>
                                            </div>
                                            <div class="px-3">
                                                <p class="mb-1 h5">1026</p>
                                                <p class="small text-muted mb-0">Followers</p>
                                            </div>
                                            <div>
                                                <p class="mb-1 h5">478</p>
                                                <p class="small text-muted mb-0">Following</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body p-4 text-black">
                                        {/* <div class="mb-5">
                                            <p class="lead fw-normal mb-1">About</p>
                                            <div class="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                                                <p class="font-italic mb-1">Web Developer</p>
                                                <p class="font-italic mb-1">Lives in New York</p>
                                                <p class="font-italic mb-0">Photographer</p>
                                            </div>
                                        </div> */}
                                        <div class="d-flex justify-content-between align-items-center mb-4">
                                            <p class="lead fw-normal mb-0">Foto yang dikirim</p>
                                            <p class="mb-0"><a href="#!" class="text-muted">Show all</a></p>
                                        </div>

                                        {onlyOneUser.length > 0 ? (
                                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                                                {onlyOneUser.map((profile, index) => (
                                                    <div className="col mb-3" key={profile.album_id}>
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <LazyLoadImage
                                                                    alt={`Profile ${index}`}
                                                                    height="100%"
                                                                    width="100%"
                                                                    effect="blur"
                                                                    src={`http://127.0.0.1:8000/storage/${profile.lokasi_file}`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="card">
                                                <div className="card-body p-5">
                                                    <p className="text-center">Anda belum meupload foto apapun</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </SideNav>
        </>
    )
}
export default Profile;