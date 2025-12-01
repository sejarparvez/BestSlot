'use client';

import type { User } from 'better-auth';
import { Camera, Check, PenIcon, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { UploadImage } from '@/cloudinary/upload-image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUser, useSession } from '@/lib/auth-client';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { refetch } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: user.name || '',
    },
  });

  const handleSave = async (data: { name: string }) => {
    if (!data.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        name: data.name.trim(),
      });

      await refetch();
      toast.success('Profile updated successfully');
      setIsEditing(false);
      router.refresh();
    } catch (_error) {
      toast.error('Failed to update profile. Please try again.');
      form.reset();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('Image must be smaller than 1MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const result = await UploadImage(file, 'user-avatars');

      await updateUser({
        image: `${result.secure_url}|${result.public_id}`,
      });

      await refetch();
      toast.success('Profile image updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      console.error('[Image Upload Error]', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className='relative overflow-hidden border border-border shadow-sm'>
      {/* Background gradient */}
      <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none' />

      <div className='relative px-6 py-12 flex flex-col items-center text-center space-y-6'>
        {/* Avatar Area */}
        <div className='relative group'>
          <div className='w-28 h-28 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-primary/30 shadow-md transition-all duration-300 group-hover:ring-primary/50 overflow-hidden'>
            {user.image ? (
              // biome-ignore lint/performance/noImgElement: error
              <img
                src={user.image}
                alt={user.name || 'User avatar'}
                className='h-full w-full object-cover'
              />
            ) : (
              <span className='text-5xl font-bold bg-linear-to-br from-primary to-accent bg-clip-text text-transparent'>
                {form.watch('name').charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>

          <div className='absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <Button
              size='icon'
              variant='default'
              className='rounded-full shadow-lg h-10 w-10 flex items-center justify-center'
              onClick={triggerImageUpload}
              disabled={isUploadingImage}
              title='Upload profile image'
              aria-label='Upload profile image'
            >
              {isUploadingImage ? (
                <div className='animate-spin'>
                  <Upload size={16} />
                </div>
              ) : (
                <Camera size={16} />
              )}
            </Button>
          </div>

          {/* Hidden file input for image upload */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleImageUpload}
            disabled={isUploadingImage}
            aria-label='Upload profile image'
          />
        </div>

        {/* User Name - Edit Section */}
        <div className='w-full max-w-md space-y-3'>
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className='space-y-3'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter your name'
                          className='text-center text-2xl font-bold h-12'
                          disabled={isSaving}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex gap-2 justify-center'>
                  <Button
                    type='submit'
                    disabled={isSaving}
                    size='sm'
                    className='gap-2'
                  >
                    <Check size={16} />
                    Save
                  </Button>
                  <Button
                    type='button'
                    onClick={handleCancel}
                    disabled={isSaving}
                    variant='outline'
                    size='sm'
                    className='gap-2 bg-transparent'
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className='group/name cursor-pointer'>
              <div className='flex items-center justify-center gap-3'>
                <h1 className='text-3xl font-bold text-foreground text-balance'>
                  {user.name || 'User'}
                </h1>
                <Button
                  onClick={() => setIsEditing(true)}
                  className='opacity-0 group-hover/name:opacity-100 transition-opacity duration-200 p-2 hover:bg-secondary rounded-md'
                  aria-label='Edit name'
                >
                  <PenIcon size={18} className='text-muted-foreground' />
                </Button>
              </div>
            </div>
          )}
          <p className='text-sm text-muted-foreground break-all'>
            {user.email}
          </p>
        </div>

        {/* Email Verification Status */}
        <div className='inline-flex items-center gap-2.5 px-4 py-2.5 bg-secondary border border-border rounded-full hover:bg-secondary/80 transition-colors'>
          <div
            className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}
          />
          <span className='text-xs font-medium text-foreground'>
            {user.emailVerified
              ? 'Email Verified'
              : 'Email Pending Verification'}
          </span>
        </div>

        {/* Additional Info */}
        {user.createdAt && (
          <p className='text-xs text-muted-foreground pt-2'>
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}
