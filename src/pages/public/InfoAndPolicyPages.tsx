import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { IMG_ATELIER, IMG_HERO, formatCurrency } from '../../data/mockData';
import { ResilientImage } from '../../components/product/ProductCard';

export const AboutPage: React.FC = () => {
  const { brandSettings } = useStore();

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-[#E5E5E5] pb-16">
        <div className="lg:col-span-6 space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
            The House Manifesto
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#080808] leading-tight">
            {brandSettings.tagline}
          </h1>
          <p className="text-sm text-[#555555] leading-relaxed">
            Founded on the conviction that true luxury lies in permanence rather than seasonal spectacle, {brandSettings.brandName} operates between textile mills in Biella, Inner Mongolia, and our flagship atelier in Kathmandu.
          </p>
          <p className="text-sm text-[#555555] leading-relaxed">
            Each garment is numbered by production batch, constructed with single-needle French seams, natural horsehair chest canvassing, and traceable RWS-certified virgin wool.
          </p>
        </div>
        <div className="lg:col-span-6 aspect-[16/10] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden">
          <ResilientImage
            src={IMG_ATELIER}
            alt="Atelier Workroom"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-[#E5E5E5] p-8 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            01. Material Integrity
          </p>
          <h3 className="font-serif text-xl text-[#080808]">Single-Origin Natural Fibers</h3>
          <p className="text-xs text-[#555555] leading-relaxed">
            Zero synthetic blends in our outerwear and knitwear. We utilize 580 GSM Italian virgin wool, 15.2-micron cashmere, and organic mulberry silk poplin.
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-8 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            02. Unisex Proportions
          </p>
          <h3 className="font-serif text-xl text-[#080808]">Architectural Silhouettes</h3>
          <p className="text-xs text-[#555555] leading-relaxed">
            Patterned across a unified anatomical block that honors fluid movement, clean shoulder lines, and effortless layering for both men and women.
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-8 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-[#777777]">
            03. Lifetime Care
          </p>
          <h3 className="font-serif text-xl text-[#080808]">Archival Repair & Hemming</h3>
          <p className="text-xs text-[#555555] leading-relaxed">
            Every tailored trouser and overcoat includes complimentary alteration and lifetime horn button or seam restoration at our flagship salon.
          </p>
        </div>
      </div>

      <div className="bg-[#080808] text-white p-10 sm:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#999999]">
            Private Appointments
          </p>
          <h2 className="font-serif text-3xl">Visit Our Flagship Salon</h2>
          <p className="text-xs text-[#CCCCCC] leading-relaxed max-w-xl">
            {brandSettings.flagshipAddress}. Private fitting consultations and fabric archive viewings are available seven days a week.
          </p>
        </div>
        <div className="lg:col-span-5 flex lg:justify-end">
          <Link
            to="/contact"
            className="bg-white text-[#080808] px-7 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#E5E5E5]"
          >
            Request Private Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { brandSettings, showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Private Fitting Appointment');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      'Inquiry Dispatched to Client Concierge',
      `Thank you, ${name}. Our concierge desk will respond within 4 business hours.`,
      'success'
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-12">
      <div className="pb-8 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Client Relations
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
          Contact Atelier Concierge
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-[#E5E5E5] p-6 space-y-5">
            <h2 className="font-serif text-xl text-[#080808]">Flagship Salon & Studio</h2>
            <div className="space-y-4 text-xs text-[#555555]">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#080808] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#080808]">Address</p>
                  <p>{brandSettings.flagshipAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#080808] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#080808]">Direct Concierge Line</p>
                  <p className="font-mono">{brandSettings.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#080808] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#080808]">Electronic Dispatch</p>
                  <p>{brandSettings.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#080808] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#080808]">Salon Hours</p>
                  <p>Sunday – Friday: 10:00 AM – 7:30 PM NPT</p>
                  <p>Saturday: By Private Appointment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-[16/9] border border-[#E5E5E5] overflow-hidden">
            <ResilientImage
              src={IMG_HERO}
              alt="Flagship Exterior"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="border border-[#E5E5E5] p-6 sm:p-10 space-y-6 bg-[#F3F3F3]/30"
          >
            <h2 className="font-serif text-2xl text-[#080808]">Send a Direct Inquiry</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                Inquiry Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
              >
                <option value="Private Fitting Appointment">Private Fitting Appointment</option>
                <option value="Order & Payment Verification">Order & Payment Verification</option>
                <option value="Bespoke Sizing & Alterations">Bespoke Sizing & Alterations</option>
                <option value="Press & Editorial Loans">Press & Editorial Loans</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#777777] mb-1.5">
                Message *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include relevant order number or garment SKU if applicable..."
                className="w-full bg-white border border-[#E5E5E5] px-3.5 py-2.5 text-xs text-[#080808] focus:outline-none focus:border-[#080808]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#080808] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#222222] inline-flex items-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Transmit Inquiry</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does manual QR payment verification work for eSewa, Khalti, and Fonepay?',
      a: 'During checkout, scan our official merchant QR code and transfer the exact payable total. Enter your Transaction Reference ID and upload the confirmation screenshot. Our Finance Desk verifies transfers within 30 minutes during salon hours and updates your order status to Confirmed.',
    },
    {
      q: 'How should I choose my size in Unisex Monolith garments?',
      a: 'Unisex garments are tailored on an architectural block calibrated to men’s sizing proportions. Male clients should take their true size; female clients seeking a closer tailored shoulder should select one size down.',
    },
    {
      q: 'Do you offer Cash on Delivery outside Kathmandu Valley?',
      a: 'Yes. Cash on Delivery is available across Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar, and Butwal/Bhairahawa for orders up to NPR 75,000.',
    },
    {
      q: 'Are complimentary alterations included with trousers and coats?',
      a: 'Every pair of worsted flannel trousers and wool overcoat includes a complimentary hemming voucher redeemable at our Durbar Marg flagship salon.',
    },
    {
      q: 'What is your archival garment care recommendation?',
      a: 'Double-faced virgin wool and tailored suiting should only be dry-cleaned by a specialist twice a season and rested on wide anatomical wooden hangers between wearings.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Client Guidance
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5]">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-5">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4"
              >
                <span className="font-serif text-lg text-[#080808]">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </button>
              {isOpen && (
                <p className="mt-3 text-xs text-[#555555] leading-relaxed pr-8">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SizeGuidePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="pb-6 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">
          Sartorial Calibration
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
          Size & Measurement Guide
        </h1>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-xl text-[#080808]">
          01. Unisex & Men&apos;s Outerwear / Shirting (Centimeters)
        </h2>
        <div className="overflow-x-auto border border-[#E5E5E5]">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#080808] text-white uppercase tracking-wider">
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">IT / EU</th>
                <th className="py-3.5 px-4">Chest (cm)</th>
                <th className="py-3.5 px-4">Shoulder Width (cm)</th>
                <th className="py-3.5 px-4">Waist (cm)</th>
                <th className="py-3.5 px-4">Sleeve Length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              <tr>
                <td className="py-3.5 px-4 font-semibold">XS</td>
                <td className="py-3.5 px-4">44</td>
                <td className="py-3.5 px-4">86 – 90</td>
                <td className="py-3.5 px-4">42.5</td>
                <td className="py-3.5 px-4">70 – 74</td>
                <td className="py-3.5 px-4">61.0</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">S</td>
                <td className="py-3.5 px-4">46</td>
                <td className="py-3.5 px-4">91 – 96</td>
                <td className="py-3.5 px-4">44.5</td>
                <td className="py-3.5 px-4">75 – 80</td>
                <td className="py-3.5 px-4">62.5</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">M</td>
                <td className="py-3.5 px-4">48</td>
                <td className="py-3.5 px-4">97 – 102</td>
                <td className="py-3.5 px-4">46.5</td>
                <td className="py-3.5 px-4">81 – 86</td>
                <td className="py-3.5 px-4">64.0</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">L</td>
                <td className="py-3.5 px-4">50</td>
                <td className="py-3.5 px-4">103 – 108</td>
                <td className="py-3.5 px-4">48.5</td>
                <td className="py-3.5 px-4">87 – 92</td>
                <td className="py-3.5 px-4">65.5</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">XL</td>
                <td className="py-3.5 px-4">52</td>
                <td className="py-3.5 px-4">109 – 115</td>
                <td className="py-3.5 px-4">50.5</td>
                <td className="py-3.5 px-4">93 – 99</td>
                <td className="py-3.5 px-4">67.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-xl text-[#080808]">
          02. Women&apos;s Tailoring & Knitwear (Centimeters)
        </h2>
        <div className="overflow-x-auto border border-[#E5E5E5]">
          <table className="w-full text-left border-collapse text-xs tabular-nums">
            <thead>
              <tr className="bg-[#F3F3F3] text-[#080808] border-b border-[#080808] uppercase tracking-wider">
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">FR / EU</th>
                <th className="py-3.5 px-4">Bust (cm)</th>
                <th className="py-3.5 px-4">Natural Waist (cm)</th>
                <th className="py-3.5 px-4">Low Hip (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              <tr>
                <td className="py-3.5 px-4 font-semibold">XS</td>
                <td className="py-3.5 px-4">34</td>
                <td className="py-3.5 px-4">80 – 83</td>
                <td className="py-3.5 px-4">62 – 65</td>
                <td className="py-3.5 px-4">88 – 91</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">S</td>
                <td className="py-3.5 px-4">36</td>
                <td className="py-3.5 px-4">84 – 88</td>
                <td className="py-3.5 px-4">66 – 70</td>
                <td className="py-3.5 px-4">92 – 96</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">M</td>
                <td className="py-3.5 px-4">38</td>
                <td className="py-3.5 px-4">89 – 93</td>
                <td className="py-3.5 px-4">71 – 75</td>
                <td className="py-3.5 px-4">97 – 101</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold">L</td>
                <td className="py-3.5 px-4">40</td>
                <td className="py-3.5 px-4">94 – 99</td>
                <td className="py-3.5 px-4">76 – 81</td>
                <td className="py-3.5 px-4">102 – 107</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{
  type: 'shipping' | 'return' | 'privacy' | 'terms';
}> = ({ type }) => {
  const { deliveryZones } = useStore();

  const contentMap = {
    shipping: {
      kicker: 'Logistics & White-Glove Dispatch',
      title: 'Shipping & Delivery Policy',
      paragraphs: [
        'Every garment ordered from our digital flagship is steamed, inspected by a master tailor, and enclosed in an archival breathable organic cotton garment bag prior to dispatch.',
        'Complimentary same-day or next-business-day delivery is provided across Kathmandu and Lalitpur metropolitan districts. Domestic air courier service is utilized for Pokhara, Biratnagar, and Bhairahawa.',
      ],
    },
    return: {
      kicker: 'Client Assurance',
      title: 'Returns & Exchanges Policy',
      paragraphs: [
        'We accept returns and size exchanges within 14 calendar days of receipt, provided the garment remains unworn, unaltered, and retains its numbered archival ribbon tag intact.',
        'To initiate a complimentary courier pickup from your residence, visit your Client Account Order Details page or contact our concierge desk.',
      ],
    },
    privacy: {
      kicker: 'Data Sovereignty',
      title: 'Privacy Policy & Client Confidentiality',
      paragraphs: [
        'Your personal dossier, bespoke measurements, delivery addresses, and uploaded eSewa/Khalti/Fonepay transaction proofs are encrypted and strictly restricted to authorized house personnel.',
        'We never sell, syndicate, or share private client registries with third-party marketing brokerages.',
      ],
    },
    terms: {
      kicker: 'House Governance',
      title: 'Terms & Conditions of Sale',
      paragraphs: [
        'All prices are denominated in Nepalese Rupees (NPR) and include applicable VAT. Manual QR orders are reserved for 24 hours pending transaction reference verification.',
        'Limited Atelier Edition releases are restricted to two units per client dossier to prevent commercial resale.',
      ],
    },
  };

  const active = contentMap[type];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="pb-6 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#777777]">{active.kicker}</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080808] mt-1">
          {active.title}
        </h1>
      </div>

      <div className="space-y-4 text-sm text-[#555555] leading-relaxed">
        {active.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {type === 'shipping' && (
        <div className="pt-4">
          <h2 className="font-serif text-xl text-[#080808] mb-4">
            Regional Delivery Tariffs & Timelines
          </h2>
          <div className="overflow-x-auto border border-[#E5E5E5]">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-[#F3F3F3] border-b border-[#E5E5E5] uppercase tracking-wider">
                  <th className="py-3 px-4">Province</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Standard Tariff</th>
                  <th className="py-3 px-4">Express Tariff</th>
                  <th className="py-3 px-4">Estimated Transit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {deliveryZones.map((z) => (
                  <tr key={z.id}>
                    <td className="py-3 px-4">{z.province}</td>
                    <td className="py-3 px-4 font-semibold">{z.district}</td>
                    <td className="py-3 px-4">
                      {z.standardCharge === 0
                        ? 'Complimentary'
                        : formatCurrency(z.standardCharge)}
                    </td>
                    <td className="py-3 px-4">
                      {z.expressCharge === 0
                        ? 'Complimentary'
                        : formatCurrency(z.expressCharge)}
                    </td>
                    <td className="py-3 px-4">{z.estimatedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
