import { useOS } from '@/contexts/OSContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TIMEZONES } from '@/types/os';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SettingsApp = () => {
  const { settings, updateSettings } = useOS();
  const { toast } = useToast();
  const [profile, setProfile] = useState({ display_name: '', timezone: '' });
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({ display_name: data.display_name, timezone: data.timezone });
    }
  };

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated" });
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Password changed" });
      setNewPassword('');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-sm text-muted-foreground">Version: v8.0.0.0</p>
      </div>

      {/* Profile Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Profile</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
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
          <Button onClick={saveProfile}>Save Profile</Button>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <Button onClick={changePassword}>Change Password</Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Appearance</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              type="number"
              value={settings.font_size}
              onChange={(e) => updateSettings({ font_size: parseInt(e.target.value) })}
              min="10"
              max="24"
            />
          </div>
          <div>
            <Label htmlFor="zoom">Screen Zoom (%)</Label>
            <Input
              id="zoom"
              type="number"
              value={settings.screen_zoom}
              onChange={(e) => updateSettings({ screen_zoom: parseInt(e.target.value) })}
              min="75"
              max="200"
              step="25"
            />
          </div>
          <div>
            <Label htmlFor="taskbar">Taskbar Position</Label>
            <Select
              value={settings.taskbar_position}
              onValueChange={(value: 'bottom' | 'left' | 'right') => updateSettings({ taskbar_position: value })}
            >
              <SelectTrigger id="taskbar">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom">Bottom</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hoverColor">Hover Color</Label>
            <Input
              id="hoverColor"
              type="color"
              value={settings.hover_color}
              onChange={(e) => updateSettings({ hover_color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Theme Customization</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="borderColor">Border Color</Label>
            <Input
              id="borderColor"
              type="color"
              value={settings.theme.border_color}
              onChange={(e) => updateSettings({ theme: { ...settings.theme, border_color: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="appBg">App Background Color</Label>
            <Input
              id="appBg"
              type="color"
              value={settings.theme.app_background}
              onChange={(e) => updateSettings({ theme: { ...settings.theme, app_background: e.target.value } })}
            />
          </div>
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <Input
              id="textColor"
              type="color"
              value={settings.theme.text_color}
              onChange={(e) => updateSettings({ theme: { ...settings.theme, text_color: e.target.value } })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
