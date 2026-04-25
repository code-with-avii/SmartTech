import React, { useState } from "react";
import { FaBox, FaMoneyBill, FaUndo, FaUser, FaChevronDown } from "react-icons/fa";

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Go to My Orders → Select your order → Click Track Order.",
    },
    {
      question: "How can I return a product?",
      answer: "Go to My Orders → Click Return → Follow instructions.",
    },
    {
      question: "How do I contact support?",
      answer: "Use the contact form below or live chat.",
    },
    {
      question: "When will I get my refund?",
      answer: "Refunds are processed within 5-7 business days.",
    },
  ];

  const categories = [
    { name: "Orders", icon: <FaBox /> },
    { name: "Payments", icon: <FaMoneyBill /> },
    { name: "Returns", icon: <FaUndo /> },
    { name: "Account", icon: <FaUser /> },
  ];

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          How can we help you?
        </h1>

        <input
          type="text"
          placeholder="Search for orders, returns, payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full max-w-2xl p-4 rounded-xl text-black shadow-lg focus:ring-2 focus:ring-white outline-none"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* CATEGORIES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center group"
            >
              <div className="text-3xl mb-3 text-blue-600 group-hover:scale-110 transition">
                {cat.icon}
              </div>
              <h3 className="font-semibold text-gray-700">{cat.name}</h3>
            </div>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div className="bg-white rounded-2xl shadow p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">FAQs</h2>

          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="border-b last:border-none py-4 cursor-pointer"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">
                  {faq.question}
                </h3>
                <FaChevronDown
                  className={`transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {openIndex === index && (
                <p className="text-gray-600 mt-3 text-sm">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CONTACT SECTION */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Still need help?</h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* FORM */}
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border p-3 rounded-lg"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border p-3 rounded-lg"
              />
              <textarea
                placeholder="Describe your issue..."
                rows="4"
                className="border p-3 rounded-lg"
              ></textarea>

              <button className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                Submit Ticket
              </button>
            </form>

            {/* SUPPORT INFO */}
            <div className="flex flex-col justify-center gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                📞 Call Us: <b>+91 </b>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                💬 Live Chat: Available 24/7
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                📧 Email: support@yourstore.com
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;