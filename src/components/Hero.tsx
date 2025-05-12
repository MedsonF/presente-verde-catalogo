
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-green">
              Lista de Presentes
            </h1>
            <p className="mt-6 text-lg text-gray-700 max-w-2xl">
              Bem-vindo ao nosso catálogo de presentes! Aqui você encontra itens cuidadosamente selecionados
              para nossa lista de presentes. Escolha o item que deseja presentear e acompanhe seu status em tempo real.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/categoria/eletrodomesticos" className="btn-primary flex items-center justify-center">
                Ver Catálogo
              </Link>
              <Link to="/galeria" className="btn-secondary flex items-center justify-center">
                Ver Galeria
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Lista de presentes"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-cream rounded-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-green/10 rounded-lg -z-10"></div>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-green mb-6">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-serif font-medium mb-3">Escolha um Presente</h3>
              <p className="text-gray-700">
                Navegue pelo catálogo e escolha o item que gostaria de presentear.
                Você pode filtrar por categorias ou utilizar a busca.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-serif font-medium mb-3">Efetue o Pagamento</h3>
              <p className="text-gray-700">
                Escolha entre pagamento à vista via PIX ou parcelado.
                Os links são externos e seguros.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-serif font-medium mb-3">Pronto!</h3>
              <p className="text-gray-700">
                Após a confirmação do pagamento, o item será marcado como escolhido
                e reservado em seu nome.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
