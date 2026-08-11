import { Navigate } from 'react-router';

export default function AdminRoute({ children }) {
  const userJSON = localStorage.getItem('user');
  
  let user = null;
  try {
    // Safely parse JSON; if it's corrupted like "[object Object]", catch it
    user = userJSON ? JSON.parse(userJSON) : null;
  } catch (err) {
    console.error("Corrupted user data in localStorage, clearing it...");
    localStorage.removeItem('user');
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}