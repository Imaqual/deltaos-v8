import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TIMEZONES } from '@/types/os';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const RULES = [
  "No sharing link without permission",
  "Owning the website will have the potential to get the user in trouble and is not the website's fault",
  "No showing NSFW content",
];

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    timezone: 'America/New_York',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate('/');
    }
  };

  const handleSignUp = async () => {
    if (!acceptedRules) {
      window.location.href = 'https://google.com';
      return;
    }

    if (!formData.email || !formData.password || !formData.displayName) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          display_name: formData.displayName,
          timezone: formData.timezone,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      navigate('/');
    }
  };

  if (showRules && isSignUp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden gradient-windows">
        {/* Animated wave blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 wave-blob animate-wave" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white/15 wave-blob animate-wave" style={{ animationDelay: '5s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-white/10 wave-blob animate-wave" style={{ animationDelay: '10s' }} />
        </div>
        
        <Card className="w-full max-w-2xl relative z-10 backdrop-blur-md bg-white/90 border-white/20">
          <CardHeader>
            <CardTitle className="text-gradient">DeltaOS Terms of Service</CardTitle>
            <CardDescription>Please read and accept these rules to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Rules:</h3>
              <ul className="list-disc list-inside space-y-2">
                {RULES.map((rule, idx) => (
                  <li key={idx} className="text-sm">{rule}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rules"
                checked={acceptedRules}
                onCheckedChange={(checked) => setAcceptedRules(checked as boolean)}
              />
              <label htmlFor="rules" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I accept the terms and rules
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowRules(false)} variant="outline">Back</Button>
              <Button onClick={handleSignUp} disabled={!acceptedRules || loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden gradient-windows">
      {/* Animated wave blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 wave-blob animate-wave" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white/15 wave-blob animate-wave" style={{ animationDelay: '5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-white/10 wave-blob animate-wave" style={{ animationDelay: '10s' }} />
      </div>
      
      <Card className="w-full max-w-md relative z-10 backdrop-blur-md bg-white/90 border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient">Welcome to DeltaOS</CardTitle>
          <CardDescription>
            {isSignUp ? 'Create your account to get started' : 'Sign in to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {isSignUp && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map(tz => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            className="w-full"
            onClick={isSignUp ? () => setShowRules(true) : handleSignIn}
            disabled={loading}
          >
            {loading ? 'Loading...' : isSignUp ? 'Continue' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
