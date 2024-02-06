import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./Context/AuthContext";

const Loginpage = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/users/login-user", credentials);
      const { user } = response.data;
      login(user);
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: `Selamat Datang ${user.nama_lengkap}`,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        window.location.href = "/beranda";
      });
      setError("");
    } catch (error) {
      console.error('Login Error:', error);
      setError("Invalid credentials. Please check your username, email, and password.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <div className="container p-5" style={{ alignContent: 'center', justifyContent: 'center', margin: 'auto',marginTop: '80px' }}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card col-md-5" style={{ margin: 'auto' }}>
          <div className="card-header">
            <div className="card-title text-center"><h5>Selamat Datang</h5></div>
            <p className="text-center">Please enter username and password!</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleLogin}>
              <div className="form-group row mt-2">
                {/* <label htmlFor="username" className="col-sm-4 form-label">Username</label> */}
                <div className="col-sm-12 form-floating">
                  <input
                    style={{ height: '50px', borderRadius: '30px', borderColor: 'purple' }}
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="Username...."
                    value={credentials.username}
                    onChange={handleInputChange}
                  />
                  <label style={{marginLeft: '20px'}} htmlFor="" className="form-label">Username</label>
                </div>
              </div>

              <div className="form-group row mt-2">
                {/* <label htmlFor="password" className="form-label col-sm-4">Password</label> */}
                <div className="col-sm-12 form-floating">
                  <input
                    style={{ height: '50px', borderRadius: '30px', borderColor: 'purple' }}
                    type="password"
                    className="form-control"
                    placeholder="Password...."
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleInputChange}
                  />
                  <label style={{marginLeft: '20px'}} htmlFor="" className="form-label">Password</label>
                </div>
              </div>

              <div className="row mt-4 col-md-8 m-auto">
                <button type="submit" className="btn btn-success m-auto btn-block shadow" style={{borderRadius: '30px'}} disabled={loading}>
                  <FontAwesomeIcon icon={faSignInAlt} /> {loading ? "Loading..." : "Sign In"}
                </button>
              </div>
            </form>
            <hr />
            <p className="mt-3 text-center"><h6>Dont have account? <a href="/register-user"> Register</a></h6></p>
          </div>
        </div>
      </div>
    </>
  );
}
export default Loginpage;