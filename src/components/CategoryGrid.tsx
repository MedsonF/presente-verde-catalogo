
import { Link } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  itemCount: number;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Eletrodomésticos",
    image: "https://images.unsplash.com/photo-1574269910231-bc508bcb68ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    slug: "eletrodomesticos",
    itemCount: 15
  },
  {
    id: "2",
    name: "Decoração",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    slug: "decoracao",
    itemCount: 24
  },
  {
    id: "3",
    name: "Itens Divertidos",
    image: "https://images.unsplash.com/photo-1500632525123-0908dd452efa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    slug: "itens-divertidos",
    itemCount: 10
  },
  {
    id: "4",
    name: "Cozinha",
    image: "https://images.unsplash.com/photo-1556909114-44e3e9699e2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    slug: "cozinha",
    itemCount: 18
  },
  {
    id: "5",
    name: "Móveis",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    slug: "moveis",
    itemCount: 12
  },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="section">
      <h2 className="text-3xl font-serif font-bold text-center mb-12">Categorias</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categoria/${category.slug}`}
            className="relative group overflow-hidden rounded-lg shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-serif font-semibold text-white">{category.name}</h3>
              <p className="text-sm text-white/80">{category.itemCount} itens disponíveis</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
