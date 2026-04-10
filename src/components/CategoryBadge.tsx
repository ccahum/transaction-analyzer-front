const categoryColors: Record<string, string> = {
  Food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Transport: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Entertainment: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Health: 'bg-green-500/20 text-green-300 border-green-500/30',
  Shopping: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Fuel: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Services: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Other: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const categoryEmojis: Record<string, string> = {
  Food: '🍔',
  Transport: '🚌',
  Entertainment: '🎬',
  Health: '💊',
  Shopping: '🛍️',
  Fuel: '⛽',
  Services: '⚙️',
  Other: '📦',
};

interface Props {
  category: string;
}

export default function CategoryBadge({ category }: Props) {
  const colorClass = categoryColors[category] ?? categoryColors.Other;
  const emoji = categoryEmojis[category] ?? '📦';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {emoji} {category}
    </span>
  );
}
