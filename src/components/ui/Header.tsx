interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-violet-800 p-8 rounded-3xl mb-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJjMCAwLTItMi0yLTRzMi00IDItNGMtMiAwLTQgMi00IDJzLTItMi0yLTRjMCAyLTIgNC0yIDRzLTIgMC00IDAgMiAyIDIgNC0yIDQtMiA0YzIgMCA0LTIgNC0yczIgMiAyIDRjMC0yIDItNCAyLTRzMiAwIDQgMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      <h1 className="relative text-4xl font-bold font-display m-0">
        {title}
      </h1>
      {subtitle && (
        <p className="relative mt-2 text-lg opacity-90 m-0">{subtitle}</p>
      )}
    </div>
  );
}
