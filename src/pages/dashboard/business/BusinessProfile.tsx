import { useState, useRef, useEffect } from "react";
import {
  useOrganizationProfile,
  useUpdateOrganizationProfile,
  useUpdateBannerImage,
  useUpdateKycDocuments,
  useActivateOrganization,
} from "@/hooks/useOrganizations";
import { useDecodedAuth } from "@/hooks/useDecodedAuth";
import { MerchantRoles } from "@/enums/merchant.enum";
import { ComponentLoading } from "@/components/ui/LoadingSpinner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import SearchableSelect from "@/components/ui/SearchableSelect";
import Button from "@/components/ui/Button";
import {
  Upload,
  X,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
} from "lucide-react";
import type {
  UpdateOrganizationRequest,
  UpdateKycDocumentsRequest,
} from "@/services/organization.service";
import {
  TERTIARY_CATEGORY_OPTIONS,
  PRIMARY_SECONDARY_CATEGORY_OPTIONS,
} from "@/data/school.data";
import { useToast } from "@/hooks/useToast";
import ConfigService from "@/services/config.service";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

type TabType = "basic" | "documents" | "directors" | "other";

interface DirectorFormData {
  fullName: string;
  bvn: string;
  dob: string;
}

const BusinessProfile = () => {
  const { role, isLoading: authLoading } = useDecodedAuth();
  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;
  const { data, isLoading, refetch } = useOrganizationProfile({
    enabled: !authLoading && !isPortalAdmin,
  });
  const organization = data?.data;
  const updateOrganizationProfileMutation = useUpdateOrganizationProfile();
  const updateBannerMutation = useUpdateBannerImage();
  const updateKycDocumentsMutation = useUpdateKycDocuments();
  const activateOrganizationMutation = useActivateOrganization();
  const { showError } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>("basic");

  // Banner Image
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Basic Information Form
  const [basicInfo, setBasicInfo] = useState({
    organizationName: "",
    email: "",
    phoneNumber: "",
    organizationCategory: "",
    schoolType: "",
    schoolCategoryBoard: "",
  });

  // Profile Image
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(
    null
  );
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // Documents
  const [documentFiles, setDocumentFiles] = useState<
    Record<string, { file: File | null; preview: string | null }>
  >({
    cacForm2: { file: null, preview: null },
    cacForm7: { file: null, preview: null },
    utilityBill: { file: null, preview: null },
    businessReg: { file: null, preview: null },
    memorandum: { file: null, preview: null },
    identityCard: { file: null, preview: null },
    mandateLetter: { file: null, preview: null },
  });
  const documentInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Directors
  const [directors, setDirectors] = useState<DirectorFormData[]>([]);
  const [editingDirectorIndex, setEditingDirectorIndex] = useState<
    number | null
  >(null);
  const [directorForm, setDirectorForm] = useState<DirectorFormData>({
    fullName: "",
    bvn: "",
    dob: "",
  });

  // Other Information
  const [otherInfo, setOtherInfo] = useState({
    address: "",
    lga: "",
    state: "",
    tinNumber: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });

  // Load organization data into forms
  useEffect(() => {
    if (organization) {
      setBasicInfo({
        organizationName: organization.organizationName || "",
        email: organization.email || "",
        phoneNumber: organization.phoneNumber || "",
        organizationCategory: organization.organizationCategory || "",
        schoolType: organization.schoolType || "",
        schoolCategoryBoard: organization.schoolCategoryBoard || "",
      });

      // Get bank details from organization (bankDetails, primaryBankDetails, or first otherBankDetails)
      const bankDetails =
        (organization as any).bankDetails ||
        (organization as any).primaryBankDetails ||
        (organization.otherBankDetails &&
        organization.otherBankDetails.length > 0
          ? organization.otherBankDetails[0]
          : null);

      setOtherInfo({
        address: organization.address || "",
        lga: organization.lga || "",
        state: organization.state || "",
        tinNumber: organization.tinNumber || "",
        bankCode: bankDetails?.bankCode || "",
        accountNumber: bankDetails?.accountNumber || "",
        accountName: bankDetails?.accountName || "",
      });

      if (organization.directors && organization.directors.length > 0) {
        setDirectors(
          organization.directors.map((dir) => ({
            fullName: dir.fullName || "",
            bvn: dir.bvn || "",
            dob: dir.dob || "",
          }))
        );
      }

      // Load existing document URLs if available
      if (organization.kycDocument) {
        const docs = organization.kycDocument;
        setDocumentFiles({
          cacForm2: { file: null, preview: docs.cacForm2 || null },
          cacForm7: { file: null, preview: docs.cacForm7 || null },
          utilityBill: { file: null, preview: docs.utilityBill || null },
          businessReg: { file: null, preview: docs.businessReg || null },
          memorandum: { file: null, preview: docs.memorandum || null },
          identityCard: { file: null, preview: docs.identityCard || null },
          mandateLetter: { file: null, preview: docs.mandateLetter || null },
        });
      }

      // Load profile image if available
      if (organization.kycDocument?.logo) {
        setProfileImagePreview(organization.kycDocument.logo);
      }

      // Load banner image if available
      const bannerImage =
        organization.kycDocument?.banner || organization.bannerImage || null;
      if (bannerImage) {
        setBannerPreview(bannerImage);
      }
    }
  }, [organization]);

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ComponentLoading size="lg" />
      </div>
    );
  }

  if (isPortalAdmin || !organization) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-500">
            Business Profile is only available for organizations.
          </p>
        </div>
      </div>
    );
  }

  // Profile Image Handlers
  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showError("Invalid File", "Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError("File Too Large", "Image size should be less than 5MB.");
        return;
      }

      // Show preview immediately
      setSelectedProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setSelectedProfileFile(null);
    setProfileImagePreview(null);
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  };

  // Banner Image Handlers
  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showError("Invalid File", "Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError("File Too Large", "Image size should be less than 5MB.");
        return;
      }

      // Show preview immediately
      setSelectedBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = async () => {
    if (!selectedBannerFile) return;
    try {
      await updateBannerMutation.mutateAsync(selectedBannerFile);
      setSelectedBannerFile(null);
      if (bannerInputRef.current) {
        bannerInputRef.current.value = "";
      }
      await refetch();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleRemoveBanner = () => {
    setSelectedBannerFile(null);
    setBannerPreview(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = "";
    }
  };

  // Document Handlers
  const handleDocumentSelect = (
    docType: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showError("File Too Large", "File size should be less than 10MB.");
        return;
      }
      setDocumentFiles((prev) => ({
        ...prev,
        [docType]: {
          file,
          preview: URL.createObjectURL(file),
        },
      }));
    }
  };

  const handleRemoveDocument = (docType: string) => {
    setDocumentFiles((prev) => ({
      ...prev,
      [docType]: { file: null, preview: null },
    }));
    if (documentInputRefs.current[docType]) {
      documentInputRefs.current[docType]!.value = "";
    }
  };

  const handleSaveDocuments = async () => {
    if (!organization?._id) {
      return;
    }

    const entries = Object.entries(documentFiles);
    const uploads = entries.filter(([, value]) => value.file);

    if (uploads.length === 0 && !entries.some(([, value]) => value.preview)) {
      showError(
        "No Documents Selected",
        "Please upload or select at least one document before saving."
      );
      return;
    }

    try {
      const payload: UpdateKycDocumentsRequest = {};

      if (uploads.length > 0) {
        const filesToUpload = uploads.map(([, value]) => value.file!) as File[];
        const uploadResponse = await ConfigService.uploadFiles(filesToUpload);

        uploads.forEach(([docKey], index) => {
          const currentPreview = documentFiles[docKey].preview;
          if (currentPreview && currentPreview.startsWith("blob:")) {
            URL.revokeObjectURL(currentPreview);
          }

          const uploaded = uploadResponse.data?.[index];
          if (uploaded?.url) {
            payload[docKey as keyof UpdateKycDocumentsRequest] = uploaded.url;
          }

          const inputRef = documentInputRefs.current[docKey];
          if (inputRef) {
            inputRef.value = "";
          }
        });
      }

      entries.forEach(([docKey, value]) => {
        const key = docKey as keyof UpdateKycDocumentsRequest;
        if (!payload[key] && value.preview) {
          payload[key] = value.preview;
        }
      });

      if (Object.keys(payload).length === 0) {
        showError(
          "No Documents Selected",
          "Please upload or select at least one document before saving."
        );
        return;
      }

      await updateKycDocumentsMutation.mutateAsync(payload);

      setDocumentFiles((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((docKey) => {
          const key = docKey as keyof UpdateKycDocumentsRequest;
          const nextValue = payload[key];
          updated[docKey] = {
            file: null,
            preview: (typeof nextValue === "string" && nextValue) || null,
          };
        });
        return updated;
      });

      await refetch();
    } catch (error) {
      // Error handling is managed in the mutation hook toast
    }
  };

  // Director Handlers
  const handleAddDirector = () => {
    if (directorForm.fullName && directorForm.bvn && directorForm.dob) {
      if (editingDirectorIndex !== null) {
        const updated = [...directors];
        updated[editingDirectorIndex] = { ...directorForm };
        setDirectors(updated);
        setEditingDirectorIndex(null);
      } else {
        setDirectors([...directors, { ...directorForm }]);
      }
      setDirectorForm({ fullName: "", bvn: "", dob: "" });
    }
  };

  const handleEditDirector = (index: number) => {
    setDirectorForm(directors[index]);
    setEditingDirectorIndex(index);
  };

  const handleDeleteDirector = (index: number) => {
    setDirectors(directors.filter((_, i) => i !== index));
    if (editingDirectorIndex === index) {
      setEditingDirectorIndex(null);
      setDirectorForm({ fullName: "", bvn: "", dob: "" });
    }
  };

  const handleCancelEditDirector = () => {
    setEditingDirectorIndex(null);
    setDirectorForm({ fullName: "", bvn: "", dob: "" });
  };

  // Save Handlers
  const handleSaveBasicInfo = async () => {
    if (!organization?._id) return;

    const payload: UpdateOrganizationRequest = {
      organizationName: basicInfo.organizationName,
      email: basicInfo.email,
      phoneNumber: basicInfo.phoneNumber,
      organizationCategory: basicInfo.organizationCategory as any,
      schoolType: basicInfo.schoolType as any,
      schoolCategoryBoard: basicInfo.schoolCategoryBoard as any,
    };

    try {
      await updateOrganizationProfileMutation.mutateAsync({
        id: organization._id,
        payload,
      });
      await refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSaveOtherInfo = async () => {
    if (!organization?._id) return;

    // Check if bank details are provided in the form
    const hasBankDetails = otherInfo.bankCode && otherInfo.accountNumber;

    // Use activate endpoint if bank details are provided and all required fields are provided
    if (
      hasBankDetails &&
      otherInfo.state &&
      otherInfo.lga &&
      otherInfo.address &&
      organization.tinNumber
    ) {
      try {
        await activateOrganizationMutation.mutateAsync({
          state: otherInfo.state,
          lga: otherInfo.lga,
          address: otherInfo.address,
          tinNumber: organization.tinNumber,
          bankDetails: {
            accountNumber: otherInfo.accountNumber,
            bankCode: otherInfo.bankCode,
          },
        });
        await refetch();
      } catch (error) {
        // Error handled by mutation
      }
    } else {
      // Use update endpoint for regular updates
      const payload: UpdateOrganizationRequest = {
        email: organization.email || basicInfo.email,
        organizationName:
          organization.organizationName || basicInfo.organizationName,
        phoneNumber: organization.phoneNumber || basicInfo.phoneNumber,
        address: otherInfo.address,
        lga: otherInfo.lga,
        state: otherInfo.state,
      };

      try {
        await updateOrganizationProfileMutation.mutateAsync({
          id: organization._id,
          payload,
        });
        await refetch();
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleSaveDirectors = async () => {
    if (!organization?._id) return;

    const payload: UpdateOrganizationRequest = {
      email: organization.email || basicInfo.email,
      organizationName:
        organization.organizationName || basicInfo.organizationName,
      phoneNumber: organization.phoneNumber || basicInfo.phoneNumber,
      directors: directors.map((dir) => ({
        fullName: dir.fullName,
        bvn: dir.bvn,
        dob: dir.dob,
      })),
    };

    try {
      await updateOrganizationProfileMutation.mutateAsync({
        id: organization._id,
        payload,
      });
      await refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <DashboardPageLayout
      title="Business Profile"
      description="Manage your business information and documents"
    >
      <>
        <div className="space-y-6">
          {/* Registered Business Activation Card */}
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Registered Business Activation
            </h2>
            <p className="text-sm text-gray-600 mb-4 max-w-[45rem]">
              Kindly provide the information requested below about your business
              for our review and verification. Your account will be activated
              once requested information is completely provided and verified.
            </p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:space-x-6">
              {organization && (
                <>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        organization.kycDocumentStatus === "approved"
                          ? "bg-green-500"
                          : organization.kycDocumentStatus === "deny"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      <span className="text-white text-xs">
                        {organization.kycDocumentStatus === "approved"
                          ? "✓"
                          : organization.kycDocumentStatus === "deny"
                          ? "✗"
                          : "⋯"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Compliance:{" "}
                      {organization.kycDocumentStatus === "approved"
                        ? "Approved"
                        : organization.kycDocumentStatus === "deny"
                        ? "Denied"
                        : organization.kycDocumentStatus === "pending"
                        ? "Pending"
                        : "Not Uploaded"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        organization.activationFeeStatus === "waived"
                          ? "bg-green-500"
                          : organization.activationFeeStatus === "paid"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      <span className="text-white text-xs">
                        {organization.activationFeeStatus === "waived" ||
                        organization.activationFeeStatus === "paid"
                          ? "✓"
                          : "⋯"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Activation Fee:{" "}
                      {organization.activationFeeStatus === "waived"
                        ? "Waived"
                        : organization.activationFeeStatus === "paid"
                        ? `Paid (₦${
                            organization.activationFee?.toLocaleString() || 0
                          })`
                        : "Pending"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex gap-4 px-4 py-1 min-w-max" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "basic"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "documents"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Business Documents
                </button>
                <button
                  onClick={() => setActiveTab("directors")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "directors"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Directors Information
                </button>
                <button
                  onClick={() => setActiveTab("other")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "other"
                      ? "border-pink-500 text-pink-500"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Other Information
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "basic" && (
                <BasicInformationTab
                  basicInfo={basicInfo}
                  setBasicInfo={setBasicInfo}
                  profileImagePreview={profileImagePreview}
                  selectedProfileFile={selectedProfileFile}
                  profileImageInputRef={profileImageInputRef}
                  onProfileImageSelect={handleProfileImageSelect}
                  onRemoveProfileImage={handleRemoveProfileImage}
                  bannerPreview={bannerPreview}
                  selectedBannerFile={selectedBannerFile}
                  bannerInputRef={bannerInputRef}
                  onBannerFileSelect={handleBannerFileSelect}
                  onBannerUpload={handleBannerUpload}
                  onRemoveBanner={handleRemoveBanner}
                  onSave={handleSaveBasicInfo}
                  isLoading={updateOrganizationProfileMutation.isPending}
                  isBannerUploading={updateBannerMutation.isPending}
                />
              )}
              {activeTab === "documents" && (
                <BusinessDocumentsTab
                  documentFiles={documentFiles}
                  documentInputRefs={documentInputRefs}
                  onDocumentSelect={handleDocumentSelect}
                  onRemoveDocument={handleRemoveDocument}
                  onSave={handleSaveDocuments}
                  isSaving={updateKycDocumentsMutation.isPending}
                />
              )}
              {activeTab === "directors" && (
                <DirectorsInformationTab
                  directors={directors}
                  directorForm={directorForm}
                  setDirectorForm={setDirectorForm}
                  editingDirectorIndex={editingDirectorIndex}
                  onAddDirector={handleAddDirector}
                  onEditDirector={handleEditDirector}
                  onDeleteDirector={handleDeleteDirector}
                  onCancelEdit={handleCancelEditDirector}
                  onSave={handleSaveDirectors}
                  isLoading={updateOrganizationProfileMutation.isPending}
                />
              )}
              {activeTab === "other" && (
                <OtherInformationTab
                  otherInfo={otherInfo}
                  setOtherInfo={setOtherInfo}
                  tinNumber={organization?.tinNumber || ""}
                  onSave={handleSaveOtherInfo}
                  isLoading={
                    updateOrganizationProfileMutation.isPending ||
                    activateOrganizationMutation.isPending
                  }
                />
              )}
            </div>
          </div>
        </div>
      </>
    </DashboardPageLayout>
  );
};

// Basic Information Tab Component
interface BasicInformationTabProps {
  basicInfo: {
    organizationName: string;
    email: string;
    phoneNumber: string;
    organizationCategory: string;
    schoolType: string;
    schoolCategoryBoard: string;
  };
  setBasicInfo: React.Dispatch<
    React.SetStateAction<{
      organizationName: string;
      email: string;
      phoneNumber: string;
      organizationCategory: string;
      schoolType: string;
      schoolCategoryBoard: string;
    }>
  >;
  profileImagePreview: string | null;
  selectedProfileFile: File | null;
  profileImageInputRef: React.RefObject<HTMLInputElement | null>;
  onProfileImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveProfileImage: () => void;
  bannerPreview: string | null;
  selectedBannerFile: File | null;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
  onBannerFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerUpload: () => void;
  onRemoveBanner: () => void;
  onSave: () => void;
  isLoading: boolean;
  isBannerUploading: boolean;
}

const BasicInformationTab = ({
  basicInfo,
  setBasicInfo,
  profileImagePreview,
  selectedProfileFile,
  profileImageInputRef,
  onProfileImageSelect,
  onRemoveProfileImage,
  bannerPreview,
  selectedBannerFile,
  bannerInputRef,
  onBannerFileSelect,
  onBannerUpload,
  onRemoveBanner,
  onSave,
  isLoading,
  isBannerUploading,
}: BasicInformationTabProps) => {
  // Get school category board options based on school type
  const getSchoolCategoryBoardOptions = () => {
    if (basicInfo.schoolType === "tertiary") {
      return TERTIARY_CATEGORY_OPTIONS;
    }
    if (basicInfo.schoolType === "primary") {
      // Filter primary-specific options
      return PRIMARY_SECONDARY_CATEGORY_OPTIONS.filter(
        (option) =>
          option.value !== "publicSecondarySchool" &&
          option.value !== "publicTechnicalSchool"
      );
    }
    if (basicInfo.schoolType === "secondary") {
      // Filter secondary-specific options
      return PRIMARY_SECONDARY_CATEGORY_OPTIONS.filter(
        (option) => option.value !== "publicPrimarySchool"
      );
    }
    // Default fallback
    return PRIMARY_SECONDARY_CATEGORY_OPTIONS;
  };

  const schoolCategoryBoardOptions = getSchoolCategoryBoardOptions();

  return (
    <div className="space-y-6">
      {/* Images Section - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Image Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Logo Image
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Upload your organization logo
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 flex items-center justify-center">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-xs text-center px-3">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span>No logo uploaded</span>
                    </div>
                  )}
                </div>
                {selectedProfileFile && (
                  <button
                    onClick={onRemoveProfileImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label="Remove logo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div>
                <label
                  htmlFor="profile-image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </label>
                <input
                  id="profile-image-upload"
                  ref={profileImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onProfileImageSelect}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Banner Image Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Banner Image
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Upload banner for dashboard display
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="relative">
                <div className="h-32 w-full md:w-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-sm space-y-2">
                      <Upload className="w-8 h-8" />
                      <span>No banner uploaded</span>
                    </div>
                  )}
                </div>
                {selectedBannerFile && (
                  <button
                    onClick={onRemoveBanner}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    aria-label="Remove banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div>
                <label
                  htmlFor="banner-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Select Image
                </label>
                <input
                  ref={bannerInputRef}
                  id="banner-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onBannerFileSelect}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF. Max size 5MB
              </p>
              {selectedBannerFile && (
                <button
                  onClick={onBannerUpload}
                  disabled={isBannerUploading}
                  className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {isBannerUploading ? (
                    <div className="flex items-center space-x-2">
                      <ComponentLoading size="sm" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Banner"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Business Name"
          name="organizationName"
          value={basicInfo.organizationName}
          onChange={(value) =>
            setBasicInfo({ ...basicInfo, organizationName: value })
          }
          placeholder="Enter business name"
          required
        />
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={basicInfo.email}
          onChange={(value) => setBasicInfo({ ...basicInfo, email: value })}
          placeholder="Enter email address"
          required
        />
        <Input
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={basicInfo.phoneNumber}
          onChange={(value) =>
            setBasicInfo({ ...basicInfo, phoneNumber: value })
          }
          placeholder="Enter phone number"
          required
        />
        <Select
          label="Organization Category"
          name="organizationCategory"
          value={basicInfo.organizationCategory}
          onChange={(value) =>
            setBasicInfo({ ...basicInfo, organizationCategory: value })
          }
          options={[
            { value: "school", label: "School" },
            { value: "other", label: "Other" },
          ]}
          placeholder="Select category"
        />
        {basicInfo.organizationCategory === "school" && (
          <>
            <Select
              label="School Type"
              name="schoolType"
              value={basicInfo.schoolType}
              onChange={(value) =>
                setBasicInfo({ ...basicInfo, schoolType: value })
              }
              options={[
                { value: "primary", label: "Primary" },
                { value: "secondary", label: "Secondary" },
                { value: "tertiary", label: "Tertiary" },
              ]}
              placeholder="Select school type"
            />
            <Select
              label={
                basicInfo.schoolType === "tertiary"
                  ? "Institution Type"
                  : "School Category Board"
              }
              name="schoolCategoryBoard"
              value={basicInfo.schoolCategoryBoard}
              onChange={(value) =>
                setBasicInfo({ ...basicInfo, schoolCategoryBoard: value })
              }
              options={schoolCategoryBoardOptions}
              placeholder="Select school category board"
            />
          </>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="px-8"
          fullWidth={false}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

// Business Documents Tab Component
interface BusinessDocumentsTabProps {
  documentFiles: Record<string, { file: File | null; preview: string | null }>;
  documentInputRefs: React.MutableRefObject<
    Record<string, HTMLInputElement | null>
  >;
  onDocumentSelect: (
    docType: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onRemoveDocument: (docType: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const BusinessDocumentsTab = ({
  documentFiles,
  documentInputRefs,
  onDocumentSelect,
  onRemoveDocument,
  onSave,
  isSaving,
}: BusinessDocumentsTabProps) => {
  const documentLabels: Record<string, string> = {
    cacForm2: "CAC Form 2",
    cacForm7: "CAC Form 7",
    utilityBill: "Utility Bill",
    businessReg: "Business Registration",
    memorandum: "Memorandum",
    identityCard: "Identity Card",
    mandateLetter: "Mandate Letter",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(documentLabels).map(([docType, label]) => (
          <div key={docType} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {label}
            </label>
            <div className="relative">
              <label
                htmlFor={`doc-${docType}`}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {documentFiles[docType].preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={documentFiles[docType].preview!}
                      alt={label}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onRemoveDocument(docType);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG (MAX. 10MB)
                    </p>
                  </div>
                )}
              </label>
              <input
                id={`doc-${docType}`}
                ref={(el) => {
                  documentInputRefs.current[docType] = el;
                }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => onDocumentSelect(docType, e)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="px-8"
          fullWidth={false}
        >
          {isSaving ? "Saving..." : "Save Documents"}
        </Button>
      </div>
    </div>
  );
};

// Directors Information Tab Component
interface DirectorsInformationTabProps {
  directors: DirectorFormData[];
  directorForm: DirectorFormData;
  setDirectorForm: React.Dispatch<React.SetStateAction<DirectorFormData>>;
  editingDirectorIndex: number | null;
  onAddDirector: () => void;
  onEditDirector: (index: number) => void;
  onDeleteDirector: (index: number) => void;
  onCancelEdit: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const DirectorsInformationTab = ({
  directors,
  directorForm,
  setDirectorForm,
  editingDirectorIndex,
  onAddDirector,
  onEditDirector,
  onDeleteDirector,
  onCancelEdit,
  onSave,
  isLoading,
}: DirectorsInformationTabProps) => {
  return (
    <div className="space-y-6">
      {/* Add Director Form */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingDirectorIndex !== null ? "Edit Director" : "Add Director"}
          </h3>
          <div className="flex space-x-3">
            <Button
              onClick={onAddDirector}
              disabled={
                !directorForm.fullName || !directorForm.bvn || !directorForm.dob
              }
              className="px-6"
              fullWidth={false}
            >
              {editingDirectorIndex !== null ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2 inline" />
                  Update Director
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add Director
                </>
              )}
            </Button>
            {editingDirectorIndex !== null && (
              <Button
                onClick={onCancelEdit}
                className="px-6 bg-gray-500 hover:bg-gray-600"
                fullWidth={false}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Full Name"
            name="fullName"
            value={directorForm.fullName}
            onChange={(value) =>
              setDirectorForm({ ...directorForm, fullName: value })
            }
            placeholder="Enter full name"
            required
          />
          <Input
            label="BVN"
            name="bvn"
            value={directorForm.bvn}
            onChange={(value) =>
              setDirectorForm({ ...directorForm, bvn: value })
            }
            placeholder="Enter BVN"
            required
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={directorForm.dob}
            onChange={(value) =>
              setDirectorForm({ ...directorForm, dob: value })
            }
            required
          />
        </div>
      </div>

      {/* Directors List */}
      {directors.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Directors ({directors.length})
          </h3>
          <div className="space-y-3">
            {directors.map((director, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {director.fullName}
                  </p>
                  <p className="text-sm text-gray-500">BVN: {director.bvn}</p>
                  <p className="text-sm text-gray-500">DOB: {director.dob}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditDirector(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDirector(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No directors added yet. Add a director to get started.
          </p>
        </div>
      )}

      {/* Save Button */}
      {directors.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="px-8"
            fullWidth={false}
          >
            {isLoading ? "Saving..." : "Save Directors"}
          </Button>
        </div>
      )}
    </div>
  );
};

// Other Information Tab Component
interface OtherInformationTabProps {
  otherInfo: {
    address: string;
    lga: string;
    state: string;
    tinNumber: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  setOtherInfo: React.Dispatch<
    React.SetStateAction<{
      address: string;
      lga: string;
      state: string;
      tinNumber: string;
      bankCode: string;
      accountNumber: string;
      accountName: string;
    }>
  >;
  tinNumber: string;
  onSave: () => void;
  isLoading: boolean;
}

const OtherInformationTab = ({
  otherInfo,
  setOtherInfo,
  tinNumber,
  onSave,
  isLoading,
}: OtherInformationTabProps) => {
  const { showError, showSuccess } = useToast();
  const [banks, setBanks] = useState<
    Array<{
      code?: string;
      bankCode?: string;
      id?: string;
      name?: string;
      bankName?: string;
      [key: string]: any;
    }>
  >([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);

  // Fetch banks list on mount
  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const response = await ConfigService.getBankList();
      if (response && response.data && Array.isArray(response.data)) {
        setBanks(response.data);
      } else {
        setBanks([]);
      }
    } catch (error) {
      setBanks([]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  // Manual account verification handler
  const handleVerifyAccount = async () => {
    // Only verify if we have both bank code and exactly 10-digit account number
    if (
      !otherInfo.bankCode ||
      !otherInfo.accountNumber ||
      otherInfo.accountNumber.length !== 10 ||
      !/^\d{10}$/.test(otherInfo.accountNumber)
    ) {
      return;
    }

    setIsVerifyingAccount(true);
    try {
      // Use POST request with JSON body (as per API documentation)
      const response = await ConfigService.verifyAccount(
        otherInfo.accountNumber,
        otherInfo.bankCode,
        {
          accountNumber: otherInfo.accountNumber,
          bankCode: otherInfo.bankCode,
        }
      );
      if (response && response.data && response.data.accountName) {
        setOtherInfo((prev) => ({
          ...prev,
          accountName: response.data.accountName,
        }));
        showSuccess(
          "Account Verified",
          "Account name has been auto-filled successfully."
        );
      }
    } catch (error: any) {
      // Show user-friendly error message
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to verify account. Please enter the account name manually.";
      showError("Verification Failed", errorMessage);
    } finally {
      setIsVerifyingAccount(false);
    }
  };

  const bankOptions = banks
    .filter((bank) => {
      const hasCode = bank.code || bank.bankCode || bank.id;
      const hasName = bank.name || bank.bankName;
      return hasCode && hasName;
    })
    .map((bank) => ({
      value: bank.code || bank.bankCode || bank.id || "",
      label: bank.name || bank.bankName || "",
    }))
    .filter((option) => option.value && option.label);

  return (
    <div className="space-y-6">
      {/* Other Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Other Information/Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="State"
            name="state"
            value={otherInfo.state}
            onChange={(value) => setOtherInfo({ ...otherInfo, state: value })}
            placeholder="Enter state"
          />
          <Input
            label="LGA"
            name="lga"
            value={otherInfo.lga}
            onChange={(value) => setOtherInfo({ ...otherInfo, lga: value })}
            placeholder="Enter LGA"
          />
          <Input
            label="Address"
            name="address"
            value={otherInfo.address}
            onChange={(value) => setOtherInfo({ ...otherInfo, address: value })}
            placeholder="Enter business address"
          />
          <div>
            <Input
              label="TIN Number"
              name="tinNumber"
              value={tinNumber}
              onChange={() => {}}
              placeholder="TIN Number"
              disabled
              helperText="TIN Number cannot be edited"
            />
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Bank Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {isLoadingBanks ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Bank
                </label>
                <div className="relative">
                  <div className="w-full rounded-lg border border-gray-300 px-4 py-4 bg-gray-50 flex items-center justify-center">
                    <ComponentLoading size="sm" />
                    <span className="ml-2 text-sm text-gray-500">
                      Loading banks...
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <SearchableSelect
                name="bank"
                label="Bank"
                value={otherInfo.bankCode}
                onChange={(value) =>
                  setOtherInfo({
                    ...otherInfo,
                    bankCode: value,
                    accountName: "",
                  })
                }
                disabled={isLoading || isVerifyingAccount}
                placeholder="Select Bank"
                options={bankOptions}
                searchable={true}
                maxHeight="450px"
              />
            )}
          </div>
          <Input
            label="Account Number"
            name="accountNumber"
            type="tel"
            value={otherInfo.accountNumber}
            onChange={(value) => {
              const numericValue = value.replace(/\D/g, "").substring(0, 10);
              setOtherInfo({
                ...otherInfo,
                accountNumber: numericValue,
                accountName: "",
              });
            }}
            placeholder="10 digit bank account number"
            disabled={isLoading || isVerifyingAccount}
            maxLength={10}
            helperText={isVerifyingAccount ? "Verifying account..." : ""}
          />
          <div>
            <Input
              label="Account Name"
              name="accountName"
              value={otherInfo.accountName}
              onChange={(value) =>
                setOtherInfo({ ...otherInfo, accountName: value })
              }
              placeholder="Enter account name or click verify"
              disabled={isLoading || isVerifyingAccount}
              helperText={
                isVerifyingAccount
                  ? "Verifying account..."
                  : "Enter account name manually or click 'Verify Account' to auto-fill"
              }
            />
          </div>
        </div>
        {/* Verify Account Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleVerifyAccount}
            disabled={
              isLoading ||
              isVerifyingAccount ||
              !otherInfo.bankCode ||
              !otherInfo.accountNumber ||
              otherInfo.accountNumber.length !== 10 ||
              !/^\d{10}$/.test(otherInfo.accountNumber)
            }
            className="px-6"
            fullWidth={false}
          >
            {isVerifyingAccount ? "Verifying..." : "Verify Account"}
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={onSave}
          disabled={isLoading}
          className="px-8"
          fullWidth={false}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default BusinessProfile;
