import { Navigate } from 'react-router';

export default function AdminRoute({ children }) {
  const userJSON = localStorage.getItem('user');

  let user = null;
  try {
    user = userJSON ? JSON.parse(userJSON) : null;
  } catch (err) {
    console.error('Corrupted user data in localStorage, clearing it...');
    localStorage.removeItem('user');
  }

  const token = localStorage.getItem('token');
  const isAdmin = Boolean(user?.isAdmin);

  if (!token || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
