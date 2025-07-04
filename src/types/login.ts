export interface LoginFormData {
    email: string
    password: string
}

export interface LoginFormErrors {
    email?: string
    password?: string
    general?: string
}

export interface LoginApiRequest {
    email: string
    password: string
}

export interface LoginApiResponse {
    success: boolean
    message: string
    user?: {
        id: string
        email: string
        username: string
        name: string | null
    }
    token?: string
    errors?: string[]
}