import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { UserProfile, Skill, SocialLink } from '@/types/profile';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { FormEvent } from 'react';
import { PageProps } from '@/types';

// Add route definition if missing in global types
declare let route: any;

const breadcrumbs = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user as unknown as UserProfile; // Cast to UserProfile to access new fields

    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        job_title: user.job_title || '',
        bio: user.bio || '',
        address: user.address || '',
        phone: user.phone || '',
        avatar: null as File | null,
        skills: user.skills || [],
        social_links: user.social_links || [],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('settings.profile.update'), {
            preserveScroll: true,
        });
    };

    const addSkill = () => {
        setData('skills', [
            ...(data.skills || []),
            { name: '', level: 1, category: 'Backend' },
        ]);
    };

    const removeSkill = (index: number) => {
        const newSkills = [...(data.skills || [])];
        newSkills.splice(index, 1);
        setData('skills', newSkills);
    };

    const updateSkill = (index: number, key: keyof Skill, value: any) => {
        const newSkills = [...(data.skills || [])];
        newSkills[index] = { ...newSkills[index], [key]: value };
        setData('skills', newSkills);
    };

    const addSocialLink = () => {
        setData('social_links', [
            ...(data.social_links || []),
            { platform: '', url: '', icon: 'link' },
        ]);
    };

    const removeSocialLink = (index: number) => {
        const newLinks = [...(data.social_links || [])];
        newLinks.splice(index, 1);
        setData('social_links', newLinks);
    };

    const updateSocialLink = (index: number, key: keyof SocialLink, value: string) => {
        const newLinks = [...(data.social_links || [])];
        newLinks[index] = { ...newLinks[index], [key]: value };
        setData('social_links', newLinks);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your profile details, skills, and social links"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Avatar */}
                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            {user.avatar && (
                                <div className="mb-2">
                                    <img
                                        src={`/storage/${user.avatar}`}
                                        alt="Current Avatar"
                                        className="h-20 w-20 rounded-full object-cover border border-gray-200"
                                    />
                                </div>
                            )}
                            <Input
                                id="avatar"
                                type="file"
                                className="mt-1 block w-full cursor-pointer"
                                onChange={(e) => setData('avatar', e.target.files ? e.target.files[0] : null)}
                                accept="image/*"
                            />
                            <InputError className="mt-2" message={errors.avatar} />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="job_title">Job Title</Label>
                                <Input
                                    id="job_title"
                                    value={data.job_title}
                                    onChange={(e) => setData('job_title', e.target.value)}
                                    placeholder="e.g. Full Stack Developer"
                                />
                                <InputError message={errors.job_title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+62..."
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="City, Country"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                rows={4}
                                placeholder="Tell us about yourself..."
                            />
                            <InputError message={errors.bio} />
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <Heading variant="small" title="Skills" description="Manage your technical skills" />
                                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                                    <Plus className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {data.skills.map((skill, index) => (
                                    <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-card text-card-foreground shadow-sm">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Skill Name"
                                                value={skill.name}
                                                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                            />
                                            <div className="flex gap-2">
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
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={skill.level}
                                                    onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value))}
                                                    className="w-20"
                                                    title="Proficiency Level (1-100)"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90"
                                            onClick={() => removeSkill(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {/* @ts-ignore */}
                            <InputError message={errors.skills} />
                        </div>

                        {/* Social Links Section */}
                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <Heading variant="small" title="Social Links" description="Connect your social profiles" />
                                <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
                                    <Plus className="mr-2 h-4 w-4" /> Add
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {data.social_links.map((link, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <select
                                            className="flex h-9 w-1/3 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={link.platform}
                                            onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                        >
                                            <option value="" disabled>Select Platform</option>
                                            <option value="github">GitHub</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="twitter">Twitter</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="youtube">YouTube</option>
                                            <option value="website">Website</option>
                                        </select>
                                        <Input
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90"
                                            onClick={() => removeSocialLink(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                             {/* @ts-ignore */}
                            <InputError message={errors.social_links} />
                        </div>

                        <div className="flex items-center gap-4 pt-6">
                            <Button disabled={processing}>Save Changes</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
