import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { toast } from 'react-toastify';

function PostManagement() {
  const [reportedPosts, setReportedPosts] = useState([]);

  useEffect(() => {
    apiRequest(API_ENDPOINTS.REPORTED_POSTS.GET_ALL)
      .then(setReportedPosts)
      .catch((err) =>
        toast.error('Failed to load reported posts: ' + err.message)
      );
  }, []);

  const handleDeleteReport = async (reportId) => {
    try {
      await apiRequest(API_ENDPOINTS.REPORTED_POSTS.DELETE(reportId), {
        method: 'DELETE',
      });
      toast.success('Report deleted');
      setReportedPosts((prev) =>
        prev.filter((r) => r.reportId !== reportId)
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePost = async (postId, reportId) => {
    try {
      await apiRequest(API_ENDPOINTS.POSTS.DELETE(postId), {
        method: 'DELETE',
      });
      toast.success('Post deleted successfully');
      await handleDeleteReport(reportId); // optionally remove the report too
    } catch (err) {
      toast.error('Failed to delete post: ' + err.message);
    }
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="p-4 text-gray-700">
          <h2 className="text-2xl font-bold mb-4">Reported Posts</h2>

          {reportedPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No reported posts found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportedPosts.map((report) => (
                <div
                  key={report.reportId}
                  className="border rounded-lg p-4 shadow-sm bg-gray-50"
                >
                  <p className="text-sm text-gray-500 mb-1">
                    Report ID: {report.reportId}
                  </p>
                  <p><strong>Post ID:</strong> {report.postId}</p>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  <p><strong>Reported By:</strong> {report.reportedBy}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Time: {new Date(report.timestamp).toLocaleString()}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleDeletePost(report.postId, report.reportId)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete Post
                    </button>

                    <button
                      onClick={() => handleDeleteReport(report.reportId)}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostManagement;
