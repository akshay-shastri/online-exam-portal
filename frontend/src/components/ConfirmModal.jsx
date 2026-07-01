import { TriangleAlert } from "lucide-react";

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
                    background: 'linear-gradient(160deg,rgba(250,204,21,0.10) 0%,rgba(12,10,30,0.94) 100%)',
                    border: '1px solid rgba(250,204,21,0.18)',
                    boxShadow: '0 0 60px rgba(250,204,21,0.12), 0 0 0 1px rgba(250,204,21,0.06), 0 32px 64px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    animation: 'confirmModalSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* Top accent bar */}
                <div style={{ height: '3px', background: 'linear-gradient(90deg,#facc15,#eab308,#ca8a04)' }} />

                <div className="px-8 pt-8 pb-8">

                    {/* Icon + Title */}
                    <div className="flex flex-col items-center text-center mb-7">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                            style={{
                                background: 'linear-gradient(135deg,rgba(250,204,21,0.24),rgba(234,179,8,0.16))',
                                border: '1px solid rgba(250,204,21,0.24)',
                                boxShadow: '0 0 28px rgba(250,204,21,0.18)',
                            }}
                        >
                            <TriangleAlert className="w-7 h-7 text-amber-200" />
                        </div>
                        <h2
                            className="text-2xl font-black mb-2"
                            style={{
                                background: 'linear-gradient(90deg,#fff7cc,#fde68a)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.24))',
                            }}
                        >
                            {title}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px' }}>
                            {message}
                        </p>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'rgba(250,204,21,0.12)', marginBottom: '24px' }} />

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.74)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                e.currentTarget.style.border = '1px solid rgba(250,204,21,0.18)';
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.boxShadow = '0 0 16px rgba(250,204,21,0.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.74)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 ${confirmClass}`}
                            style={{
                                background: 'linear-gradient(135deg,#facc15,#eab308,#ca8a04)',
                                border: '1px solid rgba(250,204,21,0.24)',
                                color: '#fff',
                                boxShadow: '0 0 24px rgba(250,204,21,0.18), 0 4px 16px rgba(0,0,0,0.4)',
                                letterSpacing: '0.3px',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 0 40px rgba(250,204,21,0.22), 0 8px 24px rgba(0,0,0,0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 0 24px rgba(250,204,21,0.18), 0 4px 16px rgba(0,0,0,0.4)';
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
