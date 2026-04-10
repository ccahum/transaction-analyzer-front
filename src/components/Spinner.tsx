interface Props {
  message?: string;
}

export default function Spinner({ message }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      {message && <p className="text-slate-400 text-sm">{message}</p>}
    </div>
  );
}
