-- 1. Create cabins (or rooms) table
CREATE TABLE public.cabins (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  "maxCapacity" INTEGER NOT NULL,
  "regularPrice" NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  description TEXT,
  image TEXT
);

-- 2. Create settings table
CREATE TABLE public.settings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "minBookingLength" INTEGER DEFAULT 1,
  "maxBookingLength" INTEGER DEFAULT 30,
  "maxGuestsPerBooking" INTEGER DEFAULT 10,
  "breakfastPrice" NUMERIC DEFAULT 15
);

-- Insert default settings row
INSERT INTO public.settings ("minBookingLength", "maxBookingLength", "maxGuestsPerBooking", "breakfastPrice")
VALUES (1, 30, 8, 15);

-- 3. Create bookings table
CREATE TABLE public.bookings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "endDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "numNights" INTEGER NOT NULL,
  "numGuests" INTEGER NOT NULL,
  "cabinPrice" NUMERIC NOT NULL,
  "extrasPrice" NUMERIC DEFAULT 0,
  "totalPrice" NUMERIC NOT NULL,
  status TEXT DEFAULT 'unconfirmed',
  "hasBreakfast" BOOLEAN DEFAULT false,
  "isPaid" BOOLEAN DEFAULT false,
  observations TEXT,
  "cabinId" INTEGER REFERENCES public.cabins(id) ON DELETE CASCADE,
  "guestId" UUID -- Links to auth.users or guests table
);

-- 4. Seed sample cabins so your UI displays rooms correctly
INSERT INTO public.cabins (name, "maxCapacity", "regularPrice", discount, description, image)
VALUES 
  ('Cabin 001', 2, 250, 0, 'A cozy mountain view cabin for couples.', 'https://images.unsplash.com/photo-1587061949409-02df41d5e562'),
  ('Cabin 002', 4, 350, 25, 'Spacious cabin with a private hot tub.', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233'),
  ('Cabin 003', 6, 500, 50, 'Luxury family chalet near the ski slopes.', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8');