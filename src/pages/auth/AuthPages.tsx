import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck, User, UserCog } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StaffMember } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials } = useStore();
  const navigate = useNavigate();

  const [portalRole, setPortalRole] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [identifier, setIdentifier] = useState('aarav.shrestha@atelier.np');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSelectRolePreset = (role: 'customer' | 'staff' | 'admin') => {
    setPortalRole(role);
    if (role === 'customer') {
      setIdentifier('aarav.shrestha@atelier.np');
    } else if (role === 'staff') {
      setIdentifier('staff@maisonvera.com');
    } else {
      setIdentifier('admin@maisonvera.com');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const session = loginWithCredentials(identifier, portalRole);
    if (session.accountType === 'admin' || session.accountType === 'staff') {
      navigate('/admin');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          MAISON VÉRA — Unified Identity Portal
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-[#777777] mt-2 leading-relaxed">
          One unified login interface for Private Clients, Atelier Staff, and House Administrators. Select your role or enter your email/username below.
        </p>
      </div>

      {/* Unified Role Switcher: Customer | Staff | Admin */}
      <div className="space-y-2">
        <span className="block text-[11px] uppercase tracking-widest text-[#777777]">
          Select Access Portal (Customer / Staff / Admin)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelectRolePreset('customer')}
            className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              portalRole === 'customer'
                ? 'bg-[#080808] text-white border-[#080808] font-semibold'
                : 'bg-white text-[#080808] border-[#E5E5E5] hover:border-[#080808]'
            }`}
          >
            <User className="h-3.5 w-3.5 shrink-0" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRolePreset('staff')}
            className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              portalRole === 'staff'
                ? 'bg-[#080808] text-white border-[#080808] font-semibold'
                : 'bg-white text-[#080808] border-[#E5E5E5] hover:border-[#080808]'
            }`}
          >
            <UserCog className="h-3.5 w-3.5 shrink-0" />
            <span>Staff</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRolePreset('admin')}
            className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              portalRole === 'admin'
                ? 'bg-[#080808] text-white border-[#080808] font-semibold'
                : 'bg-white text-[#080808] border-[#E5E5E5] hover:border-[#080808]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            Email Address, Username, or Phone *
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your name, email, or phone..."
            className="w-full border border-[#E5E5E5] px-4 py-3 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
          <p className="text-[11px] text-[#777777] mt-1.5">
            {portalRole === 'customer' &&
              'Tip: Enter any name or email to load or create your personal Customer Dashboard.'}
            {portalRole === 'staff' &&
              'Staff Demo: staff@maisonvera.com (Product Manager) or orders@maisonvera.com'}
            {portalRole === 'admin' &&
              'Admin Demo: admin@maisonvera.com (Super Admin full console access)'}
          </p>
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
            <span>Keep my session active</span>
          </label>
          <span className="text-[11px] uppercase tracking-widest text-[#777777]">
            Destination: {portalRole === 'customer' ? 'Client Dashboard' : 'Admin & Staff Console'}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2"
        >
          <span>
            Sign In as{' '}
            {portalRole === 'customer'
              ? 'Customer'
              : portalRole === 'staff'
              ? 'Atelier Staff'
              : 'Administrator'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Sign Up / Create Account Callout Box */}
      <div className="pt-6 border-t border-[#E5E5E5] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#777777]">Don&apos;t have an account yet?</span>
          <span className="text-[11px] uppercase tracking-widest text-[#080808] font-medium">
            Customer · Staff · Admin
          </span>
        </div>
        <Link
          to="/register"
          className="w-full border border-[#080808] text-[#080808] py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#080808] hover:text-white transition-colors flex items-center justify-center"
        >
          Sign Up / Create Personalized Account
        </Link>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { registerAccount } = useStore();
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [staffRole, setStaffRole] = useState<StaffMember['role']>('Product Manager');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+977 98');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(true);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Please enter your full name or username.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    if (!terms) {
      setError('Please accept the Terms & Conditions to create your account.');
      return;
    }

    const session = registerAccount({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      accountType,
      staffRole:
        accountType === 'admin'
          ? 'Super Admin'
          : accountType === 'staff'
          ? staffRole
          : undefined,
    });

    if (session.accountType === 'admin' || session.accountType === 'staff') {
      navigate('/admin');
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          MAISON VÉRA — Account Registration
        </p>
        <h1 className="font-serif text-3xl text-[#080808] mt-1">
          Create Your Account & Dashboard
        </h1>
        <p className="text-xs text-[#777777] mt-1.5">
          Register your name to immediately launch your personalized Customer Dossier or Staff/Admin Console.
        </p>
      </div>

      {error && (
        <div className="border border-red-700 bg-red-50 p-3.5 text-xs text-red-900">
          {error}
        </div>
      )}

      {/* Account Type Selector */}
      <div className="space-y-1.5">
        <label className="block text-[11px] uppercase tracking-widest text-[#777777]">
          Account Role Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setAccountType('customer')}
            className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
              accountType === 'customer'
                ? 'bg-[#080808] text-white border-[#080808] font-semibold'
                : 'bg-white text-[#080808] border-[#E5E5E5]'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('staff')}
            className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
              accountType === 'staff'
                ? 'bg-[#080808] text-white border-[#080808] font-semibold'
                : 'bg-white text-[#080808] border-[#E5E5E5]'
            }`}
          >
            <UserCog className="h-3.5 w-3.5" />
            <span>Staff</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('admin')}
            className={`py-2.5 px-3 border text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 ${
              accountType === 'admin'
                ? 'bg-[#080808] text-white border-[#080808] font-semibold'
                : 'bg-white text-[#080808] border-[#E5E5E5]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
            Your Full Name (Displayed on Your Dashboard) *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Krishna Bhandari"
            className="w-full border border-[#E5E5E5] px-4 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
          />
        </div>

        {accountType === 'staff' && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#080808] mb-1.5">
              Staff Department Role
            </label>
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value as StaffMember['role'])}
              className="w-full border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs text-[#080808]"
            >
              <option value="Product Manager">Product Manager</option>
              <option value="Order Manager">Order Manager</option>
              <option value="Payment Manager">Payment Manager</option>
              <option value="Customer Support">Customer Support</option>
            </select>
          </div>
        )}

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
              placeholder="you@maisonvera.com"
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

        <label className="flex items-start gap-2.5 text-xs text-[#555555] cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="accent-[#080808] mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            I accept the{' '}
            <Link to="/terms" className="underline text-[#080808]">
              MAISON VÉRA Terms & Conditions
            </Link>{' '}
            and authorize my personalized dashboard creation.
          </span>
        </label>

        <button
          type="submit"
          className="w-full bg-[#080808] text-white py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] transition-colors"
        >
          Create Account & Enter{' '}
          {accountType === 'customer' ? 'My Dashboard' : 'Admin Console'}
        </button>
      </form>

      <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
        <span className="text-[#777777]">Already have an account?</span>
        <Link
          to="/login"
          className="uppercase tracking-widest font-semibold text-[#080808] underline underline-offset-4"
        >
          Sign In Here
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
          Enter the email address associated with your MAISON VÉRA dossier to receive a secure password reset token.
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
          Return to Unified Sign In
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
