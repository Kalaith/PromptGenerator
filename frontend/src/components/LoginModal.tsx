import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithRedirect, continueAsGuest, getLoginUrl } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in
          </h2>
          <p className="text-gray-600">
            Management features use your WebHatchery account.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <a
            href={getLoginUrl()}
            onClick={(event) => {
              event.preventDefault();
              loginWithRedirect();
            }}
            className="block w-full bg-gradient-to-r from-violet-600 to-sakura-600 text-white py-2 px-4 rounded-lg font-medium text-center hover:from-violet-700 hover:to-sakura-700 transition-all duration-200"
          >
            Sign in with WebHatchery
          </a>

          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError('');
              try {
                await continueAsGuest();
                onClose();
              } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
              } finally {
                setLoading(false);
              }
            }}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Please wait...' : 'Continue as Guest'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
