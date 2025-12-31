import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import CartDrawer from './CartDrawer';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();

  const navLinks = [
    { name: 'Shop', href: '/products' },
    { name: 'New Arrivals', href: '/products?featured=true' },
    { name: 'Categories', href: '/products' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.span 
                className="text-2xl font-serif font-bold tracking-tight"
                whileHover={{ scale: 1.02 }}
              >
                LUXE
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5" />
              </Button>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/orders">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Orders
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="text-sm"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" className="hidden sm:block">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <motion.button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-lg font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link 
                      to="/orders" 
                      className="block text-lg font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button 
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="block text-lg font-medium py-2 text-destructive"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    className="block text-lg font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
