function ConfirmModal({ isOpen, title, message, confirmLabel = "Confirm", confirmClass = "premium-btn-primary", onConfirm, onCancel }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl shadow-2xl border border-gray-700/70 overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(15, 23, 42, 0.96) 0%, rgba(8, 12, 24, 0.98) 100%)' }}>

                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />

                <div className="px-7 pt-7 pb-7">

                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.28), rgba(168, 85, 247, 0.2))' }}>
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 leading-tight">{title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1.5 leading-relaxed">{message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="premium-btn-secondary flex-1 py-3 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`premium-action-button flex-1 py-3 text-sm ${confirmClass}`}
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
