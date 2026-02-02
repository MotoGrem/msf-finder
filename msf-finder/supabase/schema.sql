-- MSF Finder Database Schema
-- Run this in Supabase SQL Editor

-- Create colleges table
CREATE TABLE colleges (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  zipcode TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create courses table
CREATE TABLE courses (
  id BIGSERIAL PRIMARY KEY,
  college_id BIGINT REFERENCES colleges(id) ON DELETE CASCADE,
  section_id TEXT,
  course_code TEXT,
  title TEXT NOT NULL,
  start_date DATE,
  start_time TEXT,
  location TEXT,
  seats_available INTEGER DEFAULT 0,
  seats_total INTEGER DEFAULT 12,
  price TEXT,
  waitlist_available BOOLEAN DEFAULT false,
  registration_url TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_courses_start_date ON courses(start_date);
CREATE INDEX idx_courses_seats ON courses(seats_available);
CREATE INDEX idx_courses_college ON courses(college_id);
CREATE INDEX idx_colleges_zipcode ON colleges(zipcode);

-- Enable Row Level Security (RLS)
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Enable read access for all users" ON colleges
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON courses
  FOR SELECT USING (true);

-- Create a view for easy querying
CREATE VIEW available_courses AS
SELECT 
  c.*,
  col.name as college_name,
  col.city as college_city,
  col.zipcode as college_zipcode,
  col.latitude,
  col.longitude
FROM courses c
JOIN colleges col ON c.college_id = col.id
WHERE c.start_date >= CURRENT_DATE
  AND c.seats_available > 0
ORDER BY c.start_date ASC;

-- Insert sample data (optional - remove this if you want to start with real scraped data)
-- This is just to test the website works

INSERT INTO colleges (name, city, zipcode, latitude, longitude) VALUES
('Alamance Community College', 'Graham', '27253', 36.0693, -79.4003),
('Rowan-Cabarrus Community College', 'Salisbury', '28146', 35.6740, -80.4741);

INSERT INTO courses (college_id, title, start_date, start_time, location, seats_available, seats_total, price, registration_url) VALUES
(1, 'Motorcycle Safety BRC', '2026-03-15', '08:00 AM', 'Burlington Campus - Dillingham Center', 8, 12, '$210.55', 'https://alamance-register.fundfive.com/course/section/27093'),
(1, 'Motorcycle Safety BRC', '2026-04-10', '08:00 AM', 'Burlington Campus - Dillingham Center', 10, 12, '$210.55', 'https://alamance-register.fundfive.com/course/section/27090'),
(2, 'MSF Basic RiderCourse', '2026-03-20', '08:00 AM', 'South Campus - Lot D', 5, 12, '$200.00', 'https://ss-prod.cloud.rccc.edu/student/section/12345');
