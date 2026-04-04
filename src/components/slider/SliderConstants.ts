export const SPRING = { type: 'spring', damping: 28, stiffness: 180, mass: 0.8 } as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const fadeUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  },
});

export const slideIn = (delay: number = 0) => ({
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO } },
});

export const getDirection = (next: number, prev: number, total: number) => {
  if (total <= 1) return 0;
  if (next === 0 && prev === total - 1) return 1;
  if (next === total - 1 && prev === 0) return -1;
  return next > prev ? 1 : -1;
};
