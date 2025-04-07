import { useState, useEffect } from "react";
import ProofSubmissionCard from "../../components/proofs/ProofSubmissionCard";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

const API_URL = "http://localhost:8080/admin/proof/all";

const ProofSubmission = () => {
  const [proofs, setProofs] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((proof) => ({
          ...proof,
          id: proof.id,
          submitter: proof.username,
          userFeedback: proof.description,
        }));
        setProofs(formatted);
      })
      .catch((err) => console.error("Error fetching proofs:", err.message));
  }, []);

  const handleDelete = (deletedId) => {
    setProofs((prev) => prev.filter((p) => p.id !== deletedId));
  };

  const filteredProofs =
    filter === "All" ? proofs : proofs.filter((proof) => proof.status === filter);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6">
          <p className="mb-4">
            Filter by:
            <button className="ml-2 px-3 py-1 bg-gray-200 rounded" onClick={() => setFilter("All")}>All</button>
            <button className="ml-2 px-3 py-1 bg-green-200 text-green-700 rounded" onClick={() => setFilter("Verified")}>Verified</button>
            <button className="ml-2 px-3 py-1 bg-red-200 text-red-700 rounded" onClick={() => setFilter("Issue")}>With Issue</button>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProofs.map((proof) => (
              <ProofSubmissionCard key={proof.id} proof={proof} onDeleted={handleDelete} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofSubmission;
