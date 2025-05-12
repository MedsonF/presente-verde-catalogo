
import { Database } from "@/integrations/supabase/types";
import { ItemProps } from "@/components/ItemCard";

// Convert a Supabase gift item to the format expected by ItemCard
export const giftToItemProps = (gift: Database['public']['Tables']['gifts']['Row']): ItemProps => {
  return {
    id: gift.id.toString(),
    title: gift.title,
    description: gift.description,
    price: Number(gift.price),
    image: gift.image_url,
    image_base64: gift.image_base64 || undefined,
    category: gift.category_id ? gift.category_id.toString() : "Sem categoria",
    available: !gift.is_chosen,
    pixLink: gift.payment_link_1,
    installmentLink: gift.payment_link_2 || undefined
  };
};

// Convert the ItemProps format to the format expected by Supabase
export const itemPropsToGift = (item: ItemProps): Partial<Database['public']['Tables']['gifts']['Insert']> => {
  return {
    title: item.title,
    description: item.description,
    price: item.price,
    image_url: item.image,
    image_base64: item.image_base64,
    category_id: item.category ? Number(item.category) : null,
    is_chosen: !item.available,
    payment_link_1: item.pixLink || '',
    payment_link_2: item.installmentLink,
  };
};
