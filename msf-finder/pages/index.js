import { useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabase';
import CourseCard from '../components/CourseCard';
import SearchBox from '../components/SearchBox';

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchCourses = async (e) => {
    e.preventDefault();
    
    if (!zipcode || zipcode.length !== 5) {
      alert('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Fetch all upcoming courses with college info
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          colleges (
            id,
            name,
            city,
            zipcode,
            latitude,
            longitude
          )
        `)
        .gte('start_date', new Date().toISOString().split('T')[0])
        .gt('seats_available', 0)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Calculate distances (simplified - in production use geocoding API)
      const coursesWithDistance = data.map(course => {
        const zipDiff = Math.abs(parseInt(zipcode) - parseInt(course.colleges.zipcode));
        const estimatedDistance = Math.round(zipDiff / 100); // Very rough estimate
        
        return {
          ...course,
          distance: estimatedDistance
        };
      });

      // Filter courses within 100 miles and sort by distance
      const nearbyCourses = coursesWithDistance
        .filter(course => course.distance <= 100)
        .sort((a, b) => a.distance - b.distance);

      setCourses(nearbyCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Error searching for courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>NC Motorcycle Safety Class Finder</title>
        <meta name="description" content="Find MSF Basic RiderCourse classes near you in North Carolina" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏍️ NC Motorcycle Safety Class Finder
          </h1>
          <p className="text-xl text-gray-600">
            Find MSF Basic RiderCourse classes near you
          </p>
        </header>

        {/* Search Box */}
        <SearchBox 
          zipcode={zipcode}
          setZipcode={setZipcode}
          onSearch={searchCourses}
          loading={loading}
        />

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching for classes near you...</p>
          </div>
        )}

        {!loading && searched && courses.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600">
              No classes found within 100 miles of ZIP code {zipcode}.
            </p>
            <p className="text-gray-500 mt-2">
              Try a different ZIP code or check back later for new classes.
            </p>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-700">
                Found <span className="font-bold text-blue-600">{courses.length}</span> classes 
                near ZIP code <span className="font-bold">{zipcode}</span>
              </p>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="mb-2">
            Data is updated every 6 hours. Always verify availability with the college.
          </p>
          <div className="space-x-4">
            <a href="/about" className="hover:text-blue-600">About</a>
            <a href="/privacy" className="hover:text-blue-600">Privacy</a>
            <a href="/terms" className="hover:text-blue-600">Terms</a>
            <a href="/contact" className="hover:text-blue-600">Contact</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
