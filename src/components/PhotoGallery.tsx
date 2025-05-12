
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = "auto";
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
      setSelectedPhoto(photos[currentIndex === 0 ? photos.length - 1 : currentIndex - 1]);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
      setSelectedPhoto(photos[currentIndex === photos.length - 1 ? 0 : currentIndex + 1]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      navigatePhoto("prev");
    } else if (e.key === "ArrowRight") {
      navigatePhoto("next");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => openLightbox(photo, index)}
          >
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            className="relative max-w-4xl max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-0 right-0 m-4 p-1 bg-black/50 rounded-full text-white hover:bg-black/80"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>
            <div className="relative w-full flex justify-center items-center">
              <button
                className="absolute left-0 p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto("prev");
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[80vh] max-w-full object-contain"
              />
              <button
                className="absolute right-0 p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto("next");
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            {selectedPhoto.title && (
              <div className="text-white text-center mt-4 p-2 bg-black/50 rounded">
                <p>{selectedPhoto.title}</p>
              </div>
            )}
            <div className="text-white text-sm mt-2">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
