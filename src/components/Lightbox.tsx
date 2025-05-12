
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  titles?: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  titles = [],
  currentIndex: initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigateToImage("prev");
      } else if (e.key === "ArrowRight") {
        navigateToImage("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const navigateToImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-0 right-0 m-4 p-1 bg-black/50 rounded-full text-white hover:bg-black/80"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="relative w-full flex justify-center items-center">
          <button
            className="absolute left-0 p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
            onClick={(e) => {
              e.stopPropagation();
              navigateToImage("prev");
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <img
            src={images[currentIndex]}
            alt={titles[currentIndex] || `Image ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-full object-contain"
          />
          <button
            className="absolute right-0 p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
            onClick={(e) => {
              e.stopPropagation();
              navigateToImage("next");
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        {titles[currentIndex] && (
          <div className="text-white text-center mt-4 p-2 bg-black/50 rounded">
            <p>{titles[currentIndex]}</p>
          </div>
        )}
        <div className="text-white text-sm mt-2">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
