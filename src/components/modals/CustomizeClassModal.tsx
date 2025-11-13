import { useState, useEffect, useMemo } from "react";
import FormModal from "./FormModal";
import Select from "../ui/Select";
import { ComponentLoading } from "../ui/LoadingSpinner";
import {
  useAssignSubClass,
  useUnassignSubClass,
  useSubClasses,
  useAssignedSubClasses,
} from "@/hooks/useClasses";
import { useConfirmModal } from "@/hooks/useConfirmModal";

interface CustomizeClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (className: string) => void | Promise<void>;
  currentClassName?: string;
  classId: string;
  classCode?: number;
  classCategory?: string;
  isSubmitting?: boolean;
}

const CustomizeClassModal = ({
  isOpen,
  onClose,
  onSave,
  currentClassName = "",
  classId,
  classCode,
  classCategory,
  isSubmitting = false,
}: CustomizeClassModalProps) => {
  const [className, setClassName] = useState(currentClassName);
  const [selectedSubClassId, setSelectedSubClassId] = useState<string>("");
  const [processingSubClassId, setProcessingSubClassId] = useState<string | null>(null);

  const assignSubClassMutation = useAssignSubClass();
  const unassignSubClassMutation = useUnassignSubClass();
  const { confirm, ConfirmModal } = useConfirmModal();

  const {
    data: assignedSubClassesResponse,
    isLoading: assignedLoading,
    isFetching: assignedFetching,
  } = useAssignedSubClasses(classId, isOpen);

  const {
    data: allSubClassesResponse,
    isLoading: subClassesLoading,
    isFetching: subClassesFetching,
  } = useSubClasses(undefined, isOpen);

  // Update the input when currentClassName changes
  useEffect(() => {
    setClassName(currentClassName);
  }, [currentClassName, isOpen]);

  const assignedSubClasses = useMemo(() => {
    return assignedSubClassesResponse?.data?.subClasses ?? [];
  }, [assignedSubClassesResponse]);

  const allSubClasses = useMemo(() => {
    return allSubClassesResponse?.data?.subClasses ?? [];
  }, [allSubClassesResponse]);

  const availableSubClasses = useMemo(() => {
    if (!allSubClasses.length) return [];
    const assignedIds = new Set(assignedSubClasses.map((sub) => sub._id));
    return allSubClasses.filter((sub) => !assignedIds.has(sub._id));
  }, [allSubClasses, assignedSubClasses]);

  const handleSave = async () => {
    const trimmed = className.trim();
    if (!trimmed || isSubmitting) return;

    await onSave(trimmed);
  };

  const handleAssign = async () => {
    if (!selectedSubClassId || assignSubClassMutation.isPending) return;

    try {
      await assignSubClassMutation.mutateAsync({
        classIds: [classId],
        subClassId: selectedSubClassId,
      });
      setSelectedSubClassId("");
    } catch {
      // errors handled in hook
    }
  };

  const handleUnassign = (subClassId: string, subClassName: string) => {
    confirm({
      title: "Unassign Subclass",
      message: `Are you sure you want to unassign ${subClassName} from this class?`,
      confirmText: "Unassign",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        try {
          setProcessingSubClassId(subClassId);
          await unassignSubClassMutation.mutateAsync({
            classId,
            subClassId,
          });
        } catch {
          // handled in hook
        } finally {
          setProcessingSubClassId(null);
        }
      },
    });
  };

  const isLoadingAssignments =
    assignedLoading || subClassesLoading || assignedFetching || subClassesFetching;

  const disableAssignButton =
    !selectedSubClassId || assignSubClassMutation.isPending || isLoadingAssignments;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Class"
      onSave={handleSave}
      onCancel={onClose}
      saveText={isSubmitting ? "Saving..." : "Save Changes"}
      cancelText="Cancel"
      maxWidth="max-w-3xl"
      saveDisabled={
        isSubmitting ||
        !className.trim() ||
        className.trim() === currentClassName.trim()
      }
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Class Information
            </h3>
            <p className="text-sm text-gray-500">
              Update the class name and manage subclass assignments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name *
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter class name"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Class Code
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {classCode ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Category
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {classCategory ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Assigned Subclasses
            </h3>
            <p className="text-sm text-gray-500">
              View and manage subclasses assigned to this class.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg">
            {isLoadingAssignments ? (
              <div className="flex items-center justify-center py-8">
                <ComponentLoading size="md" />
              </div>
            ) : assignedSubClasses.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                No subclasses assigned yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {assignedSubClasses.map((subClass) => (
                  <li
                    key={subClass._id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{subClass.name}</p>
                      {subClass.capacity !== undefined && (
                        <p className="text-xs text-gray-500">
                          Capacity: {subClass.capacity}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleUnassign(subClass._id, subClass.name)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        unassignSubClassMutation.isPending &&
                        processingSubClassId === subClass._id
                      }
                    >
                      {unassignSubClassMutation.isPending &&
                      processingSubClassId === subClass._id
                        ? "Removing..."
                        : "Unassign"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Assign New Subclass
            </h3>
            <p className="text-sm text-gray-500">
              Select an available subclass to assign to this class.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Select
                label="Available Subclasses"
                name="availableSubClasses"
                value={selectedSubClassId}
                onChange={setSelectedSubClassId}
                options={availableSubClasses.map((subClass) => ({
                  value: subClass._id,
                  label: subClass.name,
                }))}
                placeholder={
                  availableSubClasses.length
                    ? "Select subclass to assign"
                    : "No available subclasses"
                }
                disabled={
                  availableSubClasses.length === 0 ||
                  assignSubClassMutation.isPending ||
                  isLoadingAssignments
                }
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAssign}
                className="bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 border border-transparent w-full"
                disabled={disableAssignButton}
              >
                {assignSubClassMutation.isPending ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <ConfirmModal />
    </FormModal>
  );
};

export default CustomizeClassModal;
