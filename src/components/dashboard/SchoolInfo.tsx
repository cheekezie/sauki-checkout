import { Building, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { useOrganizationProfile } from "../../hooks/useOrganizations";
import { ComponentLoading } from "../ui/LoadingSpinner";
import { useDecodedAuth } from "../../hooks/useDecodedAuth";
import { MerchantRoles } from "../../enums/merchant.enum";

const SchoolInfo = () => {
  const { role, isLoading: authLoading } = useDecodedAuth();
  
  // Only fetch organization profile for users with organizations (not portalAdmin)
  const isPortalAdmin = role === MerchantRoles.PORTAL_ADMIN;
  const { data, isLoading, error } = useOrganizationProfile({
    enabled: !authLoading && !isPortalAdmin, // Disable query for portalAdmin and while auth is loading
  });
  const organization = data?.data;
  
  const isForbiddenError = error && 
    (error as any)?.message?.includes("Only Organization Admin And Their Staff Are Allowed");

  // Don't render anything if auth is still loading or if portalAdmin
  if (authLoading || isPortalAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
        <div className="flex items-center justify-center min-h-[200px]">
          <ComponentLoading size="md" />
        </div>
      </div>
    );
  }

  // If forbidden error, show a message (shouldn't happen now, but just in case)
  if (isForbiddenError) {
    return (
      <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-dark" />
            <h2 className="text-xl font-semibold text-text">Organization Information</h2>
          </div>
        </div>
        <div className="bg-offwhite/30 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-dark">
            Unable to load organization information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Get organization data
  const address = organization?.address || organization?.location || organization?.lga || "";
  const state = organization?.state || "";
  const fullAddress = address && state ? `${address}, ${state}` : address || state || "—";
  const phoneNumber = organization?.phoneNumber || "—";
  const orgName = organization?.organizationName || "—";
  const kycStatus = organization?.kycDocumentStatus || "pending";
  const kycStatusLabel = kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1);
  
  // Banner image with fallback: banner > logo > default placeholder
  const bannerImage = organization?.kycDocument?.banner || organization?.bannerImage || null;
  const orgLogo = organization?.kycDocument?.logo || null;
  const defaultImage = "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
  
  // Priority: banner > logo > default
  const imageSrc = bannerImage || orgLogo || defaultImage;

  return (
    <div className="bg-bg/60 backdrop-blur-xl rounded-2xl p-6 shadow-sm font-sora">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Building className="w-5 h-5 text-dark" />
          <h2 className="text-xl font-semibold text-text">
            {organization?.organizationCategory === "school" ? "School Information" : "Organization Information"}
          </h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-primary/10 text-dark hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center">
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      {/* Organization Card */}
      <div className="bg-offwhite/30 rounded-2xl shadow-sm overflow-hidden">
        {/* Organization Image */}
        <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
          <img
            src={imageSrc}
            alt={orgName}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback chain: try logo, then default
              const target = e.target as HTMLImageElement;
              if (target.src !== orgLogo && orgLogo) {
                target.src = orgLogo;
              } else if (target.src !== defaultImage) {
                target.src = defaultImage;
              }
            }}
          />
        </div>

        {/* Organization Details */}
        <div className="p-6">
          {/* Organization Name and Badge */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-text">{orgName}</h3>
            <span className={`px-3 py-1 text-[10px] font-medium rounded-full ${
              kycStatus === "approved" 
                ? "bg-green-100 text-green-700" 
                : kycStatus === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}>
              {kycStatusLabel}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-3 mb-3">
            <MapPin className="w-4 h-4 text-dark mt-0.5 flex-shrink-0" />
            <p className="text-sm text-dark">{fullAddress}</p>
          </div>

          {/* Contact */}
          <div className="flex items-start space-x-3">
            <Phone className="w-4 h-4 text-dark mt-0.5 flex-shrink-0" />
            <p className="text-sm text-dark">{phoneNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolInfo;
