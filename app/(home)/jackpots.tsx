'use client';

import NumberFlow from '@number-flow/react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Card, CardContent } from '@/components/ui/card';

// --- TYPES ---
interface GameCardType {
  id: number;
  title: string;
  imageUrl: string;
}

// --- DUMMY DATA ---
const gameCards: GameCardType[] = [
  { id: 1, title: 'Roots of Egypt', imageUrl: '/placeholder.svg' },
  { id: 2, title: 'Power Sun', imageUrl: '/placeholder.svg' },
  { id: 3, title: 'Super Hot Chilli', imageUrl: '/placeholder.svg' },
  { id: 4, title: 'Cash Blitz Extreme', imageUrl: '/placeholder.svg' },
  { id: 5, title: 'Golden Dragon', imageUrl: '/placeholder.svg' },
  { id: 6, title: 'Wild West Gold', imageUrl: '/placeholder.svg' },
  { id: 7, title: 'Book of Ra', imageUrl: '/placeholder.svg' },
  // Duplicate for continuous scrolling effect
  { id: 8, title: 'Roots of Egypt', imageUrl: '/placeholder.svg' },
  { id: 9, title: 'Power Sun', imageUrl: '/placeholder.svg' },
];

const JackpotMarquee: React.FC = () => {
  // 1. Initialize state with the starting value
  const [jackpotValue, setJackpotValue] = useState(332598285);

  // 2. Use useEffect to set up the automatic incrementer
  useEffect(() => {
    // Define the interval function
    const intervalId = setInterval(() => {
      // Update the jackpot value.
      // We add a random amount (e.g., between 1 and 200) to simulate a dynamic increase.
      const incrementAmount = Math.floor(Math.random() * 200) + 1;

      setJackpotValue((prevValue) => prevValue + incrementAmount);
    }, 4000); // Update every 100 milliseconds (0.1 seconds)

    // Clear the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- SUB COMPONENTS ---

  const GameCard: React.FC<GameCardType> = ({ title, imageUrl }) => (
    <div className='relative mx-1 h-full w-[150px] shrink-0 overflow-hidden rounded-lg sm:w-[180px]'>
      <Image
        src={imageUrl}
        alt={title}
        width={180}
        height={250}
        className='h-full w-full object-cover dark:brightness-40'
      />
      {/* Favorite Heart Icon (top right) */}
      <div className='absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:text-red-500'>
        <Heart className='h-4 w-4 fill-white hover:fill-red-500' />
      </div>
    </div>
  );

  return (
    <Card className='p-0 overflow-hidden'>
      <CardContent className='grid grid-cols-5 p-0'>
        <div className='relative h-48 col-span-2'>
          <Image
            src='/placeholder.svg'
            alt='Jackpot'
            fill
            className='dark:brightness-40 object-cover'
          />
          <div>
            <div className='absolute bottom-20 right-6 text-primary text-4xl font-bold'>
              JACKPOT
            </div>

            <div
              className='
                absolute bottom-4 right-6
                 text-2xl font-mono
                sm:text-3xl lg:text-4xl
              '
            >
              {/* NumberFlow now receives the state value, which updates every 100ms */}
              <NumberFlow
                value={jackpotValue}
                locales='en-US'
                format={{
                  style: 'decimal',
                  minimumFractionDigits: 0,
                }}
                className='text-foreground'
              />
            </div>
          </div>
        </div>

        {/* The Marquee section */}
        <div className='flex flex-col col-span-3'>
          <Marquee gradient={false} speed={25} className='h-full'>
            {gameCards.map((card) => (
              <GameCard key={card.id} {...card} />
            ))}
          </Marquee>
        </div>
      </CardContent>
    </Card>
  );
};

export default JackpotMarquee;
