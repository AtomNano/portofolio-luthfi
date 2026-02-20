import { Link, usePage } from '@inertiajs/react';
import { Layers, LayoutGrid, Briefcase, Wrench, Globe, CreditCard, Settings, Users, ShieldAlert } from 'lucide-react';
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
import { useTenant } from '@/hooks/use-tenant';
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
        href: dashboard.skills ? dashboard.skills.index.url() : '/dashboard/skills',
        icon: Wrench,
    },
    {
        title: 'Billing',
        href: '/dashboard/billing',
        icon: CreditCard,
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Platform KPIs',
        href: '/admin/dashboard',
        icon: ShieldAlert,
    },
    {
        title: 'Manage Users',
        href: '/admin/tenants',
        icon: Users,
    },
    {
        title: 'Global Portfolios',
        href: '/admin/portfolios',
        icon: Layers,
    },
    {
        title: 'Revenue Ledger',
        href: '/admin/transactions',
        icon: CreditCard,
    },
];

export function AppSidebar() {
    const tenant = useTenant();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { auth } = usePage<any>().props;
    const isAdmin = auth?.user?.is_admin;
    const portfolioUrl = tenant?.slug ? `/${tenant.slug}` : '/';

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
                {!isAdmin && <NavMain items={mainNavItems} />}
                
                {isAdmin && (
                    <div className="mt-2 px-4 mb-2 text-xs font-semibold uppercase text-cyan-500 tracking-wider">
                        Administrator
                    </div>
                )}
                {isAdmin && <NavMain items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 bg-transparent">
                {/* Visit Portfolio link */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="text-gray-400 hover:bg-white/10 hover:text-cyan-400">
                            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4" />
                                <span>Lihat Portfolio</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
