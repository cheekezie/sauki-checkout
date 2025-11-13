import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { loginSchema } from '../../schemas/authSchemas';
import { useFormValidation } from '../../hooks/useFormValidation';
import AuthLayout from '../../components/auth/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Checkbox from '../../components/ui/Checkbox';

const Login = () => {
  const { state, login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [rememberMe, setRememberMe] = useState(false);

  const { formData, errors, updateFieldWithValidation, validateForm } = useFormValidation({
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    const savedPhoneNumber = localStorage.getItem('rememberedPhoneNumber');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedRememberMe && savedPhoneNumber && savedPassword) {
      updateFieldWithValidation('phoneNumber', savedPhoneNumber, loginSchema);
      updateFieldWithValidation('password', savedPassword, loginSchema);
      setRememberMe(true);
    }
  }, [updateFieldWithValidation]);

  const canSubmit =
    !errors.phoneNumber && !errors.password && formData.phoneNumber && formData.password && !state.isLoading;

  const handlePhoneChange = (value: string) => {
    updateFieldWithValidation('phoneNumber', value, loginSchema);
  };

  const handlePasswordChange = (value: string) => {
    updateFieldWithValidation('password', value, loginSchema);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(loginSchema)) {
      return;
    }

    try {
      await login(formData.phoneNumber as string, formData.password as string);

      if (rememberMe) {
        localStorage.setItem('rememberedPhoneNumber', formData.phoneNumber as string);
        localStorage.setItem('rememberedPassword', formData.password as string);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedPhoneNumber');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
      }

      showSuccess('Login Successful', 'Welcome back!');
    } catch (error: any) {
      showError('Login Failed', error.message || state.error || 'Please check your credentials and try again.');
    }
  };

  return (
    <AuthLayout>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2 text-foreground'>Welcome Back</h1>
        <p className='text-muted-foreground'>Log in to continue to your dashboard</p>
      </div>

      <form onSubmit={onSubmit} className='space-y-4'>
        <Input
          label='Email or Phone Number'
          name='email'
          type='text'
          value={formData.phoneNumber as string}
          onChange={handlePhoneChange}
          placeholder='Email or phone number'
          required
          error={errors.phoneNumber}
          inputClassName='placeholder:text-right'
        />

        <Input
          label='Password'
          name='password'
          type='password'
          value={formData.password as string}
          onChange={handlePasswordChange}
          placeholder='**********'
          required
          error={errors.password}
        />

        <div className='flex items-center justify-between'>
          <Checkbox label='Remember me' name='rememberMe' checked={rememberMe} onChange={setRememberMe} />
          <Link to='/forget-pin' className='text-primary font-normal hover:text-primary/80 cursor-pointer text-sm'>
            Forgot Password
          </Link>
        </div>

        <Button
          type='submit'
          disabled={!canSubmit || state.isLoading}
          className='py-4 text-base w-full'
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
            e.currentTarget.style.opacity = '1';
          }}
        >
          {state.isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {/* Social Sign Up Section */}
      <div className='mt-8'>
        <div className='text-center mb-4'>
          <p className='text-muted-foreground text-sm'>Easily Sign up With Social Media Links</p>
        </div>

        <div className='space-y-3'>
          {/* Google Button */}
          <button
            type='button'
            className='w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              />
            </svg>
            Sign Up with Google
          </button>

          {/* Apple Button */}
          <button
            type='button'
            className='w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium'
          >
            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
            </svg>
            Sign Up with Apple
          </button>
        </div>

        {/* Create Account Link */}
        <div className='text-center mt-6'>
          <p className='text-muted-foreground text-sm'>
            Don't have an account?{' '}
            <Link to='/register' className='text-primary font-medium hover:text-primary/80 cursor-pointer'>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
