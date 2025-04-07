import { useState } from "react";
import ViewProof from "../../pages/proofs/ViewProof";

const ProofSubmissionCard = ({ proof, onDeleted }) => {
  const [isViewing, setIsViewing] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/proof/${proof.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDeleted(proof.id);
        setIsViewing(false);
      } else {
        alert("Error deleting post");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  return (
    <>
      <div
        className="bg-white p-5 rounded-xl shadow hover:shadow-xl cursor-pointer transition"
        onClick={() => setIsViewing(true)}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs font-mono text-gray-500 truncate">#{proof.id}</p>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            proof.status === "Verified" ? "bg-green-100 text-green-700"
            : proof.status === "Issue" ? "bg-lightRed text-darkRed"
            : "bg-gray-200 text-gray-600"
          }`}>
            {proof.status}
          </span>
        </div>
        <p className="text-base font-semibold text-black">{proof.challengeName}</p>
        <p className="text-sm text-gray-500">Submitted by: {proof.submitter}</p>
      </div>

      {isViewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gray-700"
              onClick={() => setIsViewing(false)}
            >
              ✖
            </button>
            <ViewProof proof={proof} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProofSubmissionCard;
