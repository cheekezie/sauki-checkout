import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Portal } from "../layout/Portal";
import Button from "../ui/Button";

interface AcademicRecord {
  id: string;
  class: string;
  session: string;
  term?: string;
}

interface AcademicHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  onSave: (data: {
    termAdmitted: string;
    academicRecords: AcademicRecord[];
  }) => void;
  initialData?: {
    termAdmitted: string;
    academicRecords: AcademicRecord[];
  };
}

const AcademicHistoryModal = ({
  isOpen,
  onClose,
  studentName,
  onSave: _onSave,
  initialData,
}: AcademicHistoryModalProps) => {
  const [termAdmitted, setTermAdmitted] = useState("First Term");
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([
    { id: "1", class: "Ik", session: "2024/2025" },
  ]);

  useEffect(() => {
    if (isOpen && initialData) {
      setTermAdmitted(initialData.termAdmitted);
      setAcademicRecords(initialData.academicRecords);
    }
  }, [isOpen, initialData]);

  const addAcademicRecord = () => {
    const newId = (academicRecords.length + 1).toString();
    setAcademicRecords([
      ...academicRecords,
      { id: newId, class: "", session: "" },
    ]);
  };

  const updateAcademicRecord = (
    id: string,
    field: keyof AcademicRecord,
    value: string
  ) => {
    setAcademicRecords(
      academicRecords.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const removeAcademicRecord = (id: string) => {
    if (academicRecords.length > 1) {
      setAcademicRecords(academicRecords.filter((record) => record.id !== id));
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative w-full max-w-3xl bg-white rounded-xl shadow-lg max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-offwhite flex-shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-dark">
                {studentName}
              </h2>
              <p className="text-sm text-dark/70 mt-1">Academic History</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-dark" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Term Admitted Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Term Admitted
              </label>
              <input
                type="text"
                value={termAdmitted}
                onChange={(e) => setTermAdmitted(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
                placeholder="Enter term admitted"
              />
            </div>

            {/* Sessions & Classes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Sessions & Classes
                </label>
                <button
                  onClick={addAcademicRecord}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-medium"
                >
                  Add Record
                </button>
              </div>
              <div className="space-y-4">
                {academicRecords.map((record, index) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-600 w-8">
                        {index + 1}.
                      </span>
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Class
                          </label>
                          <input
                            type="text"
                            value={record.class}
                            onChange={(e) =>
                              updateAcademicRecord(
                                record.id,
                                "class",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Class"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Term
                          </label>
                          <input
                            type="text"
                            value={record.term || ""}
                            onChange={(e) =>
                              updateAcademicRecord(
                                record.id,
                                "term",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Term"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Session
                          </label>
                          <input
                            type="text"
                            value={record.session}
                            onChange={(e) =>
                              updateAcademicRecord(
                                record.id,
                                "session",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Session"
                          />
                        </div>
                      </div>
                      {academicRecords.length > 1 && (
                        <button
                          onClick={() => removeAcademicRecord(record.id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Note:</strong> Changing the first and last academic
                record will update the admission session and current class of
                this student respectively.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-offwhite flex-shrink-0">
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default AcademicHistoryModal;
