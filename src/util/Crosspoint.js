export const Crosspoint = (P1, P2, P3, P4) => {
  const S1 =
    ((P4.x - P2.x) * (P1.y - P2.y) - (P4.y - P2.y) * (P1.x - P2.x)) * 0.5;
  const S2 =
    ((P4.x - P2.x) * (P2.y - P3.y) - (P4.y - P2.y) * (P2.x - P3.x)) * 0.5;
  return {
    x: P1.x + (P3.x - P1.x) * (S1 / (S1 + S2)),
    y: P1.y + (P3.y - P1.y) * (S1 / (S1 + S2)),
  };
};
