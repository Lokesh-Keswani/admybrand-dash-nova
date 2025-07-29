import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings as SettingsIcon, Bell, Shield, User, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

export default function Settings() {
  const { user, updateProfile, updatePassword, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Split full name into first and last name
  const nameparts = user?.name?.split(' ') || ['', ''];
  const [firstName, setFirstName] = useState(nameparts[0] || '');
  const [lastName, setLastName] = useState(nameparts.slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', ''];
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleProfileSave = async () => {
    if (!firstName.trim() || !email.trim()) {
      toast({
        title: "Validation Error",
        description: "First name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const fullName = lastName.trim() ? `${firstName.trim()} ${lastName.trim()}` : firstName.trim();
    
    const result = await updateProfile(fullName, email.trim());
    
    if (result.success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All password fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    const result = await updatePassword(currentPassword, newPassword);
    setPasswordLoading(false);
    
    if (result.success) {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "Failed to update password.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and dashboard configuration
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              className="bg-gradient-primary"
              onClick={handleProfileSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive campaign updates via email</p>
              </div>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser notifications</p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
              </div>
              <Switch 
                id="weekly-reports" 
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>
            <Button 
              variant="outline"
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
            >
              {passwordLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}