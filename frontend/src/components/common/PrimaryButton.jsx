function PrimaryButton({

    children,

    className = "",

    variant = "amber",

    ...props

}) {

    const variants = {

        amber:
            "from-[#facc15] via-[#eab308] to-[#ca8a04] border-amber-300/30",

        danger:
            "from-[#7f1d1d] via-[#b91c1c] to-[#ef4444] border-red-400/30",

        success:
            "from-[#0f766e] via-[#14b8a6] to-[#10b981] border-emerald-400/30",

        warning:
            "from-[#92400e] via-[#d97706] to-[#f59e0b] border-amber-400/30"
    };

    return (

        <button
            className={`
                px-6
                py-3
                rounded-[18px]
                font-bold
                text-white
                border
                bg-gradient-to-r
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-[0_20px_60px_rgba(250,204,21,0.18)]
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >

            {children}

        </button>
    );
}

export default PrimaryButton;