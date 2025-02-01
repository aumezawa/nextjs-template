"use client"
import "flowbite"

import Navbar from "@/app/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col w-dvw h-dvh overflow-x-hidden overflow-y-hidden">
      <Navbar />
      <div className="flex flex-col flex-grow min-h-0 items-center">
      </div>
    </div>
  )
}
