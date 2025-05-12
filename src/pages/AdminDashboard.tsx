import { useEffect, useState, useRef } from "react";
import { fileToBase64, supabase } from "@/integrations/supabase/client";
import { giftToItemProps, itemPropsToGift } from "@/utils/dataTransformers";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  PlusCircle,
  Edit,
  Trash,
  LogOut,
  CheckCircle,
  Menu,
  X
} from "lucide-react";
import { toast } from "sonner";
import { ItemProps } from "@/components/ItemCard";

// Mock data from previous components
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
];

// Mock categories for dropdown selection
const categories = [
  "Eletrodomésticos",
  "Decoração",
  "Itens Divertidos",
  "Cozinha",
  "Móveis",
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [items, setItems] = useState<ItemProps[]>([]);
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: "Catálogo de Presentes",
    homeDescription: "Bem-vindo ao nosso catálogo de presentes! Aqui você encontra itens cuidadosamente selecionados para nossa lista de presentes.",
    primaryColor: "#305027",
    backgroundColor: "#FAFAF5",
  });
  const [editingItem, setEditingItem] = useState<ItemProps | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, number>>({});
  const [categoryNameMap, setCategoryNameMap] = useState<Record<number, string>>({});

  // Authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) {
          console.error('Error loading categories:', categoriesError);
          toast.error('Erro ao carregar categorias');
          return;
        }

        if (categoriesData) {
          const catNames = categoriesData.map(cat => cat.name);
          setCategories(catNames);
          
          // Create maps for easy lookup
          const catMap: Record<string, number> = {};
          const nameMap: Record<number, string> = {};
          categoriesData.forEach(cat => {
            catMap[cat.name] = cat.id;
            nameMap[cat.id] = cat.name;
          });
          setCategoryMap(catMap);
          setCategoryNameMap(nameMap);
        }

        // Fetch items
        const { data: itemsData, error: itemsError } = await supabase
          .from('gifts')
          .select('*');

        if (itemsError) {
          toast.error('Erro ao carregar itens: ' + itemsError.message);
          return;
        }

        // Transform the data
        const transformedItems = itemsData.map(gift => ({
          ...giftToItemProps(gift),
          category: gift.category_id ? categoryNameMap[gift.category_id] || 'Sem categoria' : 'Sem categoria'
        }));
        
        setItems(transformedItems);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro inesperado ao carregar dados.');
      }
    };

    fetchData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    toast.success("Logout realizado com sucesso!");
    navigate("/admin/login");
  };

  // Calculate dashboard statistics
  const totalItems = items.length;
  const availableItems = items.filter(item => item.available).length;
  const chosenItems = items.filter(item => !item.available).length;
  
  // Item form state - Include image handling
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    image: "",
    image_base64: "",
    category: "",
    available: true,
    pixLink: "",
    installmentLink: "",
  });

  // Handle image selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedImage(file);
    
    try {
      // Create image preview
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setFormData(prev => ({
        ...prev,
        image_base64: base64,
      }));
    } catch (error) {
      console.error('Error converting image to base64:', error);
      toast.error('Erro ao processar a imagem.');
    }
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle site settings form change
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add or update an item
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        // Update existing item in Supabase
        const { error } = await supabase
          .from('gifts')
          .update({
            ...itemPropsToGift({
              ...formData,
              category: formData.category ? categoryMap[formData.category].toString() : '0',
            }),
            category_id: formData.category ? categoryMap[formData.category] : null,
          })
          .eq('id', editingItem.id);

        if (error) {
          toast.error(`Erro ao atualizar item: ${error.message}`);
          return;
        }
        
        toast.success("Item atualizado com sucesso!");
      } else {
        // Add new item to Supabase
        const { error } = await supabase
          .from('gifts')
          .insert({
            ...itemPropsToGift({
              ...formData,
              category: formData.category ? categoryMap[formData.category].toString() : '0',
            }),
            category_id: formData.category ? categoryMap[formData.category] : null,
          });

        if (error) {
          toast.error(`Erro ao adicionar item: ${error.message}`);
          return;
        }
        
        toast.success("Item adicionado com sucesso!");
      }
      
      // Refresh items from database
      const { data, error } = await supabase
        .from('gifts')
        .select('*');
      
      if (error) {
        toast.error(`Erro ao atualizar lista: ${error.message}`);
      } else if (data) {
        const transformedItems = data.map(gift => ({
          ...giftToItemProps(gift),
          category: gift.category_id ? categoryNameMap[gift.category_id] || 'Sem categoria' : 'Sem categoria'
        }));
        setItems(transformedItems);
      }
      
      // Reset form
      setFormData({
        id: "",
        title: "",
        description: "",
        price: 0,
        image: "",
        image_base64: "",
        category: categories[0] || "",
        available: true,
        pixLink: "",
        installmentLink: "",
      });
      setSelectedImage(null);
      setImagePreview("");
      setEditingItem(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao salvar item.');
    }
  };

  // Handle item deletion
  const handleDeleteItem = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        const { error } = await supabase
          .from('gifts')
          .delete()
          .eq('id', id);
          
        if (error) {
          toast.error(`Erro ao excluir item: ${error.message}`);
          return;
        }
        
        // Update local state
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.success("Item excluído com sucesso!");
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro inesperado ao excluir item.');
      }
    }
  };

  // Edit an item
  const handleEditItem = (item: ItemProps) => {
    // Fill form with item data
    setFormData({
      ...item,
      pixLink: item.pixLink || "",
      installmentLink: item.installmentLink || "",
      image_base64: item.image_base64 || "",
    });
    
    // Set image preview if available
    if (item.image_base64) {
      setImagePreview(item.image_base64);
    } else if (item.image) {
      setImagePreview(item.image);
    }
    
    setEditingItem(item);
    setActiveTab("items");
    
    // Scroll to form
    const formElement = document.getElementById("itemForm");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Toggle item availability
  const handleToggleAvailability = async (id: string) => {
    try {
      // Find the current item
      const item = items.find(item => item.id === id);
      if (!item) return;
      
      // Update in Supabase
      const { error } = await supabase
        .from('gifts')
        .update({ is_chosen: item.available })
        .eq('id', id);
        
      if (error) {
        toast.error(`Erro ao atualizar status: ${error.message}`);
        return;
      }
      
      // Update local state
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, available: !item.available } : item
        )
      );
      
      toast.success("Status do item atualizado!");
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro inesperado ao atualizar status.');
    }
  };

  // Save site settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Configurações do site salvas com sucesso!");
    
    // In a real app, this would update the configuration in the backend
  };

  // Render dashboard tab
  const renderDashboard = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Total de Itens</h3>
          <p className="text-3xl font-bold text-green">{totalItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Itens Disponíveis</h3>
          <p className="text-3xl font-bold text-green">{availableItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Itens Escolhidos</h3>
          <p className="text-3xl font-bold text-green">{chosenItems}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4 text-gray-700">Atividade Recente</h3>
        <div className="space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <p className="font-medium">Novo item adicionado: Cafeteira Elétrica</p>
            <p className="text-sm text-gray-500">Hoje, 14:32</p>
          </div>
          <div className="pb-4 border-b border-gray-200">
            <p className="font-medium">Item marcado como escolhido: Jogo de Cama Queen</p>
            <p className="text-sm text-gray-500">Ontem, 10:15</p>
          </div>
          <div className="pb-4 border-b border-gray-200">
            <p className="font-medium">Configurações do site atualizadas</p>
            <p className="text-sm text-gray-500">3 dias atrás, 16:27</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render items tab - Update to include image upload
  const renderItems = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Gerenciar Itens</h2>
      
      <form id="itemForm" onSubmit={handleItemSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-medium mb-4 text-green">
          {editingItem ? "Editar Item" : "Adicionar Novo Item"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem (opcional se enviar arquivo)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>
        </div>
        
        {/* New Image Upload Field */}
        <div className="mb-4">
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">
            Enviar Imagem
          </label>
          <input
            type="file"
            id="imageUpload"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Pré-visualização:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-40 object-contain border rounded"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setSelectedImage(null);
                  setFormData(prev => ({ ...prev, image_base64: "" }));
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="text-sm text-red-600 mt-1"
              >
                Remover imagem
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="pixLink" className="block text-sm font-medium text-gray-700 mb-1">
              Link de Pagamento PIX
            </label>
            <input
              type="url"
              id="pixLink"
              name="pixLink"
              value={formData.pixLink}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="installmentLink" className="block text-sm font-medium text-gray-700 mb-1">
              Link de Pagamento Parcelado
            </label>
            <input
              type="url"
              id="installmentLink"
              name="installmentLink"
              value={formData.installmentLink}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
            className="h-4 w-4 text-green focus:ring-green border-gray-300 rounded"
          />
          <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
            Item disponível
          </label>
        </div>
        
        <div className="flex justify-end">
          {editingItem && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  id: "",
                  title: "",
                  description: "",
                  price: 0,
                  image: "",
                  image_base64: "",
                  category: categories[0] || "",
                  available: true,
                  pixLink: "",
                  installmentLink: "",
                });
                setImagePreview("");
                setSelectedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="mr-4 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="py-2 px-4 bg-green text-white rounded-md hover:bg-green-600"
          >
            {editingItem ? "Atualizar Item" : "Adicionar Item"}
          </button>
        </div>
      </form>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4 text-green">Lista de Itens</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" 
                             src={item.image_base64 || item.image} 
                             alt={item.title} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'}`}
                    >
                      {item.available ? 'Disponível' : 'Escolhido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`${item.available ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                        title={item.available ? 'Marcar como escolhido' : 'Marcar como disponível'}
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render settings tab
  const renderSettings = () => (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Configurações do Site</h2>
      
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-4 text-green">Personalização do Site</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Título do Site
            </label>
            <input
              type="text"
              id="siteTitle"
              name="siteTitle"
              value={siteSettings.siteTitle}
              onChange={handleSettingsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
              Cor Principal (Verde)
            </label>
            <div className="flex">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                value={siteSettings.primaryColor}
                onChange={handleSettingsChange}
                className="w-12 h-10 p-0 border-0"
              />
              <input
                type="text"
                value={siteSettings.primaryColor}
                onChange={handleSettingsChange}
                name="primaryColor"
                className="ml-2 flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="homeDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição da Página Inicial
          </label>
          <textarea
            id="homeDescription"
            name="homeDescription"
            rows={4}
            value={siteSettings.homeDescription}
            onChange={handleSettingsChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
            Cor de Fundo (Bege)
          </label>
          <div className="flex">
            <input
              type="color"
              id="backgroundColor"
              name="backgroundColor"
              value={siteSettings.backgroundColor}
              onChange={handleSettingsChange}
              className="w-12 h-10 p-0 border-0"
            />
            <input
              type="text"
              value={siteSettings.backgroundColor}
              onChange={handleSettingsChange}
              name="backgroundColor"
              className="ml-2 flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-green text-white rounded-md hover:bg-green-600"
          >
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar (desktop) */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:h-screen bg-green text-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-serif font-bold">Área Administrativa</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "dashboard" ? "bg-white text-green" : "text-white hover:bg-green-dark"
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "items" ? "bg-white text-green" : "text-white hover:bg-green-dark"
                }`}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Gerenciar Itens
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "settings" ? "bg-white text-green" : "text-white hover:bg-green-dark"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Configurações
              </button>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-green-800 p-4">
            <button
              onClick={handleLogout}
              className="flex-1 group flex items-center px-4 py-2 text-sm font-medium rounded-md text-white hover:bg-green-dark"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between bg-green text-white p-4 w-full">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mr-2 p-2 rounded-md text-white hover:bg-green-dark"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-serif font-bold">Área Administrativa</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md text-white hover:bg-green-dark"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 z-10 bg-green text-white shadow-lg">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "dashboard" ? "bg-white text-green" : "text-white hover:bg-green-dark"
                }`}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("items");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "items" ? "bg-white text-green" : "text-white hover:bg-green-dark"
                }`}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Gerenciar Itens
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === "settings" ? "bg-white text-green" : "text-white hover:bg-green-dark"
                }`}
              >
                <Settings className="mr-3 h-5 w-5" />
                Configurações
              </button>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="md:ml-64 flex-1">
          <div className="py-6 md:pt-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-16 md:mt-6">
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "items" && renderItems()}
              {activeTab === "settings" && renderSettings()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
