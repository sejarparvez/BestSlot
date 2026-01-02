import { Headphones, ShieldCheck, Zap } from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header';
import { auth } from '@/lib/auth';
import { ChatBox } from './chat-box';
import { FaqSection } from './faq-section';

export default async function SupportPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user.role === 'ADMIN') {
    redirect('/support/agent');
  }
  return (
    <>
      <Header />
      <main className='min-h-screen bg-background text-foreground my-20 font-sans'>
        {/* Hero Section */}
        <section className='container mx-auto px-6 pt-24 pb-12 text-center'>
          <h1 className='text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8'>
            Support <span className='text-primary'>Center</span>
          </h1>
          <p className='max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed'>
            Need help with your account, a bet, or a withdrawal? We've got you
            covered 24/7.
          </p>
        </section>

        {/* Trust Badges */}
        <section className='border-y border-border/50 py-12 bg-muted/20'>
          <div className='container mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24'>
            <div className='flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-80'>
              <ShieldCheck className='text-primary w-6 h-6' /> Secured Platform
            </div>
            <div className='flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-80'>
              <Zap className='text-primary w-6 h-6' /> Instant Payouts
            </div>
            <div className='flex items-center gap-3 text-sm font-bold uppercase tracking-widest opacity-80'>
              <Headphones className='text-primary w-6 h-6' /> 24/7 Human Help
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className='container mx-auto px-6 py-24'>
          <FaqSection />
        </section>

        {/* Floating Chat Box Component */}
        <ChatBox />
      </main>
      <Footer />
    </>
  );
}
