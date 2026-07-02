import ServicePage from "../components/ServicePage";

export default function DevelopmentProjectsPage() {
  return (
    <ServicePage
      eyebrow="Development Projects"
      title={<>Development<br />projects.</>}
      intro={[
        "Manifest Real Estate works with landowners, developers and investors to unlock the value of development opportunities.",
        "We understand that successful project sales require strategic planning, market insight and targeted marketing.",
        "Whether you're selling a development site or launching a residential project, we provide tailored advice from planning through to sales.",
      ]}
      listLabel="Services"
      items={[
        "Site Sales",
        "Project Marketing",
        "Off-the-Plan Sales",
        "Developer Advisory",
        "Site Acquisition",
        "Feasibility Discussions",
        "Market Analysis",
      ]}
      ctaTitle="Have a site or project? Let's talk."
      ctaLabel="Discuss your project"
    />
  );
}
