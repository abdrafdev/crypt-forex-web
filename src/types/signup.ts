export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export interface SignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

// API types
export interface SignupApiRequest {
  email: string;
  username: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface SignupApiResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    createdAt: string;
  };
  errors?: string[];
}
