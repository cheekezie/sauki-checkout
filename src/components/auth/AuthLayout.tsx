import authImage from "../../assets/auth-image.svg";
import logoLight from "../../assets/logo-light.svg";
import BackButton from "../ui/BackButton";
import { useNavigate } from "react-router-dom";

import type { AuthLayoutProps } from "../../interface";

const AuthLayout = ({
	children,
	rightMaxWidth = "max-w-lg mt-12",
	showBackAboveLogo = false,
}: AuthLayoutProps) => {
	const navigate = useNavigate();

	return (
		<div className='flex h-screen overflow-hidden'>
			{/* Left - Hero - Now 40% width */}
			<div className='hidden lg:flex lg:w-2/5 relative overflow-hidden group'>
				<div className='relative w-full h-full overflow-hidden'>
					<img
						src={authImage}
						alt='Student using laptop'
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
						<div className='flex items-center gap-3'>
							<img src={logoLight} alt='EduSpace' className='w-32 h-24' />
						</div>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default AuthLayout;
