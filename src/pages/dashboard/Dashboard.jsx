import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

function Dashboard() {
  return (
    <div className="bg-white min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <div className="p-4 text-gray">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
