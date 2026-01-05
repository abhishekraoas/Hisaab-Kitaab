import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const acceptInvite = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/trips/accept-invite/${token}`,
          {},
          { withCredentials: true }
        );

        // Redirect to the group details page
        setTimeout(() => {
          navigate(`/group/${response.data.trip._id}`);
        }, 2000);
      } catch (err) {
        console.error('Error accepting invite:', err);
        setError(err.response?.data?.message || 'Failed to accept invite');
        setLoading(false);
      }
    };

    acceptInvite();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {loading && !error && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Accepting Invite...</h2>
              <p className="text-gray-600">Please wait while we add you to the group.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-6">✓</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">You've been added to the group. Redirecting...</p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                🏠 Go to Home
              </button>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-6">✕</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Invite</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
