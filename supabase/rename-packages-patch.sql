-- ============================================================
-- rename-packages-patch.sql
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- Renames packages in the database (affects PackageModal in dashboard)
-- ============================================================

UPDATE public.packages SET name = 'Basic Package'     WHERE name = 'Basic Protection';
UPDATE public.packages SET name = 'Standard Package'  WHERE name = 'Standard Protection';
UPDATE public.packages SET name = 'Advance Package'   WHERE name IN ('Advanced Response', 'Advance Response');
UPDATE public.packages SET name = 'Enterprise Package' WHERE name = 'Enterprise Security';
