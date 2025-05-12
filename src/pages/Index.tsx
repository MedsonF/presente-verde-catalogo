
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { giftToItemProps } from "@/utils/dataTransformers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import { ItemProps } from "@/components/ItemCard";

const Index = () => {
  const [featuredItems, setFeaturedItems] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('gifts')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) {
          toast.error('Erro ao carregar itens: ' + error.message);
          return;
        }

        // Transform the data to the format expected by ItemCard
        const items = data.map(giftToItemProps);
        setFeaturedItems(items);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast.error('Erro inesperado ao carregar itens.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CategoryGrid />
        
        {loading ? (
          <div className="section text-center">
            <div className="animate-spin h-8 w-8 border-4 border-green border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando itens...</p>
          </div>
        ) : (
          <>
            {featuredItems.length > 0 && (
              <section className="section bg-cream">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl font-serif font-bold mb-6 text-center">Itens Recentes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredItems.map(item => (
                      <div key={item.id} className="flex flex-col">
                        <img 
                          src={item.image_base64 || item.image} 
                          alt={item.title}
                          className="w-full aspect-[4/3] object-cover rounded-lg shadow-md mb-3"
                        />
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
        
        <section className="section bg-cream">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">Nossa Lista de Presentes</h2>
            <p className="text-lg text-gray-700 mb-8">
              Estamos muito felizes em compartilhar esse momento especial com você. 
              Nossa lista de presentes foi cuidadosamente selecionada pensando em itens 
              que realmente farão diferença em nossa nova fase.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Você pode escolher qualquer item disponível e efetuar o pagamento de forma 
              segura através dos links fornecidos. Agradecemos imensamente sua participação!
            </p>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Presente" 
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-serif font-medium mb-3 text-green">Como escolho um presente?</h3>
                <p className="text-gray-700">
                  Basta navegar pelo catálogo, escolher o item desejado e clicar no botão
                  de pagamento correspondente. Após a confirmação, o item será marcado como escolhido.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-serif font-medium mb-3 text-green">Posso pagar parcelado?</h3>
                <p className="text-gray-700">
                  Sim! Oferecemos duas opções de pagamento: PIX (à vista) ou 
                  pagamento parcelado via cartão de crédito.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-serif font-medium mb-3 text-green">Como saber se o item já foi escolhido?</h3>
                <p className="text-gray-700">
                  Itens já escolhidos são exibidos com menor opacidade e possuem uma indicação
                  clara de "Indisponível". Apenas itens disponíveis podem ser selecionados.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-serif font-medium mb-3 text-green">Quem recebe o pagamento?</h3>
                <p className="text-gray-700">
                  O pagamento é direcionado diretamente para os anfitriões da lista de presentes.
                  Os links são externos e seguros, gerenciados pelos próprios anfitriões.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
