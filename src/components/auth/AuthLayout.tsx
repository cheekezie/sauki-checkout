import authImage from "../../assets/auth-image.svg";
import registerImage from "../../assets/register-image.svg";
import registerAccountImage from "../../assets/register-account.svg";
import createPasswordImage from "../../assets/create-password.svg";
import logoLight from "../../assets/logo-light.svg";
import BackButton from "../ui/BackButton";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";

import type { AuthLayoutProps } from "../../interface";

// Map routes to images - you can add more images here
const routeImageMap: Record<string, string> = {
	"/": authImage,
	"/login": authImage,
	"/register": registerImage,
	"/register-account": registerAccountImage,
	"/create-password": createPasswordImage,
	"/auth": authImage,
	"/school-type": authImage,
	"/register-school": authImage,
	"/verification": authImage,
	"/phone-verification": authImage,
	"/forget-pin": authImage,
	"/reset-pin": authImage,
	"/create-pin": authImage,
	// Add more routes and their corresponding images as needed
	// "/register-account": registerAccountImage,
	// "/verification": verificationImage,
};

const getImageForRoute = (pathname: string): string => {
	// Check for exact match first
	if (routeImageMap[pathname]) {
		return routeImageMap[pathname];
	}
	
	// Check for partial matches (for nested routes)
	for (const [route, image] of Object.entries(routeImageMap)) {
		if (pathname.startsWith(route)) {
			return image;
		}
	}
	
	// Default to auth image
	return authImage;
};

const AuthLayout = ({
	children,
	rightMaxWidth = "max-w-lg mt-12",
	showBackAboveLogo = false,
	showLogo = true,
}: AuthLayoutProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	
	// Get the appropriate image based on current route
	const currentImage = useMemo(() => {
		return getImageForRoute(location.pathname);
	}, [location.pathname]);

	return (
		<div className='flex h-screen overflow-hidden'>
			{/* Left - Hero - Now 40% width */}
			<div className='hidden lg:flex lg:w-2/5 relative overflow-hidden group'>
				<div className='relative w-full h-full overflow-hidden'>
					<img
						src={currentImage}
						alt='Auth background'
						className='absolute inset-0 w-full h-full object-cover'
					/>
				</div>
			</div>

			{/* Right - Content - Now 60% width */}
			<div className='flex-1 lg:w-3/5 flex flex-col h-screen overflow-y-auto'>
				<main className='flex-1 flex items-center justify-center px-6 pb-12'>
					<div className={`w-full ${rightMaxWidth}`}>
						{showBackAboveLogo && (
							<BackButton onClick={() => navigate(-1)} className='mb-4' />
						)}
						{showLogo && (
							<div className='flex items-center gap-3 mb-6'>
								<img src={logoLight} alt='EduSpace' className='w-32 h-24' />
							</div>
						)}
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default AuthLayout;
