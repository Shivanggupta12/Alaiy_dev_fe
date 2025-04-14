'use client';
import { useEffect } from 'react';
import Router from 'next/router';

export default function Home() {
  useEffect(() => {
    Router.push('/signin');
  }, []);

  return null; // or a loading indicator
}
