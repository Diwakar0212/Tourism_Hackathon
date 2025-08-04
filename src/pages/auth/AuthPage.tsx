import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Calendar, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface AuthPageProps {
  onSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, register, resetPassword } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    emergencyContacts: []
  });

  // Reset password state
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.email, loginData.password);
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        dateOfBirth: registerData.dateOfBirth,
        gender: registerData.gender,
        phoneNumber: registerData.phoneNumber,
        emergencyContacts: []
      });
      onSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(resetEmail);
      setError('Password reset email sent! Check your inbox.');
      setTimeout(() => setMode('login'), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLogin = () => (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your SafeSolo account</p>
      </div>

      <Input
        label="Email Address"
        type="email"
        value={loginData.email}
        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        icon={<Mail className="h-5 w-5" />}
        placeholder="Enter your email"
        required
        fullWidth
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          icon={<Lock className="h-5 w-5" />}
          placeholder="Enter your password"
          required
          fullWidth
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setMode('reset')}
          className="text-sm text-teal-600 hover:text-teal-700"
        >
          Forgot your password?
        </button>
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setMode('register')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Create Account
          </button>
        </p>
      </div>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600">Join SafeSolo for safer travel experiences</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          value={registerData.firstName}
          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
          icon={<User className="h-5 w-5" />}
          placeholder="First name"
          required
          fullWidth
        />
        <Input
          label="Last Name"
          type="text"
          value={registerData.lastName}
          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
          icon={<User className="h-5 w-5" />}
          placeholder="Last name"
          required
          fullWidth
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={registerData.email}
        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
        icon={<Mail className="h-5 w-5" />}
        placeholder="Enter your email"
        required
        fullWidth
      />

      <Input
        label="Phone Number"
        type="tel"
        value={registerData.phoneNumber}
        onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
        icon={<Phone className="h-5 w-5" />}
        placeholder="Enter your phone number"
        fullWidth
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date of Birth"
          type="date"
          value={registerData.dateOfBirth}
          onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
          icon={<Calendar className="h-5 w-5" />}
          required
          fullWidth
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={registerData.gender}
            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={registerData.password}
          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          icon={<Lock className="h-5 w-5" />}
          placeholder="Create a password"
          required
          fullWidth
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <Input
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        value={registerData.confirmPassword}
        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
        icon={<Shield className="h-5 w-5" />}
        placeholder="Confirm your password"
        required
        fullWidth
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email to receive reset instructions</p>
      </div>

      <Input
        label="Email Address"
        type="email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        icon={<Mail className="h-5 w-5" />}
        placeholder="Enter your email"
        required
        fullWidth
      />

      {error && (
        <div className={`border rounded-lg p-3 ${
          error.includes('sent') 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm ${
            error.includes('sent') ? 'text-green-600' : 'text-red-600'
          }`}>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Email'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode('login')}
          className="text-sm text-teal-600 hover:text-teal-700"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {mode === 'login' && renderLogin()}
        {mode === 'register' && renderRegister()}
        {mode === 'reset' && renderResetPassword()}
      </Card>
    </div>
  );
};

export default AuthPage;
