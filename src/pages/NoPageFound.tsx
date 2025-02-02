

const NoPageFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="mt-4 text-2xl text-gray-700">Oops! Page not found.</p>
        <p className="mt-2 text-lg text-gray-500">The page you are looking for might have been moved or deleted.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NoPageFound;
