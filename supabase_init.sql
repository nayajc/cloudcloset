CREATE TABLE my_style_outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit JSONB NOT NULL,
  weather JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE my_style_outfits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own my_style_outfits"
  ON my_style_outfits
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
