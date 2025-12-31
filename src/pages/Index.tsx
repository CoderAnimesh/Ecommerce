import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/database';

export default function Index() {
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
      if (error) throw error;
      return data as Product[];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-accent font-medium tracking-widest uppercase mb-6"
            >
              New Collection 2024
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-8"
            >
              Discover the Art of{' '}
              <span className="text-gradient">Luxury Living</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Curated collections of premium goods, handcrafted with precision 
              and designed for those who appreciate the finer things.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold text-lg px-8 py-4 flex items-center gap-2"
                >
                  Shop Collection
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-outline-gold text-lg px-8 py-4"
                >
                  Explore More
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-foreground/30 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-accent font-medium tracking-widest uppercase mb-2">Featured</p>
              <h2 className="text-4xl font-serif font-bold">Curated Selection</h2>
            </div>
            <Link 
              to="/products"
              className="hidden sm:flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <Link 
            to="/products"
            className="sm:hidden mt-8 flex items-center justify-center gap-2 text-foreground font-medium hover:text-accent transition-colors"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-accent font-medium tracking-widest uppercase mb-2">Categories</p>
            <h2 className="text-4xl font-serif font-bold">Shop by Category</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
              { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800' },
              { name: 'Home', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products?category=${category.name}`}>
                  <div className="relative h-80 rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-2xl font-serif font-semibold text-primary-foreground">{category.name}</h3>
                      <p className="text-primary-foreground/80 mt-1 flex items-center gap-2 group-hover:gap-3 transition-all">
                        Shop Now <ArrowRight className="h-4 w-4" />
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Free Shipping', description: 'On all orders over $150' },
              { title: 'Premium Quality', description: 'Handcrafted with care' },
              { title: 'Easy Returns', description: '30-day return policy' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-accent" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
