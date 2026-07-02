import ServicePage from "../components/ServicePage";
import RecentProjects from "../components/RecentProjects";

export default function CommercialLeasingPage() {
  return (
    <ServicePage
      eyebrow="Commercial Leasing"
      title={<>Commercial<br />leasing.</>}
      intro={[
        "Finding the right commercial property is about more than location.",
        "Manifest Real Estate assists landlords and tenants in securing leasing opportunities that support business growth and long-term success.",
        "Our focus is on understanding the needs of both parties to create successful leasing outcomes.",
      ]}
      listLabel="Services"
      items={[
        "Retail Leasing",
        "Office Leasing",
        "Industrial Leasing",
        "Lease Negotiation",
        "Landlord Representation",
        "Blue Chip Tenant Sourcing",
      ]}
      ctaTitle="Leasing space or seeking a tenant?"
      ctaLabel="Get in touch"
    >
      {/* Hidden until Akshay supplies content (refreshed ~every two months). */}
      <RecentProjects
        eyebrow="Recent projects"
        heading="Commercial leasing deals we've recently completed."
      />
    </ServicePage>
  );
}
