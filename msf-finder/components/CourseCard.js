export default function CourseCard({ course }) {
  const getSeatStatus = (available) => {
    if (available === 0) return { color: 'bg-red-100 text-red-800', text: 'Full' };
    if (available <= 3) return { color: 'bg-yellow-100 text-yellow-800', text: 'Limited' };
    return { color: 'bg-green-100 text-green-800', text: 'Available' };
  };

  const status = getSeatStatus(course.seats_available);

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
              {course.colleges.name}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {course.title}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {course.distance} miles away
            </div>
            <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
              {course.seats_available} seats
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start">
            <span className="text-gray-500 mr-2">📅</span>
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-semibold text-gray-900">
                {new Date(course.start_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 mr-2">⏰</span>
            <div>
              <div className="text-sm text-gray-500">Time</div>
              <div className="font-semibold text-gray-900">{course.start_time}</div>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 mr-2">📍</span>
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-semibold text-gray-900">
                {course.location || `${course.colleges.city}, NC`}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <span className="text-gray-500 mr-2">💰</span>
            <div>
              <div className="text-sm text-gray-500">Price</div>
              <div className="font-semibold text-gray-900">{course.price}</div>
            </div>
          </div>
        </div>

        {/* Waitlist Notice */}
        {course.waitlist_available && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <span className="mr-2">⚠️</span>
              <span className="text-sm font-semibold">Wait List Available</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <a
          href={course.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
            course.seats_available > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {course.seats_available > 0 ? 'Register Now →' : 'Class Full'}
        </a>

        {/* Last Updated */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          Last updated: {new Date(course.scraped_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
