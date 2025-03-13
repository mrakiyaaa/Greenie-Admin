import { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState({ type: '', text: '' });
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin',
    password: '',
  });

  const [admins, setAdmins] = useState([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [adminError, setAdminError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const currentAdmin = JSON.parse(localStorage.getItem('adminAuth') || '{}');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.ADMIN.GET_ALL);
      setAdmins(data);
    } catch (error) {
      setAdminError('Failed to fetch admins');
      console.error('Error:', error);
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const handleInputChange = e => {
    setNewAdmin({
      ...newAdmin,
      [e.target.name]: e.target.value,
    });
  };

  const registerAdmin = async adminData => {
    return apiRequest(API_ENDPOINTS.ADMIN.REGISTER, {
      method: 'POST',
      body: JSON.stringify({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        role: 'ADMIN',
      }),
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setApiMessage({ type: '', text: '' });

    try {
      const result = await registerAdmin(newAdmin);
      setApiMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        setIsModalOpen(false);
        setNewAdmin({ name: '', email: '', role: 'admin', password: '' });
        setApiMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setApiMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async adminToDelete => {
    setIsDeleteLoading(true);
    setDeleteError('');

    try {
      await fetch(API_ENDPOINTS.ADMIN.DELETE(adminToDelete.adminId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminAuth')).token}`,
        },
      });

      // update after delete
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin.adminId !== adminToDelete.adminId));
      setShowDeleteModal(false);
      setAdminToDelete(null);
      setDeleteError('');

      // reffrsh admin list
      await fetchAdmins();
    } catch (error) {
      console.error('Delete Error:', error);
      setDeleteError('Failed to delete admin');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const renderDeleteButton = admin => (
    <button
      onClick={() => {
        if (admin.adminId === currentAdmin.adminId) {
          setDeleteError('You cannot delete your own account');
          return;
        }
        if (admins.length <= 1) {
          setDeleteError('Cannot delete the last admin account');
          return;
        }
        setAdminToDelete(admin);
        setShowDeleteModal(true);
      }}
      className={`text-red hover:text-red-800 p-1 transition-colors duration-200 
        ${admin.adminId === currentAdmin.adminId || admins.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={
        admin.adminId === currentAdmin.adminId
          ? 'You cannot delete your own account'
          : admins.length <= 1
            ? 'Cannot delete the last admin'
            : 'Delete admin'
      }
    >
      <Trash2 size={18} />
    </button>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 w-full flex flex-col">
        <Header />
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-textGray">Settings</h2>
          </div>

          {/* Admin Card */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-outlineGray">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
              <h3 className="text-lg md:text-xl font-medium text-textGray">Admin Management</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primaryGreen text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <Plus size={20} />
                Add Admin
              </button>
            </div>

            {adminError && (
              <div className="mb-4 p-3 bg-red-100 text-red rounded-md">{adminError}</div>
            )}

            {isLoadingAdmins ? (
              <div className="text-center py-4">Loading admins...</div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-outlineGray md:rounded-lg">
                    <table className="min-w-full divide-y divide-outlineGray">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="hidden sm:table-cell px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="hidden sm:table-cell px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-textGray uppercase tracking-wider"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-2 sm:px-6 sm:py-3 text-right text-xs font-medium text-textGray uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-outlineGray">
                        {admins.map(admin => (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                              <div className="flex flex-col sm:flex-row sm:items-center">
                                <div className="text-sm font-medium text-textGray">
                                  {admin.name}
                                </div>
                                <div className="text-sm text-gray-500 sm:hidden mt-1">
                                  {admin.email}
                                </div>
                              </div>
                            </td>
                            <td className="hidden sm:table-cell px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-textGray">
                              {admin.email}
                            </td>
                            <td className="hidden sm:table-cell px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-textGray capitalize">
                              {admin.role}
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end">{renderDeleteButton(admin)}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {admins.length === 0 && (
                      <div className="text-center py-4 text-gray-500">No admins found</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-outlineGray">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-medium text-textGray">Add New Admin</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-textGray hover:text-gray-700 p-1"
                  disabled={isLoading}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {apiMessage.text && (
                <div
                  className={`mb-4 p-3 rounded-md ${
                    apiMessage.type === 'success'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red'
                  }`}
                >
                  {apiMessage.text}
                </div>
              )}

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
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-textGray mb-1"
                  >
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

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-1/2 px-4 py-2 bg-primaryGreen text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      'Add Admin'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Con */}
      {showDeleteModal && adminToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-textGray mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-2">Are you sure you want to delete the admin:</p>
            <p className="text-base font-medium text-textGray mb-4">{adminToDelete.name}?</p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-100 text-red rounded-md text-sm">{deleteError}</div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAdminToDelete(null);
                  setDeleteError('');
                }}
                disabled={isDeleteLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-textGray hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdmin(adminToDelete)}
                disabled={isDeleteLoading}
                className="flex-1 px-4 py-2 bg-red text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleteLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red px-4 py-2 rounded-md shadow-lg">
          {deleteError}
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
