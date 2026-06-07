import Script from "next/script";

export const metadata = { title: "Content Manager" };

export default function AdminPage() {
  return (
    <>
      <Script
        src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"
        strategy="beforeInteractive"
      />
    </>
  );
}
