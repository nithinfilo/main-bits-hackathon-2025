"use client";

import { useRef, useState } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList

const faqList = [

  {
    question: "Can I get a refund?",
    answer: (
      <p>
        Yes, we offer refunds in the form of credit reimbursements for any issues you encounter. If you run into any problems, please reach out to us via <a 
        href="mailto:support@test.com" 
        style={{
          color: '#E779C1',
          textDecoration: 'underline'
        }}
      >
        Email
      </a> and we will ensure your credits are reimbursed to your account.
      </p>
    ),
  },
  {
    question: "How do I link a data source?",
    answer: (
      <p>
        You&apos;ll be asked to either connect your MongoDB/SQL/Google Sheets source in the dashboard page. We also support uploading of any data file format, including but not limited to spreadsheets (.csv, .json).
      </p>
    ),
  },
  {
    question: "Can I modify my visualizations If I don't like it?",
    answer: (
      <p>
        Yes! You can simply type what you want to be updated under the visualization and it will be updated in real-time.
      </p>
    ),
  },
  {
    question: "What do I do after purchasing?",
    answer: (
      <p>
        Simply login using the email you used to purchase and you&apos;ll be able to start using your personalised AI data analyst right away.
      </p>
    ),
  },
  {
    question: "What is your data privacy policy?",
    answer: (
      <p>
       To operate, we process your uploaded data on our secure backend servers hosted on Google Cloud Platform. All data is encrypted in transit over HTTPS/TLS, ensuring your information is protected between your device and our servers.
<br />
<br />
When using OpenAI, we only send the column names and the first row of your dataset, which are not used for model training. OpenAI deletes this data within 30 days, ensuring your privacy. For details, see OpenAI&apos;s <a href="https://openai.com/policies/usage-policies/" style={{ textDecoration: 'underline' }}>usage policies</a>.
<br />
<br />
We enforce strict access control, so only you can access your data in storage. Each user&apos;s data is sandboxed within isolated environments, ensuring secure and private processing. Additionally, your data is completely erased from our servers whenever you delete it within the app.
<br />
<br />
To further ensure your privacy, MongoDB or MySQL credentials are never stored after being securely processed by our encrypted servers.



      </p>
    ),
  },
  {
    question: "I have another question",
    answer: (
      <div className="space-y-2 leading-relaxed">Cool, shoot us a quick email at ssreenithin@gmail.com</div>
    ),
  },
];

const Item = ({ item }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </ul>
        
      </div>
      
    </section>
  );
};

export default FAQ;
