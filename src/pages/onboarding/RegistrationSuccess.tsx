import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import successImage from '../../assets/success-image.svg';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    // Navigate to login or dashboard after successful registration
    navigate('/login');
  };

  return (
    <div
      className='fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm'
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
    >
      <div className='bg-white rounded-lg max-w-md w-full p-8 text-center border border-gray-200 shadow-2xl backdrop-blur-sm'>
        {/* Illustration Section */}
        <div className='mb-6 flex items-center justify-center'>
          <img src={successImage} alt='Operation Successful' className='w-full h-auto max-h-64 object-contain' />
        </div>

        {/* Text Content */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 mb-3'>Operation Successful</h2>
          <p className='text-gray-600 text-sm'>Registrtion successful. Welcome to SaukiPay</p>
        </div>

        {/* Close Button */}
        <Button
          onClick={handleClose}
          className='w-full py-3 text-base'
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
          Close
        </Button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
