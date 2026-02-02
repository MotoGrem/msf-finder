export default function SearchBox({ zipcode, setZipcode, onSearch, loading }) {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="bg-white rounded-xl shadow-xl p-8">
        <form onSubmit={onSearch}>
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your ZIP code
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="zipcode"
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="28202"
              maxLength={5}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || zipcode.length !== 5}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Searching...' : 'Find Classes'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            We'll show you classes within 100 miles of your location
          </p>
        </form>
      </div>

      {/* Quick Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">15+</div>
          <div className="text-sm text-gray-600">Community Colleges</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">100+</div>
          <div className="text-sm text-gray-600">Classes Available</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">Free</div>
          <div className="text-sm text-gray-600">To Search & Use</div>
        </div>
      </div>
    </div>
  );
}
