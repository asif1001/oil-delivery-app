import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginSimple() {
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

      // Store user session
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.displayName}!`
      });

      // Redirect based on role
      if (userData.role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/driver-dashboard';
      }
    } catch (error) {
      console.error('Simple login error:', error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OILDELIVERY</h1>
            <p className="text-gray-600">Simple Login - Demo Version</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1"
                data-testid="input-password"
              />
            </div>

            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="mt-6 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Demo Accounts:</p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p><strong>Admin:</strong> asif.s@ekkanoo.com.bh</p>
                  <p><strong>Driver:</strong> Any other email</p>
                  <p><strong>Password:</strong> Any password</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}