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
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('settings.profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your profile details"
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
