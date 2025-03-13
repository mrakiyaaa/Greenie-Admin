import React, { useState, useEffect } from "react";

function ViewProof() {
  const [proofDetails, setProofDetails] = useState({
    challengeName: "",
    submittedBy: "",
    userFeedback: "",
    aiResponse: "",
    isVerified: false,
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchedData = {
      challengeName: "Eco-friendly Challenge",
      submittedBy: "John Doe",
      userFeedback:
        "I used biodegradable bags instead of plastic bags for a week!",
      aiResponse:
        "AI has analyzed the proof and confirms the challenge completion.",
      isVerified: true,
    };

    setProofDetails(fetchedData);
  }, []);

  const handleDelete = () => {
    setProofDetails(null);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      {showPopup && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Post successfully deleted!
        </div>
      )}
      <div className="bg-white w-full max-w-2xl p-6">
        {proofDetails ? (
          <>
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl mt-5 font-semibold">Proof Details</h2>
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
            <div className="mt-12 space-y-4">
              <div>
                <p className="text-sm font-semibold">Challenge Name</p>
                <p className="text-gray-700">{proofDetails.challengeName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mt-6">Submitted By</p>
                <p className="text-gray-700">{proofDetails.submittedBy}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mt-6">User Feedback (Caption)</p>
                <p className="text-gray-700 text-sm">{proofDetails.userFeedback}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mt-6">AI Response</p>
                <p className="text-gray-700 text-sm">{proofDetails.aiResponse}</p>
              </div>
            </div>
            <div className="mt-10">
              <button
                className="bg-red-500 text-white w-full py-2 rounded-lg mb-3 font-semibold"
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
          <p className="text-gray-600 text-center">Post has been deleted.</p>
        )}
      </div>
    </div>
  );
}

export default ViewProof;
