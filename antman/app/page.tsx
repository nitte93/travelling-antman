'use client'
import AntGame from '../components/AntGame';
import DrawBoard from "@/components/DrawBoard"
import { PathProvider } from '@/hooks/PathDrawContext';

export default function Home() {
  return (
    <main className="flex items-center justify-between p-24">
      {/* <h1 className="text-4xl font-bold mb-8">Travelling Ant Man</h1> */}
      {/* <AntGame /> */}
      <div className='relative w-1000 h-500'>
        <PathProvider>
          <AntGame />
          <DrawBoard/>
        </PathProvider>
      </div>
    </main>
  );
}