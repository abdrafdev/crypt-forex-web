import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/nextjs";

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { userId } = useClerkAuth();

  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn,
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      username: user.username || user.firstName || 'User',
      name: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.imageUrl,
    } : null,
    userId,
    signOut,
  };
}
