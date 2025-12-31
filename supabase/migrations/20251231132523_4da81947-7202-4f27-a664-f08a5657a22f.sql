-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger for new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, stock, featured) VALUES
('Premium Leather Bag', 'Handcrafted Italian leather messenger bag with brass hardware', 299.00, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', 'Bags', 15, true),
('Minimalist Watch', 'Swiss movement with sapphire crystal and leather strap', 450.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Accessories', 20, true),
('Wireless Headphones', 'Active noise cancellation with 30-hour battery life', 349.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics', 30, true),
('Cashmere Sweater', 'Premium Mongolian cashmere in classic fit', 195.00, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', 'Clothing', 25, true),
('Ceramic Vase', 'Hand-thrown artisan ceramic with matte finish', 89.00, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800', 'Home', 40, false),
('Sunglasses', 'Polarized lenses with titanium frame', 275.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 'Accessories', 35, true),
('Running Shoes', 'Lightweight performance sneakers with responsive cushioning', 180.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Footwear', 50, false),
('Coffee Maker', 'Precision temperature control pour-over system', 199.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 'Home', 20, false);