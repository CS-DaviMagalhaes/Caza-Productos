type OverlayProps = {
  onClick: () => void;
};

export function Overlay({ onClick }: OverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black/30 z-10"
      onClick={onClick}
      aria-label="Close panels"
    />
  );
}
