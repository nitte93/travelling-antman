'use client'
import AntGame from './components/AntGame';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Travelling Ant Man</h1>
      <AntGame />
    </main>
  );
}