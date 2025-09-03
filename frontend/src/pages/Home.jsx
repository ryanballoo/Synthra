import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to Synthra</h2>
        <p>Create text, images, audio, and video in one place!</p>
      </main>
      <Footer />
    </div>
  );
}