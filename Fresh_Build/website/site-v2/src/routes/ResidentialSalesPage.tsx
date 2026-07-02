import ServicePage from "../components/ServicePage";

export default function ResidentialSalesPage() {
  return (
    <ServicePage
      eyebrow="Residential Sales"
      title={<>Residential<br />property sales.</>}
      intro={[
        "Selling a home is one of the most significant financial decisions you'll make.",
        "Manifest Real Estate provides tailored marketing strategies, skilled negotiation and expert guidance to maximise the value of your property while making the sales process straightforward and stress-free.",
        "Whether you're selling your first home, an investment property or a prestige residence, we are committed to achieving the best possible outcome.",
      ]}
      listLabel="Our services"
      items={[
        "Property Appraisals",
        "Sales Strategy",
        "Professional Marketing",
        "Auction & Private Sale",
        "Buyer Negotiation",
        "Settlement Support",
      ]}
      ctaTitle="Thinking of selling? Let's talk."
      ctaLabel="Request an appraisal"
    />
  );
}
