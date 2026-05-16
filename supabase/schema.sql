-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    kyc_status TEXT DEFAULT 'not_submitted' CHECK (kyc_status IN ('not_submitted', 'pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Packages table
CREATE TABLE public.packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Package items table
CREATE TABLE public.package_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.packages(id),
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    payment_method TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT,
    paymongo_source_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC documents table
CREATE TABLE public.kyc_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('valid_id', 'selfie', 'business_permit')),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default packages
INSERT INTO public.packages (name, description, price) VALUES
('Basic Protection', 'Essential security package for small spaces', 20000.00),
('Standard Protection', 'Comprehensive security for homes', 21000.00),
('Advanced Response', 'Premium security with rapid response', 22000.00),
('Enterprise Security', 'Full-scale security solution for businesses', 25000.00);

-- Insert package items
INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Basic Protection' LIMIT 1),
    '1x Alert System',
    1
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Basic Protection');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Basic Protection' LIMIT 1),
    '1x CCTV Camera',
    1
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Basic Protection');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Standard Protection' LIMIT 1),
    '1x Alert System',
    1
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Standard Protection');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Standard Protection' LIMIT 1),
    '2x CCTV Camera',
    2
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Standard Protection');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Standard Protection' LIMIT 1),
    '1x Alert Button',
    1
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Standard Protection');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Advanced Response' LIMIT 1),
    '1x Alert System',
    1
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Advanced Response');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Advanced Response' LIMIT 1),
    '2x CCTV Camera',
    2
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Advanced Response');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Advanced Response' LIMIT 1),
    '2x Alert Button',
    2
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Advanced Response');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Enterprise Security' LIMIT 1),
    '2x Alert System',
    2
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Enterprise Security');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Enterprise Security' LIMIT 1),
    '4x CCTV Camera',
    4
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Enterprise Security');

INSERT INTO public.package_items (package_id, item_name, quantity) 
SELECT 
    (SELECT id FROM public.packages WHERE name = 'Enterprise Security' LIMIT 1),
    '4x Alert Button',
    4
WHERE EXISTS (SELECT 1 FROM public.packages WHERE name = 'Enterprise Security');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_kyc_status ON public.users(kyc_status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX idx_kyc_documents_status ON public.kyc_documents(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Packages table policies (public read access)
CREATE POLICY "Anyone can view packages" ON public.packages
    FOR SELECT USING (true);

-- Package items table policies (public read access)
CREATE POLICY "Anyone can view package items" ON public.package_items
    FOR SELECT USING (true);

-- Orders table policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments table policies
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- KYC documents table policies
CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC documents" ON public.kyc_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can upload own KYC documents" ON public.kyc_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update KYC documents" ON public.kyc_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
