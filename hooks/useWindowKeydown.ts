import { useEffect, useEffectEvent } from "react";

type KeydownHandler = (event: KeyboardEvent) => void;

export const useWindowKeydown = (keydownHandler: KeydownHandler): void => {
  const onKeydown = useEffectEvent(keydownHandler);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      onKeydown(event);
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);
};
