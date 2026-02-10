import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Avatar */}
                                <div className="grid gap-2">
                                    <Label htmlFor="avatar">Profile Picture</Label>
                                    {auth.user.avatar && (
                                        <div className="mb-2">
                                            <img
                                                src={`/storage/${auth.user.avatar}`}
                                                alt="Current Avatar"
                                                className="h-20 w-20 rounded-full object-cover border border-gray-200"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id="avatar"
                                        type="file"
                                        className="mt-1 block w-full cursor-pointer"
                                        name="avatar"
                                        accept="image/*"
                                    />
                                    <InputError className="mt-2" message={errors.avatar} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="job_title">Job Title</Label>
                                    <Input
                                        id="job_title"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.job_title || ''}
                                        name="job_title"
                                        placeholder="e.g. Full Stack Developer"
                                    />
                                    <InputError className="mt-2" message={errors.job_title} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="about_me">About Me</Label>
                                    <Textarea
                                        id="about_me"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.about_me || ''}
                                        name="about_me"
                                        placeholder="Brief description about yourself..."
                                    />
                                    <InputError className="mt-2" message={errors.about_me} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.phone || ''}
                                        name="phone"
                                        placeholder="+62 812 3456 7890"
                                    />
                                    <InputError className="mt-2" message={errors.phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.instagram || ''}
                                        name="instagram"
                                        placeholder="Instagram username or URL"
                                    />
                                    <InputError className="mt-2" message={errors.instagram} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.linkedin || ''}
                                        name="linkedin"
                                        placeholder="LinkedIn URL"
                                    />
                                    <InputError className="mt-2" message={errors.linkedin} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="github">GitHub</Label>
                                    <Input
                                        id="github"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.github || ''}
                                        name="github"
                                        placeholder="GitHub URL"
                                    />
                                    <InputError className="mt-2" message={errors.github} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        A new verification link has
                                                        been sent to your email
                                                        address.
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
