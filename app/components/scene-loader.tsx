"use client";

import dynamic from "next/dynamic";

// ponytail: ssr:false must live in a client component (Next 16 rule)
const Scene = dynamic(() => import("./scene"), { ssr: false });

export default function SceneLoader() {
  return <Scene />;
}
