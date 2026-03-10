import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/posService";
import { getCachedProducts } from "../services/offlineService";
import { CATEGORIES } from "../data/mockProducts";
import { usePOSStore } from "../store/posStore";

export function useProducts() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const isOnline = usePOSStore((s) => s.isOnline);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ["pos-products", isOnline],
    queryFn: async () => {
      if (!isOnline) {
        const cached = await getCachedProducts();
        return cached.length > 0 ? cached : [];
      }
      return getProducts();
    },
    staleTime: isOnline ? 5 * 60 * 1000 : Infinity,
  });

  const filtered = useMemo(() => {
    let list = allProducts;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      );
    }
    return list;
  }, [allProducts, search, activeCategory]);

  return {
    products: filtered,
    allProducts,
    isLoading,
    isFromCache: !isOnline,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    categories: CATEGORIES,
  };
}
