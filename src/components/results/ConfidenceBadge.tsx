interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const percent = Math.round(confidence * 100);

  let colorClass: string;
  if (confidence > 0.85) {
    colorClass = 'bg-status-success/15 text-status-success';
  } else if (confidence >= 0.6) {
    colorClass = 'bg-status-warning/15 text-status-warning';
  } else {
    colorClass = 'bg-status-error/15 text-status-error';
  }

  return (
    <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-xs ${colorClass}`}>
      {percent}%
    </span>
  );
}
