import type { Metadata } from "next";
import Container from "../../../_components/Container";
import Prose from "../../../_components/Prose";
import {
  CURRENT_AGREEMENT_VERSION,
  getCurrentAgreement,
} from "../../../../lib/content";
import StartClickwrap from "./StartClickwrap";

export const metadata: Metadata = {
  title: "Start engagement | William Harris",
  description:
    "Review and accept the Consulting Agreement, then continue to your Mercury invoice.",
};

export default async function StartPage() {
  const { html, frontmatter } = await getCurrentAgreement();

  return (
    <Container>
      <div className="py-12 space-y-8">
        <Prose html={html} />
        <StartClickwrap agreementVersion={frontmatter.version ?? CURRENT_AGREEMENT_VERSION} />
      </div>
    </Container>
  );
}
