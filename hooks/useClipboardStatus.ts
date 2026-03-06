import { useEffect, useState } from "react";

type ClipboardStatus = {
  copiedValue: string | null;
  copyText: (copiedValue: string, text: string) => Promise<boolean>;
};

export const useClipboardStatus = (resetDelayMs: number): ClipboardStatus => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    if (copiedValue === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedValue(null);
    }, resetDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copiedValue, resetDelayMs]);

  const copyText = async (
    nextCopiedValue: string,
    text: string,
  ): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(nextCopiedValue);
      return true;
    } catch {
      setCopiedValue(null);
      return false;
    }
  };

  return {
    copiedValue,
    copyText,
  };
};
