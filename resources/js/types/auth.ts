export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    job_title?: string | null;
    phone?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    github?: string | null;
    about_me?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
