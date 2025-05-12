
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-serif font-bold text-green">Lista de Presentes</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-green transition-colors">
                Home
              </Link>
              <Link to="/categoria/todos" className="text-gray-700 hover:text-green transition-colors">
                Catálogo
              </Link>
              {/* Link da galeria removido */}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="py-2 text-gray-700 hover:text-green transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/categoria/todos" className="py-2 text-gray-700 hover:text-green transition-colors" onClick={() => setIsMenuOpen(false)}>
                Catálogo
              </Link>
              {/* Link da galeria removido */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
