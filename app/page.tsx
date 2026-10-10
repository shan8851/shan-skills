// Retired. next.config.ts redirects every request to the main site;
// this page only exists as a fallback.
export default function Page() {
  return (
    <main style={{ padding: "4rem 1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <p>
        Skills have moved to{" "}
        <a href="https://www.shan8851.com/skills">shan8851.com/skills</a>.
      </p>
    </main>
  );
}
