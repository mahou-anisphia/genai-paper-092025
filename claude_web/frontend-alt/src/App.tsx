import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CustomerPage } from "./customer";
import { ProductPage } from "./product";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-900">
                  My App
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link
                  to="/customer"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Customers
                </Link>
                <Link
                  to="/product"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Products
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/product" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home page component
function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to My App
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Navigate to different sections using the menu above
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            to="/customer"
            className="block p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Customer Management
            </h3>
            <p className="text-gray-600">
              Manage your customer database and relationships
            </p>
          </Link>

          <Link
            to="/product"
            className="block p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Product Catalog
            </h3>
            <p className="text-gray-600">
              Browse and manage your product inventory
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
