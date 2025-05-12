
import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  categories,
  onCategoryChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green focus:border-green"
            placeholder="Buscar itens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            type="submit"
            className="w-full md:w-auto btn-primary px-6"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange("")}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedCategory === ""
              ? "bg-green text-white"
              : "bg-green-100 text-green hover:bg-green-200"
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedCategory === category
                ? "bg-green text-white"
                : "bg-green-100 text-green hover:bg-green-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
