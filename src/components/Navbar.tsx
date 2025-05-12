
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User } from "lucide-react";

const categories = [
  { name: "Eletrodomésticos", path: "/categoria/eletrodomesticos" },
  { name: "Decoração", path: "/categoria/decoracao" },
  { name: "Itens Divertidos", path: "/categoria/itens-divertidos" },
  { name: "Cozinha", path: "/categoria/cozinha" },
  { name: "Móveis", path: "/categoria/moveis" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-beige border-b border-green/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-green font-serif text-xl md:text-2xl font-semibold">Catálogo de Presentes</h1>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="text-gray-700 hover:text-green border-transparent hover:border-green inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-green focus:outline-none"
            >
              <Search size={20} />
            </button>
            <Link to="/galeria" className="hidden md:block text-gray-700 hover:text-green px-3 py-2 text-sm font-medium">
              Galeria
            </Link>
            <Link to="/admin/login" className="hidden md:flex items-center text-gray-700 hover:text-green px-3 py-2 text-sm font-medium">
              <User size={18} className="mr-1" />
              Admin
            </Link>
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green focus:outline-none"
              >
                <span className="sr-only">Abrir menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-gray-700 hover:bg-green-100 hover:text-green block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              to="/galeria"
              className="text-gray-700 hover:bg-green-100 hover:text-green block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Galeria
            </Link>
            <Link
              to="/admin/login"
              className="text-gray-700 hover:bg-green-100 hover:text-green block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Área Administrativa
            </Link>
          </div>
        </div>
      )}
      
      {/* Search bar */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-beige border-b border-green/10 p-4 shadow-md">
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green focus:border-green"
                placeholder="Buscar itens..."
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
