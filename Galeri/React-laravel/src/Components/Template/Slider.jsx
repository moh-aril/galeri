import axios from "axios";
import { useState, useEffect } from "react";

const Slider = () => {
    const [foto, setFoto] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNewFoto = async () => {
            try {
              const response = await axios.get('http://127.0.0.1:8000/api/new-foto/slider');
              setFoto(response.data);
              setLoading(false);
            } catch (error) {
              console.error('Error fetching images:', error);
              setLoading(false);
            }
          };
    
        getNewFoto();
      }, []);

    return (
        <>
        <section className="" style={{marginBottom: '20px'}}>
            {loading ? (
        <p>Loading...</p>
      ) : (
        <div id="myCarousel" className="carousel slide" style={{maxWidth: '80rem',height:'30rem',margin:'auto'}} data-ride="carousel">
          <div className="carousel-inner" style={{ borderRadius: '8px',height:'100%' }}>
            {foto.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img
                  style={{ borderRadius: '8px',width: '100%',height:'100%',objectFit: 'cover' }}
                  src={`http://127.0.0.1:8000/storage/${image.lokasi_file}`}
                  alt={`Slide ${index + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      )}
      </section>
    </>
  );
};

export default Slider;