// Utility functions for authentication

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const user = sessionStorage.getItem('user')
    console.log('Checking authentication status:', !!user)
    return !!user
  }
  return false
}

export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const user = sessionStorage.getItem('user')
    const userData = user ? JSON.parse(user) : null
    console.log('Getting current user:', userData)
    return userData
  }
  return null
}

export function logout(callback?: () => void): void {
  if (typeof window !== 'undefined') {
    console.log('Logging out user')
    sessionStorage.removeItem('user')
    // Call the callback if provided (e.g., to redirect)
    if (callback) {
      callback()
    }
  }
}