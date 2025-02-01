// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react'
import './App.css'
import SpeechToText from './SpeechToText';

export default function App() {

  const memoizedFetch = useMemo(
    () => {
      return () => {
        fetch('http://localhost:5000/')
          .then(response => response.text())
          .then(data => console.log(data));
      }
    },
    []
  );

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);

  return (
    <>
    <h1 className='text-4xl text-center font-bold mt-10'>Welcome to Omiii&apos;s RAG Based Voice Assistant </h1>
      <SpeechToText />
    </>
  );
}