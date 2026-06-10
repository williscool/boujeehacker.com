import Container from "../../_components/Container";
import Prose from "../../_components/Prose";
import CTAButton from "../../_components/CTAButton";
import SocialLinkRow from "../../_components/SocialLinkRow";
import WorkCard from "../../_components/WorkCard";
import IdentityLine from "../../_components/IdentityLine";
import NowLine from "../../_components/NowLine";

export default function PreviewPage() {
  return (
    <Container>
      <div className="py-12 space-y-16">
        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            IdentityLine
          </p>
          <div className="mt-3">
            <IdentityLine
              markdown={`Hi! I'm William Harris. I build software real users depend on, from scrappy startups like early [OpenSea](https://opensea.io) to 300MM+-user systems at [LinkedIn](https://linkedin.com/in/31iqml).`}
            />
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Selected Work (WorkCard)
          </p>
          <div className="mt-3">
            <WorkCard
              item={{
                title: "cnf-testsuite",
                outcome: "CNCF project, 175+ stars, conference talk",
                url: "https://github.com/cncf/cnf-testsuite",
              }}
            />
            <WorkCard
              item={{
                title: "BCGX Snowflake pipeline",
                outcome:
                  "10M datapoints/day, $10–20M/yr customer savings",
                url: "https://example.com",
              }}
            />
            <WorkCard
              item={{
                title: "OpenSea social integrations",
                outcome: "Early-stage growth surface for the largest NFT marketplace",
                url: "https://opensea.io",
              }}
            />
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            NowLine
          </p>
          <div className="mt-3">
            <NowLine
              markdown="Building RecoverMoney on Whop; advising founders scaling vibe-coded apps."
            />
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            CTAButton + SocialLinkRow
          </p>
          <div className="mt-3 flex flex-col gap-4 items-start">
            <CTAButton href="/work-together/">Work with me</CTAButton>
            <SocialLinkRow
              links={[
                { label: "LinkedIn", href: "https://linkedin.com/in/31iqml" },
                { label: "GitHub", href: "https://github.com/williscool" },
                { label: "Email", href: "mailto:hi@example.com" },
              ]}
            />
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Prose
          </p>
          <div className="mt-3">
            <Prose>
              <h2>A second-level heading</h2>
              <p>
                A paragraph of body copy at the standard reading measure. This
                column should feel composed, not sprawled (about 65 characters
                per line). Inline <a href="#">links look like this</a> and{" "}
                <code>inline code</code> renders in a mono face.
              </p>
              <h3>A third-level heading</h3>
              <ul>
                <li>List items have a little breathing room.</li>
                <li>And tasteful disc bullets.</li>
              </ul>
              <blockquote>
                A blockquote sits behind a thin border in the muted text color.
              </blockquote>
            </Prose>
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Type scale
          </p>
          <div className="mt-3 space-y-2">
            <p className="font-display text-6xl m-0">Display 6xl</p>
            <p className="font-display text-5xl m-0">Display 5xl</p>
            <p className="font-display text-4xl m-0">Display 4xl</p>
            <p className="font-display text-3xl m-0">Display 3xl</p>
            <p className="text-xl m-0">Sans xl</p>
            <p className="text-lg m-0">Sans lg</p>
            <p className="text-base m-0">Sans base</p>
            <p className="text-sm m-0 text-text-muted">Sans sm muted</p>
            <p className="text-xs m-0 text-text-muted uppercase tracking-wide">
              Sans xs muted caps
            </p>
          </div>
        </section>

        <section>
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Color swatches
          </p>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(
              [
                ["bg", "var(--color-bg)"],
                ["surface", "var(--color-surface)"],
                ["text", "var(--color-text)"],
                ["text-muted", "var(--color-text-muted)"],
                ["border", "var(--color-border)"],
                ["accent", "var(--color-accent)"],
                ["accent-hover", "var(--color-accent-hover)"],
              ] as const
            ).map(([name, color]) => (
              <div
                key={name}
                className="border border-border rounded p-3 text-xs"
              >
                <div
                  className="h-12 w-full rounded mb-2 border border-border"
                  style={{ background: color }}
                />
                <span className="font-medium">{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
