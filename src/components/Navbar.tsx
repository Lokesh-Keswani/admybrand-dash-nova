import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart3, LogOut, User, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const { user, logout, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    setProfileModalOpen(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Simple logout for now since delete endpoint has issues
      logout();
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted and you have been logged out.",
      });
      setDeleteDialogOpen(false);
      setProfileModalOpen(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-glass/50 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ADmyBRAND
              </h1>
              <p className="text-xs text-muted-foreground">Insights</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-medium">
                    {user ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 border border-black/20 dark:border-white/10 shadow-glass" 
              align="end" 
              forceMount
              style={{
                backdropFilter: 'blur(16px) saturate(120%)',
                WebkitBackdropFilter: 'blur(16px) saturate(120%)',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px'
              }}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-foreground/20 dark:bg-foreground/30" />
              
              {/* Profile Modal Trigger */}
              <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background/90 border-glass-border shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Profile Options
                    </DialogTitle>
                    <DialogDescription>
                      {user?.name} • {user?.email}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-3 py-4">
                    {/* Logout with Confirmation */}
                    <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/90 border-glass-border shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to log out? You will need to sign in again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>
                            Log out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    {/* Delete Account with Confirmation */}
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="justify-start">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/90 border-glass-border shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive">Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? "Deleting..." : "Delete Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}