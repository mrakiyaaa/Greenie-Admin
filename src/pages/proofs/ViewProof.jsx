import React, { useState, useEffect } from "react";

const ViewProof = ({ proof, onClose }) => {
  const [proofDetails, setProofDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setProofDetails({
      challengeName: proof.challengeName || "Challenge Name",
      submittedBy: proof.submitter || "Unknown",
      userFeedback: proof.userFeedback || "No feedback provided.",
      aiResponse: proof.aiResponse || "AI analysis pending.",
      isVerified: proof.status === "Verified",
    });
  }, [proof]);

  const handleDelete = () => {
    setProofDetails(null);
    setShowPopup(false); // Immediately hide the popup
    onDelete(); // Call the delete function from the parent
  };
  
  return (
    <div className="w-full">
      {showPopup && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Post successfully deleted!
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {proofDetails ? (
          <>
            {/* ✅ Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-semibold">Proof Details</h2>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  proofDetails.isVerified
                    ? "bg-green-200 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {proofDetails.isVerified ? "Verified" : "Pending"}
              </span>
            </div>

            {/* ✅ Details */}
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-semibold">Challenge Name</p>
                <p className="text-gray-700">{proofDetails.challengeName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">Submitted By</p>
                <p className="text-gray-700">{proofDetails.submittedBy}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">User Feedback</p>
                <p className="text-gray-700 text-sm">{proofDetails.userFeedback}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">AI Response</p>
                <p className="text-gray-700 text-sm">{proofDetails.aiResponse}</p>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="mt-6">
              <button
                className="bg-red text-white w-full py-2 rounded-lg mb-3 font-semibold"
                onClick={handleDelete}
              >
                Delete Post
              </button>
              <button className="bg-green-600 text-white w-full py-2 rounded-lg font-semibold">
                View Post
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center bg-lightRed py-3 px-6 rounded-lg shadow-md border border">
            <p className="text-sm font-semibold text-darkRed uppercase">
              Post has been permanently deleted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProof;