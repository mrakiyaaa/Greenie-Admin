import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ViewProof = ({ proof, onDelete, onClose, onViewPost }) => {
  const [details, setDetails] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setDetails({
      id: proof.id,
      challengeName: proof.challengeName,
      submittedBy: proof.submitter,
      userFeedback: proof.userFeedback,
      aiResponse: proof.aiResponse,
      status: proof.status,
    });
  }, [proof]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/proof/${proof.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("✅ Post has been permanently deleted.");
        onDelete();
      } else {
        toast.error("❌ Failed to delete proof. Please try again.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      toast.warning("⚠️ Something went wrong while deleting.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (!details) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-600 text-2xl font-bold hover:text-purple-800"
        >
          &times;
        </button>

        {/* 🧾 Title */}
        <h2 className="text-xl font-semibold mb-2">Proof Details</h2>

        {/* 🏷️ Status */}
        <span
          className={`absolute top-6 right-16 text-sm px-3 py-1 rounded-md font-medium ${
            details.status === "Verified"
              ? "bg-green-100 text-green-800"
              : details.status === "Issue"
              ? "bg-lightRed text-darkRed"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {details.status}
        </span>

        {/* 📋 Info */}
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="font-semibold text-gray-600">Challenge Name</p>
            <p className="text-gray-800">{details.challengeName}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Submitted By</p>
            <p className="text-gray-800">{details.submittedBy}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">User Feedback</p>
            <p className="text-gray-800">{details.userFeedback}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-600">AI Response</p>
            <p className="text-gray-800">{details.aiResponse}</p>
          </div>
        </div>

        {/* 🔘 Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-mediumRed hover:bg-darkRed text-white w-full py-2 rounded-md font-semibold"
          >
            Delete Post
          </button>
          <button
            onClick={onViewPost}
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md font-semibold"
          >
            View Post
          </button>
        </div>
      </div>

      {/* ✅ Custom Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Do you really want to delete this proof? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-mediumRed hover:bg-darkRed text-white px-4 py-2 rounded font-medium"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProof;
