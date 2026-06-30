import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [identifier, setIdentifier] = useState("admin@secureguard.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!identifier.trim()) errs.identifier = "Email or username required";
    if (!password.trim()) errs.password = "Password required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(identifier.trim(), password);
      addToast({ type: "success", title: "Welcome back", message: "Signed in successfully." });
    } catch (err) {
      addToast({ type: "error", title: "Login failed", message: err.message });
      if (err.errors) setErrors(err.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary/90 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-page-enter">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SecureGuard Admin</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to manage your agency</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={errors.identifier?.[0] || errors.identifier}
            placeholder="admin@secureguard.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password?.[0] || errors.password}
            placeholder="Enter password"
          />
          <Button type="submit" className="w-full" loading={loading} icon={<Lock className="h-4 w-4" />}>
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          Demo: admin@secureguard.com / password123
        </p>
      </div>
    </div>
  );
}
