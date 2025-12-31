import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const featuredParam = searchParams.get('featured');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, featuredParam],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      if (featuredParam === 'true') {
        query = query.eq('featured', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    }
  });

  const categories = ['All', 'Accessories', 'Bags', 'Clothing', 'Electronics', 'Footwear', 'Home'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              {featuredParam === 'true' ? 'New Arrivals' : 'All Products'}
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our curated collection of premium goods
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  (category === 'All' && !selectedCategory) || 
                  category === selectedCategory 
                    ? 'default' 
                    : 'outline'
                }
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                className={
                  (category === 'All' && !selectedCategory) || category === selectedCategory
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                    : ''
                }
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-elevated animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-5 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No products found</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
