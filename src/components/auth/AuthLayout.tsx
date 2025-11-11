import heroImage from "../../assets/hero-student.png";
import heroImage2 from "../../assets/hero-student2.png";
import { Headset } from "lucide-react";
import { Link } from "react-router-dom";
import logoLight from "../../assets/logo-light.svg";
import feesLogo from "../../assets/feesLogo.svg";
import BackButton from "../ui/BackButton";
import { useLocation, useNavigate } from "react-router-dom";

import type { AuthLayoutProps } from "../../interface";
import { 
  REGISTER_PAGES, 
  VERIFICATION_PAGES, 
  REMEMBER_PIN_PAGES, 
  SUPPORT_PAGES,
  isRouteInArray 
} from "../../data";
import { VerificationFooter, RememberPinFooter, SupportFooter } from "./FooterContent";

const AuthLayout = ({
  children,
  rightMaxWidth = "max-w-xl",
  showBackAboveLogo = false,
}: AuthLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  
  const isRegisterPage = isRouteInArray(pathname, REGISTER_PAGES);

  // Footer content logic
  const getFooterContent = () => {
    if (isRouteInArray(pathname, VERIFICATION_PAGES)) {
      return <VerificationFooter />;
    }

    if (isRouteInArray(pathname, REMEMBER_PIN_PAGES)) {
      return <RememberPinFooter />;
    }

    if (isRouteInArray(pathname, SUPPORT_PAGES)) {
      return <SupportFooter />;
    }

    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left - Hero */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden group">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative w-full h-full overflow-hidden ">
            <img
              src={heroImage}
              alt="Student using laptop"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-0 will-change-transform"
            />
            <img
              src={heroImage2}
              alt="Student using laptop - alternate"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 " />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-3">
            <img src={logoLight} alt="EduSpace" className="w-32 h-24" />
          </div>
          <p className="text-lg text-white/90 leading-relaxed max-w-md">
            A management suite for students and education managers to seamlessly
            manage operations in primary and secondary schools
          </p>
        </div>
      </div>

      {/* Right - Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="flex items-center justify-end p-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {isRegisterPage ? (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="inline-block px-4 py-3 text-sm text-white bg-primary hover:text-white hover:bg-primary/50 transition-colors rounded text-center ml-2"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="inline-block px-4 py-3 text-sm text-white bg-primary hover:text-white hover:bg-primary/50 transition-colors rounded text-center ml-2"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
            <a
              href="tel:07033902120"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 transition-colors group"
              title="Contact Support"
            >
              <Headset className="w-5 h-5 text-white group-hover:text-white transition-colors" />
            </a>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className={`w-full ${rightMaxWidth}`}>
            {showBackAboveLogo && (
              <BackButton
                onClick={() => navigate(-1)}
                className="mb-4"
              />
            )}
            <div className="flex items-center gap-3">
              <img src={feesLogo} alt="EduSpace" className="w-32 h-24" />
            </div>
            {children}


            {getFooterContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
