export interface Skill {
    name: string;
    level: number;
    category: 'Backend' | 'Frontend' | 'DevOps' | string;
}

export interface SoftSkill {
    name: string;
    icon?: string;
}

export interface SocialLink {
    platform: string;
    url: string;
    icon?: string;
    color?: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    job_title?: string;
    phone?: string;
    address?: string;
    bio?: string;
    skills?: Skill[];
    soft_skills?: SoftSkill[];
    social_links?: SocialLink[];
    years_experience?: number;
    projects_completed?: number;
    created_at?: string;
    updated_at?: string;
    // Optional social fields for backward compatibility/convenience
    github?: string;
    linkedin?: string;
    instagram?: string;
}
