import React from 'react';

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] shrink-0 inline opacity-80">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const Pricing = () => {
  return (
    <section id="pricing" className="mx-auto bg-base-900 max-w-6xl space-y-8 p-6 py-16 md:space-y-16 md:py-32">
      <div className="space-y-4 text-center md:space-y-6">
        <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl md:leading-tight">
        Tired of wasting time on data work?
        </h2>
        <p className="text-base-content-secondary">
        Save hours of repetitive work, analyze and create sleek graphs in seconds.
        </p>
      </div>
      <div className="mx-auto my-16 md:my-20 p-8 lg:p-12 bg-gray-800 rounded-3xl flex flex-col lg:flex-row gap-8 lg:gap-12 lg:justify-between lg:mr-6">
        <div className="space-y-6 flex-1 w-full">
          <p className="text-xl tracking-tight font-bold">Let our AI do the heavy lifting!</p>
          <ul className="space-y-4 text-base-content-secondary">
            <li className="flex gap-3 items-center">
              <CheckIcon />
              <span>1000 Generations per month</span>
            </li>
            <li className="flex gap-3 items-center">
              <CheckIcon />
              Unlimited Modifications
            </li>
            <li className="flex gap-3 items-center">
              <CheckIcon />
              <span>Smartest AI models (GPT-4o, Claude 3.5 Sonnet) </span>
            </li>
            <li className="flex gap-3 items-center">
              <CheckIcon />
              Utilize our High RAM Environment for larger datasets
            </li>
            <li className="flex gap-3 items-center">
              <CheckIcon />
              <span>Upload unlimited files</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
          <div className="border border-base-content/10 bg-gray-900 rounded-2xl lg:rounded-3xl text-center p-8 lg:p-12 -mx-4 -mb-4 lg:-my-8">
            <div className="flex flex-col gap-6 lg:gap-8 justify-center h-full">
              <p className="text-xl font-semibold">Monthly Pass</p>
              <div className="flex items-baseline justify-center gap-x-2">
                <span className="text-lg tracking-tight text-base-content-secondary/80 line-through decoration-[1.5px]">$25</span>
                <div className="text-5xl font-bold tracking-tight">$15</div>
                <span className="text-sm font-base leading-6 tracking-wide text-base-content-secondary/80">USD</span>
                
              </div>
              <p className="text-sm text-base-content-secondary">Try it out. Cancel anytime.</p>
              <div className="w-full">
                <a className="btn-primary btn-block btn" href="https://akhinsolutions.lemonsqueezy.com/buy/e7681360-b535-47b8-9cc5-3ce54aa152ae">Try for free!</a>
              </div>
            </div>
          </div>
          <div className="border border-[#FFD700] relative lg:!py-16 lg:!-my-16 lg:!px-16 lg:!-mx-16 z-10 bg-gray-900 rounded-2xl lg:rounded-3xl text-center p-8 lg:p-12 -mx-4 -mb-4 lg:-my-8">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 badge badge-primary badge-sm uppercase font-semibold">Popular</div>
            <div className="flex flex-col gap-6 lg:gap-8 justify-center h-full">
              <p className="text-xl font-semibold">Yearly Deal</p>
              <div className="flex items-baseline justify-center gap-x-2">
                <span className="text-lg tracking-tight text-base-content-secondary/80 line-through decoration-[1.5px]">$20</span>
                <div className="text-5xl font-bold tracking-tight">$9</div>
                <span className="text-sm font-base leading-6 tracking-wide text-base-content-secondary/80">USD</span>
              </div>
              <p className="text-xs text-base-content-secondary opacity-23">Billed for a year ($108 total)</p>
              <p className="text-sm text-base-content-secondary">Cancel anytime.</p>
              <div className="w-full">
                <a className="btn-primary btn-block btn" href="https://akhinsolutions.lemonsqueezy.com/buy/3da30c4f-3b33-498a-9e38-aa097058bbf3">Try for free!</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
