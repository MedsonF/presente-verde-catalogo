
import { useState } from "react";
import { ExternalLink } from "lucide-react";

export interface ItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  pixLink?: string;
  installmentLink?: string;
}

interface ItemCardProps {
  item: ItemProps;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md transition-all ${!item.available ? 'item-unavailable' : ''}`}>
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full aspect-[4/3] object-cover"
        />
        {!item.available && (
          <div className="item-unavailable-overlay">
            <span>Indisponível</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-serif font-medium text-green mb-2 line-clamp-1">{item.title}</h3>
        
        <div className="mb-3">
          <div className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-2'}`}>
            {item.description}
          </div>
          {item.description.length > 100 && (
            <button
              onClick={toggleDescription}
              className="text-sm text-green hover:text-green-dark mt-1 font-medium"
            >
              {isExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 mb-3">
          <span className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
          <span className="text-xs px-2 py-1 bg-green-100 text-green rounded-full">
            {item.category}
          </span>
        </div>

        {item.available ? (
          <div className="space-y-2">
            {item.pixLink && (
              <a
                href={item.pixLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex justify-center items-center gap-2"
              >
                Pagamento PIX <ExternalLink size={16} />
              </a>
            )}
            {item.installmentLink && (
              <a
                href={item.installmentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full flex justify-center items-center gap-2"
              >
                Pagamento Parcelado <ExternalLink size={16} />
              </a>
            )}
          </div>
        ) : (
          <button disabled className="btn-disabled w-full">Item escolhido</button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
