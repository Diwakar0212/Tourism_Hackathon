-- SafeSolo Database Schema for Supabase
-- Run this in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_risk_tolerance AS ENUM ('low', 'medium', 'high');
CREATE TYPE user_travel_experience AS ENUM ('beginner', 'intermediate', 'expert');
CREATE TYPE trip_status AS ENUM ('planning', 'active', 'completed', 'cancelled');
CREATE TYPE safety_status AS ENUM ('safe', 'caution', 'warning', 'danger');
CREATE TYPE alert_type AS ENUM ('weather', 'security', 'health', 'transport', 'other');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE assistant_type AS ENUM ('safety', 'planner', 'cultural', 'emergency');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Travel-specific fields
    travel_preferences JSONB DEFAULT '{}',
    emergency_contacts JSONB DEFAULT '[]',
    risk_tolerance user_risk_tolerance DEFAULT 'medium',
    travel_experience user_travel_experience DEFAULT 'beginner',
    
    -- Admin fields
    is_admin BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user'
);

-- Trips table
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    destination JSONB NOT NULL, -- {city, country, coordinates, etc}
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(10,2),
    status trip_status DEFAULT 'planning',
    itinerary JSONB DEFAULT '[]',
    safety_status safety_status DEFAULT 'safe',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    location JSONB NOT NULL, -- {city, country, coordinates, address}
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    duration INTEGER NOT NULL, -- in minutes
    max_participants INTEGER DEFAULT 1,
    safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 10),
    provider_id UUID, -- Reference to provider (future feature)
    images TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safety alerts table
CREATE TABLE public.safety_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location JSONB NOT NULL, -- {city, country, coordinates}
    alert_type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT NOT NULL,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI conversations table
CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assistant_type assistant_type NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    context JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table (for experiences)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    booking_date TIMESTAMPTZ NOT NULL,
    participants INTEGER DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_start_date ON public.trips(start_date);
CREATE INDEX idx_experiences_category ON public.experiences(category);
CREATE INDEX idx_experiences_location ON public.experiences USING GIN(location);
CREATE INDEX idx_experiences_rating ON public.experiences(rating);
CREATE INDEX idx_safety_alerts_location ON public.safety_alerts USING GIN(location);
CREATE INDEX idx_safety_alerts_severity ON public.safety_alerts(severity);
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_type ON public.ai_conversations(assistant_type);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_experience_id ON public.bookings(experience_id);
CREATE INDEX idx_reviews_experience_id ON public.reviews(experience_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_alerts_updated_at BEFORE UPDATE ON public.safety_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can only see/edit their own trips
CREATE POLICY "Users can view own trips" ON public.trips
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trips" ON public.trips
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON public.trips
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON public.trips
    FOR DELETE USING (auth.uid() = user_id);

-- AI conversations - users can only see their own
CREATE POLICY "Users can view own AI conversations" ON public.ai_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI conversations" ON public.ai_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI conversations" ON public.ai_conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Bookings - users can only see their own
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- Reviews - users can only edit their own
CREATE POLICY "Users can view all reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Public read access for experiences and safety alerts
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view experiences" ON public.experiences
    FOR SELECT USING (true);

ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view safety alerts" ON public.safety_alerts
    FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO public.experiences (title, description, category, location, price, currency, duration, safety_rating) VALUES
('Tokyo Temple Tour', 'Guided tour of historic temples', 'Cultural', '{"city": "Tokyo", "country": "Japan"}', 50.00, 'USD', 180, 9),
('Paris Food Walking Tour', 'Explore local cuisine', 'Food', '{"city": "Paris", "country": "France"}', 75.00, 'EUR', 240, 8),
('London Museum Pass', 'Access to major museums', 'Cultural', '{"city": "London", "country": "UK"}', 40.00, 'GBP', 480, 9),
('Barcelona Park Güell Visit', 'Gaudí architecture tour', 'Sightseeing', '{"city": "Barcelona", "country": "Spain"}', 25.00, 'EUR', 120, 8);

INSERT INTO public.safety_alerts (location, alert_type, severity, title, description, source) VALUES
('{"city": "Tokyo", "country": "Japan"}', 'weather', 'low', 'Light Rain Expected', 'Light rainfall expected today', 'Weather Service'),
('{"city": "Paris", "country": "France"}', 'security', 'medium', 'Pickpocket Activity', 'Increased pickpocket reports in tourist areas', 'Local Police'),
('{"city": "London", "country": "UK"}', 'transport', 'low', 'Tube Delays', 'Minor delays on Central line', 'Transport Authority');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Success message
SELECT 'SafeSolo database schema created successfully!' as message;
