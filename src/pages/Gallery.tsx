
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/PhotoGallery";

// Mock photo data
const mockPhotos = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Sala de Estar Decorada"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Cozinha Americana"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Quarto Principal"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Banheiro Suíte"
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Varanda Gourmet"
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1551298698-66b830a4f11c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Home Office"
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Decoração da Sala"
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Cozinha Detalhes"
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Quarto de Hóspedes"
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Sala de Jantar"
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Área de Lazer"
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    title: "Detalhes de Decoração"
  },
];

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center">Galeria de Fotos</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Conheça um pouco mais sobre nosso novo lar através dessa galeria de fotos.
            Clique nas imagens para visualizá-las em tela cheia.
          </p>
          
          <PhotoGallery photos={mockPhotos} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
