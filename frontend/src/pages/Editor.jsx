import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Editor() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">Editor</h2>
        <p>Start building multimodal content here.</p>
      </main>
      <Footer />
    </div>
  );
}