import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting simple login for:', email);
      
      // Simple authentication logic - assign roles based on email
      const userData = {
        uid: `user_${Date.now()}`,
        email: email,
        role: email === 'asif.s@ekkanoo.com.bh' ? 'admin' : 'driver',
        displayName: email.split('@')[0],
        active: true
      };
      
      // Validate credentials (simple validation for now)
      const validCredentials = [
        { email: 'asif.s@ekkanoo.com.bh', password: 'Admin123!' },
        { email: 'kannan.n@ekkanoo.com.bh', password: 'Driver123!' },
        { email: 'test@driver.com', password: 'test123' }
      ];
      
      const isValid = validCredentials.some(cred => 
        cred.email === email && cred.password === password
      );
      
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
      
      console.log('✅ Simple auth successful:', userData);
      
      // Store user session in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      toast({
        title: "Welcome!",
        description: `Successfully signed in as ${userData.role}`
      });
      
      // Force immediate redirect
      window.location.reload();
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-5xl">🛢️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">OILDELIVERY</h1>
          <p className="text-blue-100 text-sm">Professional Oil Delivery Management</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-11 sm:h-12 text-base border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-500"
                  data-testid="input-email"
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-11 sm:h-12 text-base border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 placeholder:text-gray-500"
                  data-testid="input-password"
                  autoComplete="current-password"
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-6"
                data-testid="button-login"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center mt-4 text-xs text-gray-500">
                <p>Valid Credentials:</p>
                <p>Admin: asif.s@ekkanoo.com.bh / Admin123!</p>
                <p>Driver: kannan.n@ekkanoo.com.bh / Driver123!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-blue-100 text-xs">
          <p>OILDELIVERY - Secure Oil Delivery Management System</p>
        </div>
      </div>
    </div>
  );
}