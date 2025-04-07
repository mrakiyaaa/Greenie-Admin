import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewProof from "../../pages/proofs/ViewProof";

const ProofSubmissionCard = ({ proof, onDeleted }) => {
  const [isViewing, setIsViewing] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/proof/${proof.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDeleted(proof.id); // Notify parent to remove the card
        setIsViewing(false);
      } else {
        
      }
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleViewPost = () => {
    navigate(`/admin/view-post/${proof.id}`); // Replace with actual route
  };

  return (
    <>
      <div
        className="bg-white p-5 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
        onClick={() => setIsViewing(true)}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-mono text-gray-500 truncate">#{proof.id}</p>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              proof.status === "Verified"
                ? "bg-green-100 text-green-700"
                : proof.status === "Issue"
                ? "bg-lightRed text-darkRed"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {proof.status}
          </span>
        </div>
        <p className="text-base font-semibold text-black">{proof.challengeName}</p>
        <p className="text-sm text-gray-500">Submitted by: {proof.submitter}</p>
      </div>

      {isViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-xl"
              onClick={() => setIsViewing(false)}
            >
              ✖
            </button>

            <ViewProof
              proof={proof}
              onDelete={handleDelete}
              onClose={() => setIsViewing(false)}
              onViewPost={handleViewPost}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProofSubmissionCard;
