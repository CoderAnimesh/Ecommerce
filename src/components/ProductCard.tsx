import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link to={`/products/${product.id}`}>
        <div className="card-elevated">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <motion.img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Overlay Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-foreground/10 flex items-end justify-center pb-6"
            >
              <motion.button
                onClick={handleAddToCart}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.1 }}
                className="btn-gold flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </motion.button>
            </motion.div>

            {/* Wishlist Button */}
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg"
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground'}`} 
              />
            </motion.button>

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="font-semibold text-lg">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
