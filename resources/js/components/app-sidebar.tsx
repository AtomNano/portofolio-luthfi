import { Link } from '@inertiajs/react';
import { BookOpen, Folder, Layers, LayoutGrid, Briefcase, Wrench } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import dashboard from '@/routes/dashboard';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.index.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Portfolios',
        href: dashboard.portfolios.index.url(),
        icon: Layers,
    },
    {
        title: 'Experiences',
        href: dashboard.experiences.index.url(),
        icon: Briefcase,
    },
    {
        title: 'Skills & Tools',
        href: dashboard.skills ? dashboard.skills.index.url() : '/dashboard/skills', // Fallback if type not updated yet
        icon: Wrench,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-white/10 bg-black/40 backdrop-blur-md font-mono text-gray-200 [&>[data-sidebar=sidebar]]:bg-transparent">
            <SidebarHeader className="border-b border-white/10 bg-transparent">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-white/10 hover:text-cyan-400">
                            <Link href={dashboard.index.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-transparent">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-transparent">
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
