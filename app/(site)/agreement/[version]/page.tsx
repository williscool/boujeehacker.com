import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "../../../_components/Container";
import Prose from "../../../_components/Prose";
import { getAgreement, listAgreementVersions } from "../../../../lib/content";

export async function generateStaticParams() {
  const versions = await listAgreementVersions();
  return versions.map((version) => ({ version }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ version: string }>;
}): Promise<Metadata> {
  const { version } = await params;
  return {
    title: `Consulting Agreement (${version}) | William Harris`,
    description: `Consulting Agreement version ${version} between Upscale Level LLC and the client.`,
  };
}

export default async function AgreementVersionPage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;

  try {
    const { html } = await getAgreement(version);
    return (
      <Container>
        <div className="py-12">
          <Prose html={html} />
        </div>
      </Container>
    );
  } catch {
    notFound();
  }
}
