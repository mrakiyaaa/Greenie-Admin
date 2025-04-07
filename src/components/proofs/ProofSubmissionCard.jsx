import { useState } from "react";
import ViewProof from "../../pages/proofs/ViewProof";

const ProofSubmissionCard = ({ proof }) => {
  const [isViewing, setIsViewing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = () => {
    setIsDeleted(true);
    setTimeout(() => setIsViewing(false), 2000);
  };

  return (
    <div>
      {!isDeleted && (
        <div
          className="p-5 rounded-lg bg-white shadow-md cursor-pointer hover:shadow-lg transition"
          onClick={() => setIsViewing(true)}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 font-medium">#{proof.id}</p>
            <p
              className={`inline-block px-2 py-1 text-sm rounded-full ${
                proof.status === "Verified"
                  ? "bg-green-100 text-green-700"
                  : "bg-lightRed text-darkRed"
              }`}
            >
              {proof.status}
            </p>
          </div>
          <p className="text-lg font-semibold text-gray-900">{proof.challengeName}</p>
          <p className="text-sm text-gray-500">Submitted by: {proof.submitter}</p>
        </div>
      )}

      {isViewing && !isDeleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setIsViewing(false)}
            >
              ✖
            </button>
            <ViewProof proof={proof} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofSubmissionCard;
