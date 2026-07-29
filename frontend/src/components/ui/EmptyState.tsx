import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/** Generic empty state card — dùng lại ở SearchView, StudyView, TopicsView. */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
                {icon}
            </div>
            <p className="mt-3 font-display text-base font-semibold">{title}</p>
            <p className="mt-1 max-w-xs text-xs text-muted">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
