
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-green text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif mb-4 text-white">Catálogo de Presentes</h3>
            <p className="text-green-100">
              Encontre o presente perfeito para todas as ocasiões.
              Nossa lista de presentes é cuidadosamente selecionada para
              garantir qualidade e satisfação.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-serif mb-4 text-white">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/categoria/eletrodomesticos" className="text-green-100 hover:text-white transition-colors">
                  Eletrodomésticos
                </Link>
              </li>
              <li>
                <Link to="/categoria/decoracao" className="text-green-100 hover:text-white transition-colors">
                  Decoração
                </Link>
              </li>
              <li>
                <Link to="/categoria/itens-divertidos" className="text-green-100 hover:text-white transition-colors">
                  Itens Divertidos
                </Link>
              </li>
              <li>
                <Link to="/categoria/cozinha" className="text-green-100 hover:text-white transition-colors">
                  Cozinha
                </Link>
              </li>
              <li>
                <Link to="/categoria/moveis" className="text-green-100 hover:text-white transition-colors">
                  Móveis
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-serif mb-4 text-white">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="text-green-100 hover:text-white transition-colors">
                  Galeria
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-green-100 hover:text-white transition-colors">
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-400 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-green-100">&copy; {year} Catálogo de Presentes. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-green-100 hover:text-white">
              Política de Privacidade
            </a>
            <a href="#" className="text-green-100 hover:text-white">
              Termos de Serviço
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
