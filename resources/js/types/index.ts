export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export type Portfolio = {
    id: number;
    title: string;
    category: string;
    description: string;
    project_url: string | null;
    image_path: string | null;
    development_time: string | null;
    tools: string[] | null;
    github_url: string | null;
    video_url: string | null;
    images: { id: number; image_path: string }[];
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
