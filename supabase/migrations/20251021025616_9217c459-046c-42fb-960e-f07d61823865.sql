-- Add new columns to os_settings table for theme customization
ALTER TABLE public.os_settings 
ADD COLUMN IF NOT EXISTS hover_color TEXT DEFAULT 'hsl(195 100% 50%)',
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"border_color": "hsl(240 5% 20%)", "app_background": "hsl(240 8% 8%)", "text_color": "hsl(210 40% 98%)"}'::jsonb;