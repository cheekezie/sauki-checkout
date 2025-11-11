import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { createPasswordSchema } from "../../schemas/authSchemas";
import { useFormValidation } from "../../hooks/useFormValidation";

const CreatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { formData, errors, updateFieldWithValidation, validateForm } =
    useFormValidation({
      password: "",
      confirmPassword: "",
    });

  // Password validation checks
  const passwordChecks = {
    minLength: (formData.password as string)?.length >= 10,
    hasUpperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password as string),
    hasNumber: /\d/.test(formData.password as string),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      formData.password as string
    ),
  };

  const allChecksPassed =
    passwordChecks.minLength &&
    passwordChecks.hasUpperLower &&
    passwordChecks.hasNumber &&
    passwordChecks.hasSpecialChar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(createPasswordSchema)) {
      return;
    }

    // Navigate to success page after password creation
    const registrationData = {
      ...location.state?.registrationData,
      password: formData.password,
    };

    navigate("/registration-success", {
      state: {
        ...location.state,
        registrationData,
      },
    });
  };

  const canSubmit =
    allChecksPassed &&
    formData.password === formData.confirmPassword &&
    formData.password &&
    formData.confirmPassword;

  return (
			<AuthLayout showLogo={false}>
				<div className='mb-8'>
					<div className='flex items-center gap-3 mb-6'>
						<button
							onClick={() => navigate(-1)}
							className='w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-105 border-0 outline-none group'
							aria-label='Go back'>
							<ArrowLeft className='w-5 h-5 text-foreground transition-transform duration-200 group-hover:-translate-x-1' />
						</button>
						<h1 className='text-2xl font-semibold text-foreground'>Password</h1>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>
						{/* Create Password */}
						<div>
							<Input
								label='Create Password'
								name='password'
								type='password'
								value={formData.password as string}
								onChange={(value) =>
									updateFieldWithValidation("password", value, createPasswordSchema)
								}
								placeholder='**********'
								required
								error={errors.password}
							/>

							{/* Password Requirements */}
							<div className='mt-4 space-y-2'>
								<p className='text-sm font-medium text-foreground mb-3'>
									Password must contain:
								</p>
								<div className='space-y-2'>
									<div
										className={`flex items-center gap-2 text-sm ${
											passwordChecks.minLength ? "text-green-600" : "text-secondary"
										}`}>
										<span className='text-base'>
											{passwordChecks.minLength ? "✓" : "✕"}
										</span>
										<span>A minimum of 10 characters</span>
									</div>
									<div
										className={`flex items-center gap-2 text-sm ${
											passwordChecks.hasUpperLower ? "text-green-600" : "text-secondary"
										}`}>
										<span className='text-base'>
											{passwordChecks.hasUpperLower ? "✓" : "✕"}
										</span>
										<span>Uppercase and lowercase letters</span>
									</div>
									<div
										className={`flex items-center gap-2 text-sm ${
											passwordChecks.hasNumber ? "text-green-600" : "text-secondary"
										}`}>
										<span className='text-base'>
											{passwordChecks.hasNumber ? "✓" : "✕"}
										</span>
										<span>A number</span>
									</div>
									<div
										className={`flex items-center gap-2 text-sm ${
											passwordChecks.hasSpecialChar ? "text-green-600" : "text-secondary"
										}`}>
										<span
											className={`text-base ${
												passwordChecks.hasSpecialChar ? "text-green-600" : "text-red-600"
											}`}>
											{passwordChecks.hasSpecialChar ? "✓" : "✕"}
										</span>
										<span>A special character</span>
									</div>
								</div>
							</div>
						</div>

						{/* Confirm Password */}
						<Input
							label='Confirm Password'
							name='confirmPassword'
							type='password'
							value={formData.confirmPassword as string}
							onChange={(value) =>
								updateFieldWithValidation(
									"confirmPassword",
									value,
									createPasswordSchema
								)
							}
							placeholder='**********'
							required
							error={errors.confirmPassword}
						/>

						{/* Submit Button */}
						<Button
							type='submit'
							disabled={!canSubmit}
							className='w-full py-4 text-base mt-6'
							style={{
								backgroundColor: "var(--color-secondary)",
								color: "white",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "var(--color-secondary)";
								e.currentTarget.style.opacity = "0.9";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "var(--color-secondary)";
								e.currentTarget.style.opacity = "1";
							}}>
							Submit
						</Button>
					</form>
				</div>
			</AuthLayout>
		);
};

export default CreatePassword;

