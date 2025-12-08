// Utility functions for authentication

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return !!user
  }
  return false
}

export function getCurrentUser(): any {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function logout(callback?: () => void): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
    // Call the callback if provided (e.g., to redirect)
    if (callback) {
      callback()
    }
  }
}