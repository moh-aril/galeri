import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from "react";
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

const SideNav = ({ onSearchChange, children }) => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const mainRef = useRef();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleSearchChange = (value) => {
        setSearchInput(value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearchChange(e.target.elements.searchInput.value);
    };
    const toggleSidebar = () => {
        if (window.innerWidth <= 992) {
          setSidebarOpen(!sidebarOpen);
        } else {
          setSidebarOpen(!sidebarOpen);
          setResponsiveMainWidth();
        }
      };

      const setResponsiveMainWidth = () => {
        const mainElement = document.querySelector(".col-md-10");
        if (mainElement) {
          mainElement.classList.toggle("col-lg-12");
          mainElement.classList.toggle("col-lg-10");
        }
      };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const closeMenu = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", setResponsiveMainWidth);

        return () => {
          window.removeEventListener("resize", setResponsiveMainWidth);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/logout-user');
            logout();
            Swal.fire({
                icon: "success",
                title: "Logout Success",
                text: "Tunggu 2 detik untuk keluar",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '/'
            });
        } catch (error) {
            console.log("error:" + error);
        }
    };

    const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

    return (
        <div className="container-fluid">
            <div className="row">
                <nav id='sidebar' className={`col-md-2 d-none d-md-block sidebar bg-light card navbar-light ${sidebarOpen ? 'show' : ''}`}>
                    <div className="sidebar-sticky">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className='mt-3' style={{ marginLeft: "20px" }}><h3>Galeri ArEm</h3></span>
                            <hr style={{ borderTop: "'2px solid #333", marginTop: '20px', marginBottom: '20px' }} />
                        </div>
                        <a href="/beranda" className="nav-link"><i className="fas fa-home"></i> Beranda</a>
                        <a href="/data/album" className="nav-link"><i className="fas fa-folder-open"></i> Data Album</a>
                        <a href="/list/data/foto" className="nav-link"><i className="fas fa-image"></i> Data Foto</a>
                        <a href="/list/data/komentar" className="nav-link"><i className="fas fa-comment"></i> Data Komentar</a>
                        <a href="/list/data/user" className="nav-link"><i className="fas fa-user"></i> Data User</a>
                    </div>
                </nav>

                <main ref={mainRef} role="main" className={`col-md-10 ml-sm-auto px-md-4 ${sidebarOpen ? 'col-lg-12' : 'col-lg-10'}`}>
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom navbar shadow">
                        <button className="btn text-secondary btn-lg" onClick={toggleSidebar}>
                            {sidebarOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
                        </button>
                        <form className="d-flex m-auto col-md-4 search-bar-img" onSubmit={handleSearch}>
                            <input
                                className="form-control me-1 col-lg-12 max-w-max"
                                style={{ width: "100%", padding: "10px" }}
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                name="searchInput"
                            />
                            <button className="btn btn-secondary" type="submit">
                                <i className="fas fa-search"></i>
                            </button>
                        </form>

                        <div className="navbar-nav ms-auto" style={{ marginRight: '15px' }}>
                            <div className="nav-item dropdown" ref={menuRef}>
                                <button
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    onClick={toggleMenu}
                                >
                                    {user ? (
                                        <img
                                            src={`http://127.0.0.1:8000/storage/${user.profil_foto}`}
                                            className="rounded-circle me-2"
                                            height="25"
                                            width="25"
                                            alt="User"
                                        />
                                    ) : (
                                        <img
                                            src="../Image/profile_null.png"
                                            className="rounded-circle me-2"
                                            height="25"
                                            alt="User"
                                        />
                                    )}
                                    {user && <h6 className="mt-1">{user?.nama_lengkap}</h6>}
                                </button>

                                {isMenuOpen && (
                                    <ul className="dropdown-menu" style={{ display: 'block', position: 'absolute',marginRight: '10px' }}>
                                        <li>
                                            <a className="dropdown-item" href="/user/profile">
                                                My profile
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                Settings
                                            </a>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SideNav;
