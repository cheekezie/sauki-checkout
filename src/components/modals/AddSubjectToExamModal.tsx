import { useState } from "react";
import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Input from "../ui/Input";
import Modal from "./Modal";
import Button from "../ui/Button";

interface AddSubjectToExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: { name: string; totalScore: number }) => void;
}

const AddSubjectToExamModal = ({
  isOpen,
  onClose,
  onSave,
}: AddSubjectToExamModalProps) => {
  const [subjectName, setSubjectName] = useState("English Language");
  const [totalScore, setTotalScore] = useState("0.0");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    onSave({
      name: subjectName,
      totalScore: parseFloat(totalScore),
    });
    setShowSuccess(true);

    // Reset form and close after showing success message
    setTimeout(() => {
      setShowSuccess(false);
      setSubjectName("English Language");
      setTotalScore("0.0");
      onClose();
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSubjectName("English Language");
    setTotalScore("0.0");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Portal>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !showSuccess) {
              onClose();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Subject
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-dark" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <Input
                label="Subject"
                name="subject"
                value={subjectName}
                onChange={(value) => setSubjectName(value)}
                placeholder="English Language"
                required
              />

              <Input
                label="Total Obtainable Score"
                name="totalScore"
                type="number"
                value={totalScore}
                onChange={(value) => setTotalScore(value)}
                placeholder="0.0"
                required
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleSubmit}
                variant="secondary"
                size="sm"
                fullWidth={false}
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                size="sm"
                fullWidth={false}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Portal>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        title="Subject(s) Added Successfully."
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna."
        type="success"
      />
    </>
  );
};

export default AddSubjectToExamModal;
