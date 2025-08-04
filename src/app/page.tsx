import { trpc } from '@/utils/trpc';
import { Theme } from '@radix-ui/themes';
import React from 'react';

const HomePage = () => {
  return (
    <Theme>
      <header>Form Scaffold IO</header>
      {/* <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20'>
        <main className='row-start-2 flex flex-col items-center gap-[32px] sm:items-start'> */}

      {/* </main> */}
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-[24px]'>
        &copy; Grin Beard Solutions 2025
      </footer>
      {/* </div> */}
    </Theme>
  );
};

export default trpc.withTRPC(HomePage);
