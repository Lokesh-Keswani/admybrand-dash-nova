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
      const result = await deleteAccount();
      
      if (result.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted and you have been logged out.",
        });
        setDeleteDialogOpen(false);
        setProfileModalOpen(false);
      } else {
        toast({
          title: "Deletion Failed",
          description: result.error || "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
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
    <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <SidebarTrigger className="h-8 w-8 md:h-9 md:w-9 hover:bg-muted/80 hover:backdrop-blur-xl transition-all duration-200 rounded-lg" />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ADmyBRAND
              </h1>
              <p className="text-xs text-muted-foreground hidden md:block">Insights</p>
            </div>
            {/* Mobile brand text */}
            <div className="block sm:hidden">
              <h1 className="text-base font-bold bg-gradient-primary bg-clip-text text-transparent">
                ADmyBRAND
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-muted/80 hover:backdrop-blur-xl transition-all duration-200">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs sm:text-sm font-medium">
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
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-foreground/20 dark:bg-foreground/30" />
              
              {/* Theme toggle for mobile */}
              <div className="block sm:hidden px-2 py-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
              <div className="block sm:hidden">
                <DropdownMenuSeparator className="bg-foreground/20 dark:bg-foreground/30" />
              </div>
              
              {/* Profile Modal Trigger */}
              <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background/90 border-glass-border shadow-2xl max-w-[95vw] sm:mx-4">
                  <DialogHeader className="text-center sm:text-left">
                    <DialogTitle className="flex items-center gap-2 justify-center sm:justify-start">
                      <User className="h-5 w-5 text-primary" />
                      Profile Options
                    </DialogTitle>
                    <DialogDescription className="text-sm text-center sm:text-left">
                      {user?.name} • <span className="break-all">{user?.email}</span>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex flex-col gap-3 py-4">
                    {/* Logout with Confirmation */}
                    <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="justify-center sm:justify-start">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/90 border-glass-border shadow-2xl max-w-[95vw] sm:mx-4 sm:max-w-md">
                        <AlertDialogHeader className="text-center sm:text-left">
                          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to log out? You will need to sign in again to access your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLogout}>
                            Log out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    {/* Delete Account with Confirmation */}
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="justify-center sm:justify-start">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/90 border-glass-border shadow-2xl max-w-[95vw] sm:mx-4 sm:max-w-md">
                        <AlertDialogHeader className="text-center sm:text-left">
                          <AlertDialogTitle className="text-destructive">Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                          <AlertDialogCancel disabled={isDeleting} className="mt-0">Cancel</AlertDialogCancel>
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