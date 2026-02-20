import { Button } from '@/components/ui/button';
import {
    DiAndroid,
    DiCode,
    DiCss3,
    DiDatabase,
    DiDocker,
    DiGithubBadge,
    DiHtml5,
    DiJava,
    DiJsBadge,
    DiLaravel,
    DiLinux,
    DiMysql,
    DiNodejsSmall,
    DiPhp,
    DiPostgresql,
    DiPython,
    DiReact,
    DiUbuntu,
} from 'react-icons/di';
import { SiFlutter, SiTypescript, SiVuedotjs, SiTailwindcss, SiNextdotjs } from 'react-icons/si';

export const AVAILABLE_ICONS = [
    { id: 'php', name: 'PHP', icon: DiPhp },
    { id: 'laravel', name: 'Laravel', icon: DiLaravel },
    { id: 'html', name: 'HTML5', icon: DiHtml5 },
    { id: 'css', name: 'CSS3', icon: DiCss3 },
    { id: 'js', name: 'JavaScript', icon: DiJsBadge },
    { id: 'ts', name: 'TypeScript', icon: SiTypescript },
    { id: 'react', name: 'React', icon: DiReact },
    { id: 'vue', name: 'Vue.js', icon: SiVuedotjs },
    { id: 'next', name: 'Next.js', icon: SiNextdotjs },
    { id: 'tailwind', name: 'Tailwind', icon: SiTailwindcss },
    { id: 'node', name: 'Node.js', icon: DiNodejsSmall },
    { id: 'python', name: 'Python', icon: DiPython },
    { id: 'java', name: 'Java', icon: DiJava },
    { id: 'android', name: 'Android', icon: DiAndroid },
    { id: 'flutter', name: 'Flutter', icon: SiFlutter },
    { id: 'docker', name: 'Docker', icon: DiDocker },
    { id: 'linux', name: 'Linux', icon: DiLinux },
    { id: 'ubuntu', name: 'Ubuntu', icon: DiUbuntu },
    { id: 'mysql', name: 'MySQL', icon: DiMysql },
    { id: 'pgsql', name: 'PostgreSQL', icon: DiPostgresql },
    { id: 'git', name: 'GitHub', icon: DiGithubBadge },
    { id: 'db', name: 'Database', icon: DiDatabase },
    { id: 'code', name: 'Code', icon: DiCode },
];

interface IconSelectorProps {
    selected: string[];
    onChange: (selected: string[]) => void;
}

export default function IconSelector({ selected = [], onChange }: IconSelectorProps) {
    const toggleIcon = (id: string) => {
        if (selected.includes(id)) {
            onChange(selected.filter((item) => item !== id));
        } else {
            onChange([...selected, id]);
        }
    };

    return (
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
            {AVAILABLE_ICONS.map((item) => {
                const isSelected = selected.includes(item.id);
                return (
                    <Button
                        key={item.id}
                        type="button"
                        variant="outline"
                        className={`flex aspect-square h-auto flex-col items-center justify-center gap-2 p-2 transition-all ${
                            isSelected
                                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 ring-2 ring-cyan-500/20'
                                : 'text-muted-foreground hover:bg-secondary'
                        }`}
                        onClick={() => toggleIcon(item.id)}
                    >
                        <item.icon className={`h-8 w-8 ${isSelected ? 'text-cyan-500' : ''}`} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Button>
                );
            })}
        </div>
    );
}
