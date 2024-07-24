"use client";

import dynamic from "next/dynamic";

const defaultPosition:[number,number] = [51.505,-0.09];

const MapsApp = dynamic(()=> import("./components/MapsApp"),{
  ssr:false,
});

export default function Home() {
  return (
    <main className="w-full h-full">
      <MapsApp/>
    </main>
  );
}
