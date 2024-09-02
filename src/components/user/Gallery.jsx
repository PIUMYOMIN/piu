import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from "react-modal";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { Link } from "react-router-dom";

Modal.setAppElement("#root");

export default function Gallery() {
  const [galleries, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("https://dashboard.piueducation.org/api/v1/gallery");

        if (!response.ok) {
          throw new Error("message", "Failed to fetch gallery.");
        }

        const data = await response.json();
        setGallery(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const maxImages = 9;
  const limitedGalleries = galleries.slice(0, maxImages);

  const openModal = index => {
    setCurrentImageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return !loading ? <div className="max-w-7xl mx-auto font-robotoSlab lg:py-8 overflow-hidden md:px-2">
        <div className="max-w-7xl mx-auto font-montserrat">
          <div className="lg:grid grid-cols-2 gap-5 lg:py-8 px-2">
            <div className="lg:pr-2" data-aos="fade-up">
              <div className="lg:text-4xl text-2xl my-3 font-oswald font-medium">
                About
              </div>
              <div className="my-3">
                <p className="lg:text-justify text-base">
                  As the education in Myanmar is lasting behind so do every aspect of Myanmar. Therefore, it is desperately needed to lift the status of education in Myanmar. We can see that the countries which have internationally high ranking universities become well developed ones in the world. To establish quality assurance university qualify teachers and eligible students are needed. As Myanmar has been deteriorating for many years qualify teachers are very difficult to have. So, no eligible students become. I have been facing this broken process of education system for over a decade. Good quality university students have to become from good quality basic education level students i.e primary, secondary, and tertiary. <Link to="/about-us" className="text-gray-500 hover:text-gray-300">
                    Continue Reading ...
                  </Link>
                </p>
              </div>
            </div>
            <div data-aos="fade-up">
              <ResponsiveMasonry columnsCountBreakPoints={{ 750: 2, 900: 3 }}>
                <Masonry>
                  {limitedGalleries.map((gallery, index) =>
                    <img
                      src={`https://dashboard.piueducation.org/storage/${gallery.image}`}
                      alt={gallery.image_tag}
                      key={index}
                      className="cursor-pointer"
                      onClick={() => openModal(index)}
                    />
                  )}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          </div>
        </div>
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Image Carousel Modal" style={{ content: { top: "50%", left: "50%", right: "auto", bottom: "auto", marginRight: "-50%", transform: "translate(-50%, -50%)", backgroundColor: "black", overflow: "hidden", color: "white", border: "none", padding: "0", maxWidth: "90%", maxHeight: "90%" }, overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" } }}>
          <button onClick={closeModal} style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
            Close
          </button>
          <Carousel selectedItem={currentImageIndex} showThumbs={false} infiniteLoop useKeyboardArrows dynamicHeight>
            {galleries.map((gallery, index) =>
              <div className="bg-blue-500" key={index}>
                <img
                  src={`https://dashboard.piueducation.org/storage/${gallery.image}`}
                  alt={gallery.image_tag}
                />
                <p className="image_tag">
                  {gallery.image_tag}
                </p>
              </div>
            )}
          </Carousel>
        </Modal>
      </div> : <LoadingSpinner />;
}
