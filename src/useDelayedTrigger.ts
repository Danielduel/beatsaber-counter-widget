import React from "react";

function useDelayedTrigger(time: number) {
  const [triggered, setTriggered] = React.useState(false);
  const actualTimeout = React.useRef(-1);
  const trigger = React.useCallback(() => {
    clearTimeout(actualTimeout.current);
    const timeoutId = window.setTimeout(() => {
      setTriggered(false);
    }, time);
    actualTimeout.current = timeoutId;
    setTriggered(true);
  }, [setTriggered, actualTimeout]);

  return [triggered, trigger] as const;
}

export { useDelayedTrigger };
