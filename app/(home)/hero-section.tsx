'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function HeroSection() {
  return (
    <div className='px-10'>
      <Carousel
        className='group w-full'
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className='h-60'>
          <CarouselItem className='relative '>
            <Image
              src={'/placeholder.svg'}
              alt='slider1'
              width={850}
              height={400}
              className='block rounded-md dark:brightness-40 h-60 w-full object-cover'
            />
          </CarouselItem>
          <CarouselItem className='relative'>
            <Image
              src='/placeholder.svg'
              alt='slider1'
              width={850}
              height={400}
              className=' rounded-md dark:brightness-40 h-60 w-full object-cover'
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious
          variant='outline'
          className='ml-12 translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:scale-150'
        />
        <CarouselNext
          variant='outline'
          className='mr-12 -translate-x-10 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:scale-150'
        />
      </Carousel>
    </div>
  );
}
