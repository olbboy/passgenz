export interface User {
  id: string;
  email: string;
  roles: string[];
  organization: string;
  mfaEnabled: boolean;
}

export interface AuthenticationResult {
  authenticated: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async authenticate(credentials: {
    email: string;
    password: string;
    mfaCode?: string;
  }): Promise<AuthenticationResult> {
    // Implement actual authentication logic
    if (credentials.email === 'admin@example.com' && credentials.password === 'admin') {
      this.currentUser = {
        id: '1',
        email: credentials.email,
        roles: ['admin'],
        organization: 'Example Org',
        mfaEnabled: true
      };
      return {
        authenticated: true,
        user: this.currentUser,
        token: 'dummy-token'
      };
    }

    return {
      authenticated: false,
      error: 'Invalid credentials'
    };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  hasPermission(permission: string): boolean {
    if (!this.currentUser) return false;
    // Implement actual permission checking
    return this.currentUser.roles.includes('admin');
  }

  logout(): void {
    this.currentUser = null;
  }
} 