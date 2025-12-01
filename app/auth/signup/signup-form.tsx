'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn, signUp } from '@/lib/auth-client';
import { signupSchema } from '@/lib/schemas/auth';
import { cn } from '@/lib/utils';

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = form;

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);

    try {
      const { error } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (error) {
        if (error.status === 400) {
          toast.error('Invalid input', {
            description:
              error.message || 'Please check your information and try again.',
          });
        } else if (error.status === 409) {
          toast.error('Email already exists', {
            description:
              'This email is already registered. Please try logging in.',
          });
          setError('email', {
            type: 'manual',
            message: 'This email is already registered',
          });
        } else {
          toast.error('Signup failed', {
            description:
              error.message || 'Something went wrong. Please try again.',
          });
        }
        return;
      }

      toast.success('Account created successfully!', {
        description: 'Welcome to Easy Stock. Redirecting you now...',
      });

      reset();

      router.push('/auth/verify/pending');
    } catch (err) {
      toast.error('Unexpected error', {
        description: 'An unexpected error occurred. Please try again.',
      });
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialSignup(provider: 'google' | 'github') {
    setIsLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: '/dashboard',
      });
    } catch (err) {
      toast.error(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} signup failed`,
        {
          description: `Unable to sign up with ${provider}. Please try again.`,
        },
      );
      console.error(`${provider} signup error:`, err);
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col mt-10 gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form className='p-6' onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='gap-5'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Create your account</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                  Enter your details below to create your account
                </p>
              </div>

              {/* Name Field */}
              <Field>
                <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                <Input
                  id='name'
                  type='text'
                  placeholder='John Doe'
                  disabled={isLoading}
                  {...register('name')}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  autoComplete='email'
                  disabled={isLoading}
                  {...register('email')}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              {/* Password Fields */}
              <Field>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <Field>
                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        disabled={isLoading}
                        className='pr-10'
                        {...register('password')}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {showPassword ? 'Hide' : 'Show'} password
                        </span>
                      </Button>
                    </div>
                    {!errors.confirmPassword && errors.password && (
                      <FieldError>{errors.password.message}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor='confirmPassword'>
                      Confirm Password
                    </FieldLabel>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        disabled={isLoading}
                        className='pr-10'
                        {...register('confirmPassword')}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {showConfirmPassword ? 'Hide' : 'Show'} password
                        </span>
                      </Button>
                    </div>
                  </Field>
                </div>

                <FieldDescription>
                  Must be at least 6 characters with uppercase, lowercase, and a
                  number.
                </FieldDescription>

                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type='submit' disabled={isLoading} className='w-full'>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </Field>

              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Or continue with
              </FieldSeparator>

              {/* Social Sign Up Buttons */}
              <Field className='grid grid-cols-2 gap-4'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => handleSocialSignup('google')}
                  disabled={isLoading}
                >
                  <svg
                    className='mr-2 h-4 w-4'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                  >
                    <title>Google</title>
                    <path
                      d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                      fill='currentColor'
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => handleSocialSignup('github')}
                  disabled={isLoading}
                >
                  <svg
                    className='mr-2 h-4 w-4'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <title>GitHub</title>
                    <path d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z' />
                  </svg>
                  GitHub
                </Button>
              </Field>

              <FieldDescription className='text-center'>
                Already have an account?{' '}
                <Link
                  href='/auth/signin'
                  className='font-medium underline underline-offset-4 hover:text-primary'
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* Side Image */}
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/placeholder.svg'
              alt='Signup illustration'
              height={600}
              width={600}
              className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <FieldDescription className='px-6 text-center text-xs'>
        By clicking continue, you agree to our{' '}
        <Link
          href='/terms'
          className='underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
