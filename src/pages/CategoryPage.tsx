import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ItemCard, { ItemProps } from "@/components/ItemCard";
import SearchBar from "@/components/SearchBar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { giftToItemProps } from "@/utils/dataTransformers";

// Mock data
const mockItems: ItemProps[] = [
  {
    id: "1",
    title: "Cafeteira Elétrica",
    description: "Cafeteira programável com 12 xícaras de capacidade e design moderno.",
    price: 389.9,
    image: "https://images.unsplash.com/photo-1570286424717-95227fd779dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Eletrodomésticos",
    available: true,
    pixLink: "https://example.com/payment/pix/1",
    installmentLink: "https://example.com/payment/installment/1"
  },
  {
    id: "2",
    title: "Kit de Panelas Antiaderentes",
    description: "Kit com 5 panelas antiaderentes de alta qualidade, ideal para o dia a dia.",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1584284421546-77934e76948a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Cozinha",
    available: true,
    pixLink: "https://example.com/payment/pix/2",
    installmentLink: "https://example.com/payment/installment/2"
  },
  {
    id: "3",
    title: "Jogo de Cama Queen",
    description: "Jogo de cama 100% algodão egípcio com 500 fios, extremamente macio e resistente.",
    price: 459.90,
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Decoração",
    available: false,
    pixLink: "https://example.com/payment/pix/3",
    installmentLink: "https://example.com/payment/installment/3"
  },
  {
    id: "4",
    title: "Liquidificador Ultra Power",
    description: "Liquidificador de alta potência com múltiplas velocidades e jarra de vidro resistente.",
    price: 229.90,
    image: "https://images.unsplash.com/photo-1631461933582-c4617f1c9bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Eletrodomésticos",
    available: true,
    pixLink: "https://example.com/payment/pix/4"
  },
  {
    id: "5",
    title: "Almofadas Decorativas",
    description: "Conjunto de 3 almofadas decorativas com cores vibrantes e tecido premium.",
    price: 169.90,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Decoração",
    available: true,
    pixLink: "https://example.com/payment/pix/5",
    installmentLink: "https://example.com/payment/installment/5"
  },
  {
    id: "6",
    title: "Jogos de Mesa Divertidos",
    description: "Kit com 3 jogos de mesa para diversão em família e amigos.",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1500632525123-0908dd452efa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Itens Divertidos",
    available: true,
    pixLink: "https://example.com/payment/pix/6"
  },
  {
    id: "7",
    title: "Mesa de Jantar",
    description: "Mesa de jantar extensível para 6 a 8 pessoas em madeira maciça.",
    price: 1899.90,
    image: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Móveis",
    available: true,
    pixLink: "https://example.com/payment/pix/7",
    installmentLink: "https://example.com/payment/installment/7"
  },
  {
    id: "8",
    title: "Microondas Digital",
    description: "Microondas 30L com painel digital e múltiplas funções de preparo.",
    price: 649.90,
    image: "https://images.unsplash.com/photo-1574269910231-bc508bcb68ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Eletrodomésticos",
    available: false,
    pixLink: "https://example.com/payment/pix/8",
    installmentLink: "https://example.com/payment/installment/8"
  },
  {
    id: "9",
    title: "Ar Condicionado Split",
    description: "Ar condicionado split 12000 BTUs com controle remoto e função eco.",
    price: 2199.90,
    image: "https://images.unsplash.com/photo-1606653573912-ba1c4b97c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Eletrodomésticos",
    available: true,
    pixLink: "https://example.com/payment/pix/9",
    installmentLink: "https://example.com/payment/installment/9"
  },
  {
    id: "10",
    title: "Sofá Retrátil",
    description: "Sofá retrátil de 3 lugares em tecido suede com encosto reclinável.",
    price: 2899.90,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Móveis",
    available: true,
    pixLink: "https://example.com/payment/pix/10",
    installmentLink: "https://example.com/payment/installment/10"
  },
  {
    id: "11",
    title: "Conjunto de Toalhas",
    description: "Conjunto com 4 toalhas de banho e 4 toalhas de rosto em algodão egípcio.",
    price: 299.90,
    image: "https://images.unsplash.com/photo-1600184726475-94d3c5a34ae2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Decoração",
    available: true,
    pixLink: "https://example.com/payment/pix/11"
  },
  {
    id: "12",
    title: "Jogo de Talheres 24 peças",
    description: "Jogo de talheres em aço inox com 24 peças e suporte elegante.",
    price: 279.90,
    image: "https://images.unsplash.com/photo-1546874177-9e664107314e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    category: "Cozinha",
    available: false,
    pixLink: "https://example.com/payment/pix/12",
    installmentLink: "https://example.com/payment/installment/12"
  },
];

// Create more mock items for infinite scroll
const generateMoreItems = (startId: number, category: string, count: number) => {
  const items: ItemProps[] = [];
  for (let i = 0; i < count; i++) {
    const id = startId + i;
    items.push({
      id: id.toString(),
      title: `Item ${id} - ${category}`,
      description: `Este é um exemplo de item para a categoria ${category}. 
                   Descrição detalhada do produto com informações sobre funcionalidades, 
                   dimensões, materiais e outras informações relevantes.`,
      price: 99.9 + (id * 10),
      image: `https://picsum.photos/seed/${id}/800/600`,
      category,
      available: id % 3 !== 0, // Every 3rd item will be unavailable
      pixLink: `https://example.com/payment/pix/${id}`,
      ...(id % 2 === 0 && { installmentLink: `https://example.com/payment/installment/${id}` })
    });
  }
  return items;
};

// Update the component to use Supabase data
const CategoryPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [items, setItems] = useState<ItemProps[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Get all available categories
  const [categories, setCategories] = useState<string[]>([]);

  // Get the proper category name from the slug
  const getCategoryNameFromSlug = (slug: string) => {
    const categoryMap: Record<string, string> = {
      'eletrodomesticos': 'Eletrodomésticos',
      'decoracao': 'Decoração',
      'itens-divertidos': 'Itens Divertidos',
      'cozinha': 'Cozinha',
      'moveis': 'Móveis',
      'todos': ''
    };
    
    return categoryMap[slug] || '';
  };

  const categoryName = getCategoryNameFromSlug(slug);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('name');

        if (categoriesError) {
          console.error('Error loading categories:', categoriesError);
          toast.error('Erro ao carregar categorias');
          return;
        }

        if (categoriesData) {
          setCategories(categoriesData.map(cat => cat.name));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchItems = async () => {
      try {
        setLoading(true);
        let query = supabase.from('gifts').select('*');

        // If a specific category is selected
        if (slug && slug !== 'todos') {
          const categoryName = getCategoryNameFromSlug(slug);
          const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single();

          if (categoryData) {
            query = query.eq('category_id', categoryData.id);
          }
        }

        const { data, error } = await query;

        if (error) {
          toast.error('Erro ao carregar itens: ' + error.message);
          setLoading(false);
          return;
        }

        // Transform the data
        const transformedItems = data.map(giftToItemProps);
        
        setItems(transformedItems);
        setFilteredItems(transformedItems);
        setHasMore(false); // No infinite scroll with real data
        setLoading(false);

      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Erro inesperado ao carregar itens.');
        setLoading(false);
      }
    };

    fetchCategories();
    fetchItems();
    
    // Reset search and filter when category changes
    setSearchQuery("");
    setSelectedCategory("");
    setPage(1);
  }, [slug]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterItems(query, selectedCategory);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterItems(searchQuery, category);
  };

  // Filter items based on search query and category
  const filterItems = (query: string, category: string) => {
    let filtered = items;
    
    if (query) {
      const queryLowerCase = query.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(queryLowerCase) || 
        item.description.toLowerCase().includes(queryLowerCase)
      );
    }
    
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    setFilteredItems(filtered);
    setPage(1);
    setHasMore(true);
  };

  // Load more items when scrolling
  const loadMoreItems = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      const newItems = generateMoreItems(
        items.length + 1, 
        categoryName || categories[Math.floor(Math.random() * categories.length)], 
        8
      );
      
      setItems(prev => [...prev, ...newItems]);
      setHasMore(page < 5); // Limit to 5 pages for mock data
      setPage(prev => prev + 1);
      setLoading(false);
      
      // Update filtered items if needed
      if (!searchQuery && !selectedCategory) {
        setFilteredItems(prev => [...prev, ...newItems]);
      }
    }, 1000);
  }, [loading, page, items.length, categories, categoryName, searchQuery, selectedCategory]);

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading) return;
    
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    
    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        loadMoreItems();
      }
    }, options);
    
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, loadMoreItems]);

  // Helper to get title based on category
  const getPageTitle = () => {
    if (slug && slug !== 'todos') {
      return `Categoria: ${categoryName}`;
    }
    return "Todos os Itens";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="section">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">{getPageTitle()}</h1>
          
          <SearchBar 
            onSearch={handleSearch}
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
          
          {filteredItems.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Nenhum item encontrado com os filtros selecionados.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  filterItems("", "");
                }} 
                className="mt-4 btn-secondary"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="infinite-scroll-container">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
          
          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
            </div>
          )}
          
          {/* Loading reference element for infinite scroll */}
          {hasMore && <div ref={loadingRef} className="h-4 w-full"></div>}
          
          {!hasMore && filteredItems.length > 0 && (
            <p className="text-center text-gray-500 mt-8">Não há mais itens para carregar</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
