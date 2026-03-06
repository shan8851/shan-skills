import { asciiBannerDesktop, asciiBannerMobile } from "@/components/ui/banners";
import { TerminalPanel } from "@/components/ui/terminalPanel";

export const HomeHero = () => {
  return (
    <TerminalPanel className="p-4 md:p-6">
      <div className="terminal-flicker-in">
        <pre className="glow-heading overflow-x-auto text-[8px] leading-[1.08] font-(--font-terminal-mono) whitespace-pre text-(--accent) sm:text-[9px] md:hidden">
          {asciiBannerMobile}
        </pre>
        <pre className="glow-heading hidden overflow-x-auto text-[9px] leading-[1.08] font-(--font-terminal-mono) whitespace-pre text-(--accent) md:block lg:text-[10px]">
          {asciiBannerDesktop}
        </pre>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-(--text-dim)">
          Skills I use regularly with coding agents. Use these as a starting
          point and adapt to your own workflow. Browse, search, and inspect
          every skill reference file with keyboard-first controls.
        </p>
      </div>
    </TerminalPanel>
  );
};
