export function typeText(
  text: string,
  speed: number,
  setTextState: (val: string) => void,
  callback?: () => void
) {
  let i = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  setTextState("");

  const tick = () => {
    if (i < text.length) {
      setTextState(text.substring(0, i + 1));
      i++;
      timeoutId = setTimeout(tick, speed);
    } else {
      if (callback) callback();
    }
  };

  tick();

  return {
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };
}
