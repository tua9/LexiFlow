interface SkeletonGridProps {
    count?: number;
    height?: string;
    cols?: string;
}

/** Animated skeleton grid dùng cho loading state của danh sách card. */
export function SkeletonGrid({
    count = 9,
    height = 'h-32',
    cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}: SkeletonGridProps) {
    return (
        <div className={`grid gap-3 ${cols}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`${height} animate-pulse rounded-2xl border border-border bg-surface`}
                />
            ))}
        </div>
    );
}
