import { useState } from "react";
import { X, Edit, Check } from "lucide-react";
import { Portal } from "../layout/Portal";
import AcademicHistoryModal from "./AcademicHistoryModal";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    regNumber: string;
    gender: string;
    class: string;
    schoolName?: string;
    addedOn?: string;
    sessionAdded?: string;
    academicHistory?: {
      class: string;
      session: string;
    };
  };
}

const StudentDetailsModal = ({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) => {
  const [isEditingAcademicHistory, setIsEditingAcademicHistory] =
    useState(false);

  const handleSaveAcademicHistory = (_data: {
    termAdmitted: string;
    academicRecords: any[];
  }) => {
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div 
          className="relative w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-end p-6 border-b border-gray-200">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Student Information Section */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Student Name and ID */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {student.regNumber}
                  </p>
                </div>
              </div>

              {/* Student Details - Left-Right Layout */}
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">
                    Gender
                  </span>
                  <span className="text-sm text-gray-900">
                    {student.gender}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">
                    Class
                  </span>
                  <span className="text-sm text-gray-900">{student.class}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">
                    School Name
                  </span>
                  <span className="text-sm text-gray-900">
                    {student.schoolName || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">
                    Added On
                  </span>
                  <span className="text-sm text-gray-900">
                    {student.addedOn || "Not specified"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-500">
                    Session Added
                  </span>
                  <span className="text-sm text-gray-900">
                    {student.sessionAdded || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Academic History Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  Academic History
                </h4>
                <button
                  onClick={() => {
                    setIsEditingAcademicHistory(true);
                  }}
                  className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                  title="Edit Academic History"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Academic History Card - Horizontal Layout */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      Class
                    </span>
                    <span className="text-sm text-gray-900">
                      {student.academicHistory?.class || "Not specified"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      Session
                    </span>
                    <span className="text-sm text-gray-900">
                      {student.academicHistory?.session || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Account Numbers Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Account Numbers
              </h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-500">
                      Account Number
                    </span>
                    <span className="text-sm text-gray-900 font-mono">
                      6557838496
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-500">
                      Account Name
                    </span>
                    <span className="text-sm text-gray-900">
                      FNG- ATTESTA COMP SEC SCH ABUJA
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-500">
                      Account Bank
                    </span>
                    <span className="text-sm text-gray-900">Globus Bank</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Parent/Guardian Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Parent/Guardian
              </h4>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-500">
                  Parent/Guardian
                </span>
                <span className="text-sm text-gray-900">Not assigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic History Modal */}
      <AcademicHistoryModal
        isOpen={isEditingAcademicHistory}
        onClose={() => setIsEditingAcademicHistory(false)}
        studentName={student.name}
        onSave={handleSaveAcademicHistory}
        initialData={{
          termAdmitted: "First Term",
          academicRecords: [
            {
              id: "1",
              class: student.academicHistory?.class || "",
              session: student.academicHistory?.session || "",
            },
          ],
        }}
      />
    </Portal>
  );
};

export default StudentDetailsModal;

