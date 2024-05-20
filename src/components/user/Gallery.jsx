import React, { useState, useEffect } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Modal from "react-modal";
import LoadingSpinner from "../../components/user/LoadingSpinner";

Modal.setAppElement("#root");

export default function Gallery() {
  const [galleries, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("https://piueducation.org/api/v1/gallery");

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

  return !loading
    ? <div className="w-full bg-dark-purple text-white lg:py-8 overflow-hidden md:px-2">
        <div className="max-w-7xl mx-auto font-montserrat">
          <div className="lg:grid grid-cols-2 gap-5 lg:py-8 px-2">
            <div className="pr-2" data-aos="fade-up">
              <div className="lg:text-4xl text-2xl text-center mb-3 font-oswald font-medium">
                About
              </div>
              <p className="lg:text-justify">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum,
                dignissimos, iste in, autem unde explicabo voluptatibus
                cupiditate sit fugiat libero quia iure amet cum. Placeat
                corrupti reprehenderit tempora voluptas veniam deleniti magni
                quo, nostrum numquam mollitia quos sequi, quasi aliquid nam
                necessitatibus possimus quia debitis iure hic nihil! Soluta
                alias ex atque dolores voluptatum, possimus tenetur expedita
                quibusdam non commodi fugit architecto velit accusantium
                officiis ab exercitationem dolor est, cumque aperiam ducimus
                modi dolorem dignissimos. Natus temporibus repudiandae quae vel
                ut at mollitia magni earum quod perferendis hic quibusdam ipsam
                aliquid odio necessitatibus, laboriosam ea dolorum quasi quidem
                corporis repellat?
              </p>
            </div>
            <div data-aos="fade-up">
              <ResponsiveMasonry columnsCountBreakPoints={{ 750: 2, 900: 3 }}>
                <Masonry>
                  {limitedGalleries.map((gallery, index) =>
                    <img
                      src={`https://piueducation.org/storage/${gallery.image}`}
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
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Carousel Modal"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "black",
              overflow: "hidden",
              color: "white",
              border: "none",
              padding: "0",
              maxWidth: "90%",
              maxHeight: "90%"
            },
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" }
          }}
        >
          <button
            onClick={closeModal}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
          >
            Close
          </button>
          <Carousel
            selectedItem={currentImageIndex}
            showThumbs={false}
            infiniteLoop
            useKeyboardArrows
            dynamicHeight
          >
            {galleries.map((gallery, index) =>
              <div className="bg-blue-500" key={index}>
                <img
                  src={`https://piueducation.org/storage/${gallery.image}`}
                  alt={gallery.image_tag}
                />
                <p className="image_tag">
                  {gallery.image_tag}
                </p>
              </div>
            )}
          </Carousel>
        </Modal>
      </div>
    : <LoadingSpinner />;
}
