import React from 'react'
import { PricingTable } from '@clerk/react'

const Pricing = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-5xl flex-col px-4 py-10 sm:px-6 md:py-14">

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Choose Your Plan
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
          Find the right plan for your meetings and enjoy a better connection experience.
        </p>
      </div>

      <div className="w-full">
        <PricingTable />
      </div>

    </main>
  )
}

export default Pricing
