import { Code, Smartphone, PenTool, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Service item interface
 */
export interface ServiceItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

/**
 * Available services offered
 */
export const SERVICES: ServiceItem[] = [
    {
        icon: Code,
        title: 'Full Stack Dev',
        description: 'Building end-to-end web solutions using Laravel, React, and modern tech stacks.',
    },
    {
        icon: Smartphone,
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile application development for iOS and Android.',
    },
    {
        icon: PenTool,
        title: 'UI/UX Design',
        description: 'Creating intuitive and visually stunning interfaces that users love.',
    },
    {
        icon: Terminal,
        title: 'SysAdmin & Support',
        description: 'Server management, deployment automation, and technical infrastructure support.',
    },
];
