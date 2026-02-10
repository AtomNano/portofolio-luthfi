export type User = {
    id: number;
    name: string;
    email: string;
    google_id?: string | null;
    avatar?: string | null;
    job_title?: string | null;
    phone?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    github?: string | null;
    about_me?: string | null;
    years_experience?: number | null;
    projects_completed?: number | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};


