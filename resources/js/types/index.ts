export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type Plan = {
    id: number;
    name: string;
    slug: string;
    features: Record<string, unknown>;
    limits: Record<string, number | null>;
    is_free: boolean;
};

export type Tenant = {
    id: number;
    name: string;
    slug: string;
    primary_color: string;
    status: string;
    subscription_status: string;
    plan: Plan | null;
};

export type SharedData = {
    name: string;
    auth: Auth;
    tenant: Tenant | null;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export type PageProps<T = Record<string, unknown>> = T & SharedData;


export type Portfolio = {
    id: number;
    title: string;
    category: string;
    description: string;
    project_url: string | null;
    image_path: string | null;
    thumbnail_path: string | null;
    development_time: string | null;
    tools: string[] | null;
    github_url: string | null;
    video_url: string | null;
    images: { id: number; image_path: string }[];
    user?: { id: number; name: string; username: string };
    created_at: string;
    updated_at: string;
};

export type Experience = {
    id: number;
    role: string;
    company: string;
    period: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
};
