function ConfirmModal({ isOpen, title, message, confirmLabel = "Confirm", confirmClass = "premium-btn-primary", onConfirm, onCancel }) {

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
            style={{ animation: 'confirmModalFadeIn 0.18s ease-out' }}
        >
            <style>{`
                @keyframes confirmModalFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes confirmModalSlideUp {
                    from { opacity: 0; transform: scale(0.95) translateY(12px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);    }
                }
            `}</style>

            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(4,2,18,0.75)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
                onClick={onCancel}
            />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden"
                style={{
                    background: 'linear-gradient(160deg,rgba(109,40,217,0.14) 0%,rgba(12,10,30,0.92) 100%)',
                    border: '1px solid rgba(168,85,247,0.32)',
                    boxShadow: '0 0 60px rgba(109,40,217,0.22), 0 0 0 1px rgba(168,85,247,0.08), 0 32px 64px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    animation: 'confirmModalSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* Top accent bar */}
                <div style={{ height: '3px', background: 'linear-gradient(90deg,#7c3aed,#a855f7,#06b6d4)' }} />

                <div className="px-8 pt-8 pb-8">

                    {/* Icon + Title */}
                    <div className="flex flex-col items-center text-center mb-7">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                            style={{
                                background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(168,85,247,0.18))',
                                border: '1px solid rgba(168,85,247,0.35)',
                                boxShadow: '0 0 28px rgba(124,58,237,0.3)',
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h2
                            className="text-2xl font-black mb-2"
                            style={{
                                background: 'linear-gradient(90deg,#f3e8ff,#c4b5fd)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.35))',
                            }}
                        >
                            {title}
                        </h2>
                        <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                            {message}
                        </p>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'rgba(168,85,247,0.12)', marginBottom: '24px' }} />

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(196,181,253,0.7)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.border = '1px solid rgba(168,85,247,0.3)';
                                e.currentTarget.style.color = '#e9d5ff';
                                e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.15)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = 'rgba(196,181,253,0.7)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 ${confirmClass}`}
                            style={{
                                background: 'linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7)',
                                border: '1px solid rgba(216,180,254,0.35)',
                                color: '#fff',
                                boxShadow: '0 0 24px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.4)',
                                letterSpacing: '0.3px',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 0 40px rgba(168,85,247,0.6), 0 8px 24px rgba(0,0,0,0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.45), 0 4px 16px rgba(0,0,0,0.4)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {confirmLabel}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
