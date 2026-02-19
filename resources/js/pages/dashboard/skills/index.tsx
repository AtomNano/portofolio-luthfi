import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { PageProps, BreadcrumbItem } from '@/types';
import { Skill, SocialLink, UserProfile } from '@/types/profile';
import { Plus, Trash2, Save, Wrench, Share2 } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import InputError from '@/components/input-error';
import Swal from 'sweetalert2';

declare let route: any;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Skills & Tools',
        href: '/dashboard/skills',
    },
];

interface SkillsPageProps extends PageProps {
    skills: Skill[];
    social_links: SocialLink[];
}

export default function SkillsManager({ skills, social_links }: SkillsPageProps) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        skills: skills || [],
        social_links: social_links || [],
    });
    
    // @ts-ignore
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (recentlySuccessful) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            
            Toast.fire({
                icon: 'success',
                title: 'Skills & Social Links saved successfully'
            });
        }
    }, [recentlySuccessful]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('skills.update'), {
            preserveScroll: true,
        });
    };

    // Skills Handlers
    const addSkill = () => {
        setData('skills', [
            ...data.skills,
            { name: '', level: 50, category: 'Backend' },
        ]);
    };

    const removeSkill = (index: number) => {
        const newSkills = [...data.skills];
        newSkills.splice(index, 1);
        setData('skills', newSkills);
    };

    const updateSkill = (index: number, key: keyof Skill, value: any) => {
        const newSkills = [...data.skills];
        newSkills[index] = { ...newSkills[index], [key]: value };
        setData('skills', newSkills);
    };

    // Social Links Handlers
    const addSocialLink = () => {
        setData('social_links', [
            ...data.social_links,
            { platform: 'GitHub', url: '' },
        ]);
    };

    const removeSocialLink = (index: number) => {
        const newLinks = [...data.social_links];
        newLinks.splice(index, 1);
        setData('social_links', newLinks);
    };

    const updateSocialLink = (index: number, key: keyof SocialLink, value: string) => {
        const newLinks = [...data.social_links];
        newLinks[index] = { ...newLinks[index], [key]: value };
        setData('social_links', newLinks);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Skills & Tools" />

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Skills & Tools</h1>
                        <p className="text-muted-foreground">
                            Manage your technical expertise and social connections.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={submit} disabled={processing}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Skills */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Wrench className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Technical Skills</h2>
                                </div>
                                <Button variant="outline" size="sm" onClick={addSkill}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Skill
                                </Button>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                {data.skills.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No skills added yet. Click "Add Skill" to start.
                                    </div>
                                )}
                                {data.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="group flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-background hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Skill Name</Label>
                                                <Input
                                                    placeholder="e.g. React"
                                                    value={skill.name}
                                                    onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <select
                                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                    value={skill.category}
                                                    onChange={(e) => updateSkill(index, 'category', e.target.value)}
                                                >
                                                    <option value="Backend">Backend</option>
                                                    <option value="Frontend">Frontend</option>
                                                    <option value="DevOps">DevOps</option>
                                                    <option value="Mobile">Mobile</option>
                                                    <option value="Tools">Tools</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                                <div className="flex justify-between">
                                                    <Label>Proficiency</Label>
                                                    <span className="text-sm font-medium text-muted-foreground">{skill.level}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="100"
                                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                                    value={skill.level}
                                                    onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-start justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => removeSkill(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* @ts-ignore */}
                            <InputError message={errors.skills} className="mt-4" />
                        </div>
                    </div>

                    {/* Right Column: Social Links */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Share2 className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h2 className="text-lg font-semibold">Social Links</h2>
                                </div>
                                <Button variant="outline" size="icon" onClick={addSocialLink} title="Add Link">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4">
                                {data.social_links.length === 0 && (
                                    <div className="text-center py-6 text-sm text-muted-foreground">
                                        No social links added.
                                    </div>
                                )}
                                {data.social_links.map((link, index) => (
                                    <div key={index} className="p-3 border rounded-lg bg-background space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-xs uppercase text-muted-foreground font-bold">Platform</Label>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-destructive"
                                                onClick={() => removeSocialLink(index)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <select
                                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={link.platform}
                                            onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                        >
                                            <option value="GitHub">GitHub</option>
                                            <option value="LinkedIn">LinkedIn</option>
                                            <option value="Twitter">Twitter</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="YouTube">YouTube</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Email">Email</option>
                                            <option value="Website">Website</option>
                                        </select>
                                        <Input
                                            className="h-8 text-xs"
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                             {/* @ts-ignore */}
                            <InputError message={errors.social_links} className="mt-4" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
