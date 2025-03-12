import { useState } from 'react';
import { Plus, X, Trash2, Edit } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin',
    password: '',
  });

  const [admins] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
  ]);

  const handleInputChange = e => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // admin creation logic here
    console.log('New admin data:', newAdmin);
    setIsModalOpen(false);
    setNewAdmin({
      name: '',
      email: '',
      role: 'admin',
      password: '',
    });
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-textGray">Settings</h2>
          </div>

          {/* Admin Management Card - Now full width */}
          <div className="bg-white p-6 rounded-lg border border-outlineGray">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-textGray">Admin Management</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
                Add Admin
              </button>
            </div>

            {/* Admins List - Full width table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map(admin => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                        {admin.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray capitalize">
                        {admin.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-textGray">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={18} />
                          </button>
                          <button className="text-red hover:text-red-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-textGray">Add New Admin</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-textGray hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-textGray mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-textGray mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-textGray mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value="Admin"
                  disabled
                  className="w-full p-2 border border-outlineGray rounded-md bg-gray-50 text-textGray"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-textGray mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newAdmin.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-outlineGray rounded-md focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                  required
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-green-600"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
