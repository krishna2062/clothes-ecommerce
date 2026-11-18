import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MailCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const LoginPage: React.FC = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('aarav.shrestha@atelier.np');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Client Session Authenticated',
      'Welcome back to your private dossier.',
      'success'
    );
    navigate('/account');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Client Portal
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">Sign In to Your Account</h1>
        <p className="text-xs text-[#777777] mt-2">
          Enter your registered email address or phone number to access your orders and saved lookbook pieces.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            Email Address or Phone Number *
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="client@example.com or +977 98..."
            className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs uppercase tracking-wider text-[#080808]">
              Password *
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#777777] hover:text-[#080808] underline underline-offset-4"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-[#555555]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#080808] h-4 w-4"
            />
            <span>Remember my session</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <span className="text-[#777777]">New to the House?</span>
        <Link
          to="/register"
          className="uppercase tracking-widest font-semibold text-[#080808] underline underline-offset-4"
        >
          Create Private Client Account
        </Link>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { updateCustomerProfile, showToast } = useStore();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    if (!terms) {
      setError('Please accept the Terms & Conditions to register.');
      return;
    }

    updateCustomerProfile({ fullName, email, phone });
    showToast(
      'Verification Dispatch Sent',
      `Please verify your email address (${email}).`,
      'success'
    );
    navigate('/verify-email');
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Private Client Registry
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">Create an Account</h1>
      </div>

      {error && (
        <div className="border border-red-700 bg-red-50 p-3.5 text-xs text-red-900">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Aarav Shrestha"
            className="w-full border border-[#E5E5E5] px-4 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@atelier.np"
              className="w-full border border-[#E5E5E5] px-4 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+977 98..."
              className="w-full border border-[#E5E5E5] px-4 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#E5E5E5] px-4 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#E5E5E5] px-4 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
            />
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-[#555555] cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="accent-[#080808] mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            I accept the{' '}
            <Link to="/terms" className="underline text-[#080808]">
              Terms & Conditions
            </Link>{' '}
            and consent to receive private atelier lookbook dispatches.
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors"
        >
          Complete Registration
        </button>
      </form>

      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
        <span className="text-[#777777]">Already registered?</span>
        <Link
          to="/login"
          className="uppercase tracking-widest font-semibold text-[#080808] underline underline-offset-4"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Password Recovery Link Dispatched',
      `Reset instructions sent to ${email}.`,
      'success'
    );
    navigate('/reset-password');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Credential Recovery
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">Forgot Your Password?</h1>
        <p className="text-xs text-[#777777] mt-2 leading-relaxed">
          Enter the email address associated with your client dossier to receive a secure password reset token.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            Registered Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aarav.shrestha@atelier.np"
            className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222]"
        >
          Send Reset Link
        </button>
      </form>

      <div className="pt-4 border-t border-[#E5E5E5] text-xs">
        <Link to="/login" className="underline underline-offset-4 text-[#080808]">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export const ResetPasswordPage: React.FC = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    showToast('Password Updated', 'You may now sign in with your new credentials.', 'success');
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Security Update
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">Establish New Password</h1>
      </div>

      {error && (
        <div className="border border-red-700 bg-red-50 p-3 text-xs text-red-900">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            New Password *
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            Confirm New Password *
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222]"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const { currentCustomer, showToast } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = useState('849204');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Email Verified', 'Your client dossier is now active.', 'success');
    navigate('/account');
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex h-12 w-12 items-center justify-center bg-[#F3F3F3] border border-[#E5E5E5]">
        <MailCheck className="h-5 w-5 text-[#080808]" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Identity Verification
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">Verify Your Email</h1>
        <p className="text-xs text-[#777777] mt-2 leading-relaxed">
          We have sent a 6-digit verification code to{' '}
          <strong className="text-[#080808]">{currentCustomer.email}</strong>.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            6-Digit Verification Code
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-[#E5E5E5] px-4 py-3 text-sm font-mono tracking-[0.4em] text-center text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Confirm & Enter Dossier</span>
        </button>
      </form>

      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => showToast('Verification Code Resent', currentCustomer.email)}
          className="underline text-[#080808]"
        >
          Resend Code
        </button>
        <Link to="/login" className="text-[#777777] hover:text-[#080808]">
          Change Email
        </Link>
      </div>
    </div>
  );
};
