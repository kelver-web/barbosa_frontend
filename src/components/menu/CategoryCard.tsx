interface CategoryCardProps {
  name: string;
  totalProdutos?: number;
}

export default function CategoryCard({ name }: CategoryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-2 text-center shadow-sm dark:border-gray-700 dark:bg-white/[0.03]">
      <span className="text-base font-medium text-gray-800 dark:text-white">
        {name}
      </span>
    </div>
  );
}
