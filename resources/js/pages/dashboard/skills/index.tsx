import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Wrench, Share2, Loader2, Code } from 'lucide-react';
import type { FormEvent} from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { PageProps, BreadcrumbItem } from '@/types';
import type { Skill, SocialLink} from '@/types/profile';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let route: any;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Skills & Tools',
        href: '/dashboard/skills',
    },
];

interface SkillsPageProps extends PageProps {
    skills: Skill[];
    soft_skills: SoftSkill[];
    social_links: SocialLink[];
}

interface SoftSkill {
    name: string;
    icon?: string;
}

export default function SkillsManager({ skills, soft_skills, social_links }: SkillsPageProps) {
    const { data, setData, patch, processing, errors, recentlySuccessful, transform } = useForm({
        skills: skills || [],
        soft_skills: soft_skills || [],
        social_links: social_links || [],
    });

    // Clean empty social links before submission
    transform((data) => ({
        ...data,
        social_links: data.social_links.filter(link => link.url && link.url.trim() !== '')
    }));
    


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

    // Helper for success toasts
    const showSuccessToast = (message: string) => {
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: 'success',
            title: message
        });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        // Data transformation is handled by the `transform` callback above
        patch(route('dashboard.skills.update'), {
            preserveScroll: true,
            onError: (errors) => {
                const errorMessages = Object.values(errors).flat().join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: errorMessages || 'Please check the form for errors.',
                    confirmButtonColor: '#ef4444',
                });
            }
        });
    };

    // Skills Handlers


    const removeSkill = (index: number) => {
        const newSkills = [...data.skills];
        newSkills.splice(index, 1);
        setData('skills', newSkills);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateSkill = (index: number, key: keyof Skill, value: any) => {
        const newSkills = [...data.skills];
        newSkills[index] = { ...newSkills[index], [key]: value };
        setData('skills', newSkills);
    };
    // Soft Skills Handlers
    const addSoftSkill = () => {
        setData('soft_skills', [
            ...data.soft_skills,
            { name: '', icon: '' } // Default empty soft skill
        ]);
    };

    const removeSoftSkill = (index: number) => {
        const newSoftSkills = data.soft_skills.filter((_, i) => i !== index);
        setData('soft_skills', newSoftSkills);
    };

    const updateSoftSkill = (index: number, field: keyof SoftSkill, value: string) => {
        const newSoftSkills = [...data.soft_skills];
        newSoftSkills[index] = { ...newSoftSkills[index], [field]: value };
        setData('soft_skills', newSoftSkills);
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

            <div className="p-6 max-w-7xl mx-auto pb-24">
                <form onSubmit={submit}>
                    {/* Header Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Skills & Tools</h1>
                            <p className="text-muted-foreground mt-1">
                                Manage your technical expertise, soft skills, and social presence.
                            </p>
                        </div>
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            size="lg"
                            className="shadow-lg shadow-primary/20"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="space-y-12">
                        {/* SECTION 1: TECHNICAL SKILLS */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Technical Skills</h2>
                                        <p className="text-sm text-muted-foreground">Grouped by category (e.g. Backend, Frontend)</p>
                                    </div>
                                </div>
                                <Button type="button" variant="secondary" onClick={() => {
                                    Swal.fire({
                                        title: 'New Category Name',
                                        input: 'text',
                                        inputPlaceholder: 'e.g., Cloud Services',
                                        showCancelButton: true,
                                        confirmButtonText: 'Create',
                                    }).then((result) => {
                                        if (result.isConfirmed && result.value) {
                                            setData('skills', [
                                                ...data.skills,
                                                { name: '', level: 50, category: result.value }
                                            ]);
                                            showSuccessToast(`Category "${result.value}" created`);
                                        }
                                    });
                                }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Category
                                </Button>
                            </div>

                            {data.skills.length === 0 && (
                                <div className="text-center py-16 border-2 border-dashed rounded-xl bg-card/50 text-muted-foreground">
                                    <p>No technical skills added yet.</p>
                                    <p className="text-sm mt-1">Create a category to get started.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(data.skills.reduce((acc, skill, index) => {
                                    if (!acc[skill.category]) acc[skill.category] = [];
                                    acc[skill.category].push({ skill, index });
                                    return acc;
                                }, {} as Record<string, { skill: Skill; index: number }[]>)).map(([category, categoryItems]) => (
                                    <Card key={category} className="shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                            <h3 className="font-semibold text-lg truncate" title={category}>{category}</h3>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => {
                                                         Swal.fire({
                                                            title: 'Rename Category',
                                                            input: 'text',
                                                            inputValue: category,
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Rename',
                                                        }).then((result) => {
                                                            if (result.isConfirmed && result.value && result.value !== category) {
                                                                const newSkills = data.skills.map(s => 
                                                                    s.category === category ? { ...s, category: result.value } : s
                                                                );
                                                                setData('skills', newSkills);
                                                                showSuccessToast(`Renamed to "${result.value}"`);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <Wrench className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: 'Delete Category?',
                                                            text: `Remove "${category}" and all its skills?`,
                                                            icon: 'warning',
                                                            showCancelButton: true,
                                                            confirmButtonColor: '#ef4444',
                                                            confirmButtonText: 'Delete'
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                const newSkills = data.skills.filter(s => s.category !== category);
                                                                setData('skills', newSkills);
                                                                showSuccessToast('Category deleted');
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {categoryItems.map(({ skill, index: realIndex }) => (
                                                <div key={realIndex} className="space-y-3 p-3 bg-secondary/30 rounded-lg group">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1 space-y-1">
                                                            <Input
                                                                value={skill.name}
                                                                onChange={(e) => updateSkill(realIndex, 'name', e.target.value)}
                                                                placeholder="Skill Name (e.g. React)"
                                                                className="h-8 text-sm"
                                                            />

                                                            <InputError message={errors[`skills.${realIndex}.name`]} />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                                            onClick={() => removeSkill(realIndex)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                            <span>Proficiency</span>
                                                            <span>{skill.level}%</span>
                                                        </div>
                                                        <input
                                                            type="range"
                                                            min="1"
                                                            max="100"
                                                            className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                                                            value={skill.level}
                                                            onChange={(e) => updateSkill(realIndex, 'level', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full border-dashed text-xs"
                                                onClick={() => setData('skills', [...data.skills, { name: '', level: 50, category }])}
                                            >
                                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                                Add Skill
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        <Separator />

                        {/* SECTION 2: SOFT SKILLS */}
                        <section>
                             <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-500/10 rounded-xl">
                                        <Code className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Soft Skills</h2>
                                        <p className="text-sm text-muted-foreground">Personal attributes & interpersonal skills</p>
                                    </div>
                                </div>
                                <Button type="button" variant="secondary" onClick={addSoftSkill}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Soft Skill
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {data.soft_skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-card border rounded-xl p-4 shadow-sm group hover:border-purple-500/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-lg">
                                                {skill.icon || '✨'}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeSoftSkill(index)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Skill Name</Label>
                                                <Input
                                                    value={skill.name}
                                                    onChange={(e) => updateSoftSkill(index, 'name', e.target.value)}
                                                    placeholder="e.g. Leadership"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-muted-foreground">Emoji Icon</Label>
                                                <Input
                                                    value={skill.icon || ''}
                                                    onChange={(e) => updateSoftSkill(index, 'icon', e.target.value)}
                                                    placeholder="e.g. 🤝"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {data.soft_skills.length === 0 && (
                                     <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl bg-card/50 text-muted-foreground">
                                        <p>No soft skills yet.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        <Separator />

                        {/* SECTION 3: SOCIAL LINKS */}
                        <section>
                             <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-cyan-500/10 rounded-xl">
                                        <Share2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Social Links</h2>
                                        <p className="text-sm text-muted-foreground">Your presence across the web</p>
                                    </div>
                                </div>
                                <Button type="button" variant="secondary" onClick={addSocialLink}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Link
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {data.social_links.map((link, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border rounded-xl bg-card shadow-sm group hover:border-cyan-500/50 transition-colors">
                                        <div className="cursor-move text-muted-foreground hover:text-foreground">
                                            {/* We could add drag handle here if using dnd, for now just an icon */}
                                            <Share2 className="w-4 h-4 opacity-50" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                <select
                                                    className="col-span-1 h-8 rounded-md border border-input bg-background px-2 text-xs font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                                                    className="col-span-2 h-8 text-xs"
                                                    placeholder="URL / Handle"
                                                    value={link.url}
                                                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                                    onBlur={(e) => {
                                                        const val = e.target.value.trim();
                                                        if (val && !val.match(/^(https?:\/\/|mailto:)/)) {
                                                            updateSocialLink(index, 'url', 'https://' + val);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeSocialLink(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {data.social_links.length === 0 && (
                                     <div className="col-span-full text-center py-12 border-2 border-dashed rounded-xl bg-card/50 text-muted-foreground">
                                        <p>No social links added.</p>
                                    </div>
                                )}
                            </div>

                             {errors.social_links && <InputError message={errors.social_links} className="mt-4" />}
                        </section>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
