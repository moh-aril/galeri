import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Homepage from './Components/Homepage';
import Registerpage from './Components/Registerpage';
import Loginpage from './Components/Loginpage';
import TambahUser from './Components/Admin/TambahUser';
import EditUser from './Components/Admin/EditUser';
import Foto from './Components/Foto';
import ListFoto from './Components/ListFoto';
import EditFoto from './Components/EditFoto';
import Album from './Components/Album';
import EditAlbum from './Components/EditAlbum';
import DataKomentar from './Components/Admin/DataKomentar';
import SideNav from './Components/Template/SideNav';
import DataUser from './Components/Admin/DataUser';
import AlbumTags from './Components/User/AlbumTags';
import { AuthProvider } from './Components/Context/AuthContext';
import Profile from './Components/User/Profile';

const App = () => {
  return (
    <>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Loginpage />}/>
          <Route path='/beranda' element={<Homepage />}/>
          <Route path='/register-user' element={<Registerpage />}/>
          <Route path='/login-user' element={<Loginpage />}/>
          <Route path='/list/data/user' element={<DataUser />}/>
          <Route path='/tambah-user' element={<TambahUser />}/>
          <Route path='/user-edit/:user_id' element={<EditUser />}/>
          <Route path='/user/profile' element={<Profile />}/>
          
          <Route path='/list/data/foto' element={<ListFoto />}/>
          <Route path='/list/data/komentar' element={<DataKomentar />}/>
          <Route path='/upload/foto' element={<Foto />}/>
          <Route path='/edit/edit-foto/:foto_id' element={<EditFoto />}/>
          <Route path='/data/album' element={<Album />}/>
          <Route path='/album/edit/:album_id' element={<EditAlbum />}/>
          <Route path='/album/:album_id' element={<AlbumTags />}/>

          <Route path='/sidebar' element={<SideNav />}/>
        </Routes>
      </Router>
      </AuthProvider>
    </>
  )
}

export default App;
