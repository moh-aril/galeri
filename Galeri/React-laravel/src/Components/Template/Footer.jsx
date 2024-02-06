import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Footer() {
    return (
        <>
            <footer className=" bg-danger shadow text-white flex p-2" style={{width: "100%",textAlign: 'center',width: '100%',bottom: '0',marginBottom: 'auto'}}>
                <div className="row text-center">
                    <div className="col-md-4 mt-3">
                        <div className="container">
                            <p>&copy; 2024 ArEm Galeri</p>
                        </div>
                    </div>
                    <div className="col-md-4 mt-3" style={{display: 'flex',alignItems: 'center'}}>
                        <h5></h5><br /><h4></h4>
                    </div>
                    <div className="col-md-4" style={{marginRight:'auto',display:'flex'}}>
                        <p className="mt-3">Social Media Developer:</p>
                        <button id="facebook" className="btn text-primary"><i style={{fontWeight: 'bold',fontSize: 'larger'}} className="fab fa-facebook"></i></button>
                        <button id="twitter" className="btn text-info"><i style={{fontWeight: 'bold',fontSize: 'larger'}} className="fab fa-twitter"></i></button>
                        <button id="instagram" className="btn text-warning"><i style={{fontWeight: 'bold',fontSize: 'larger'}} className="fab fa-instagram"></i></button>
                    </div>
                </div>
            </footer>
        </>
    )
}