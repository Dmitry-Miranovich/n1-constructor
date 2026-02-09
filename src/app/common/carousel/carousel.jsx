import { useState, useEffect, useRef } from "react";
import "./carousel.scss";

const Carousel = ({ images, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);

  const goToNextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleDragStart = (e) => {
    setIsAutoPlaying(false);
    setIsDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    setStartPos(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const currentDrag = clientX - startPos;
    setDragOffset(currentDrag);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const threshold = 50;
    if (dragOffset < -threshold) {
      goToNextSlide();
    } else if (dragOffset > threshold) {
      goToPrevSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
    if (autoPlay) setIsAutoPlaying(true);
  };

  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;
    const timer = setInterval(goToNextSlide, interval);
    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying, isDragging]);

  const transformStyle = {
    transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
    transition: isDragging ? "none" : "transform 0.5s ease-out",
  };

  return (
    <div
      className={`carousel-container ${isDragging ? "dragging" : ""}`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <button
        className="carousel-container-button prev"
        onClick={goToPrevSlide}
      >
        ‹
      </button>
      <div
        className="carousel-container-slides"
        style={transformStyle}
        ref={containerRef}
      >
        {images.map((image, index) => (
          <div
            className="carousel-container-slides-item"
            key={`carousel-container-slides-item-${index}`}
          >
            {image.src && (
              <img src={image.src} alt={`Slide ${index}`} draggable="false" />
            )}
          </div>
        ))}
      </div>

      <button
        className="carousel-container-button next"
        onClick={goToNextSlide}
      >
        ›
      </button>
    </div>
  );
};

export default Carousel;
