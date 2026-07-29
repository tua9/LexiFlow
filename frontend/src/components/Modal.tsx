import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    const maxW = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl';

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 w-full ${maxW} anim-pop rounded-t-2xl bg-surface shadow-card-hover sm:mx-4 sm:rounded-2xl`}>
                {title && (
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                        <h3 className="font-display text-base font-bold">{title}</h3>
                        <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-ink/[0.06] hover:text-ink">
                            <X size={18} />
                        </button>
                    </div>
                )}
                <div className="max-h-[80vh] overflow-y-auto px-5 py-4 scroll-thin">{children}</div>
            </div>
        </div>,
        document.body,
    );
}
