CREATE TABLE public.rooms (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  description TEXT,
  image TEXT
);

-- Seed 6 sample rooms so rooms.length = 6 works as expected
INSERT INTO public.rooms (name, capacity, price, discount, description, image)
VALUES 
  ('Deluxe Ocean Suite', 2, 250, 0, 'Panoramic sea views with a king-sized bed.', 'https://images.unsplash.com/photo-1587061949409-02df41d5e562'),
  ('Executive Mountain Room', 4, 350, 25, 'Spacious room featuring a private balcony.', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233'),
  ('Royal Penthouse', 6, 550, 50, 'Top-floor luxury suite with private jacuzzi.', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8'),
  ('Garden Villa', 2, 220, 0, 'Quiet retreat surrounded by tropical gardens.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
  ('Family Loft', 5, 400, 30, 'Two-level suite ideal for families.', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'),
  ('Cozy Studio', 2, 180, 10, 'Modern minimalist studio for short stays.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427');