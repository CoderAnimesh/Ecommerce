import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Heart, Minus, Plus, Check, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id
  });

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-20 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-serif">Product not found</h1>
          <Button onClick={() => navigate('/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <motion.img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  layoutId={`product-image-${product.id}`}
                />
              </div>
              {product.featured && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-6 left-6"
                >
                  <span className="px-4 py-2 text-sm font-semibold bg-accent text-accent-foreground rounded-full">
                    Featured
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <p className="text-accent font-medium tracking-widest uppercase mb-2">
                {product.category}
              </p>
              
              <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
                {product.name}
              </h1>

              <p className="text-3xl font-semibold mb-6">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
                <span className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-3 px-4 py-2 border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 btn-gold flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-5 w-5" />
                        Added!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 border-2 border-border rounded-lg hover:border-accent transition-colors"
                >
                  <Heart 
                    className={`h-6 w-6 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} 
                  />
                </motion.button>
              </div>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-border space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $150</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-muted-foreground">Easy returns and exchanges</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
