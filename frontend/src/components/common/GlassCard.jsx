function GlassCard({

    children,

    className = "",

    variant = "default",

    padding = "p-6",

    hover = false,

    ...props

}) {

    const variants = {

        default:
            "border-white/10",

        success:
            "border-amber-500/18",

        danger:
            "border-red-500/22",

        warning:
            "border-amber-500/22",

        amber:
            "border-amber-500/24"
    };

    return (

        <div
            className={`
                rounded-[24px]
                border
                backdrop-blur-2xl
                bg-[rgba(15,23,42,0.72)]
                shadow-[0_10px_40px_rgba(0,0,0,0.42)]
                transition-all
                duration-300
                border-white/10
                ${variants[variant]}
                ${padding}
                ${
                    hover
                        ? "hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.52),0_0_40px_rgba(250,204,21,0.08)] hover:border-amber-400/20"
                        : ""
                }
                ${className}
            `}
            {...props}
        >

            {children}

        </div>
    );
}

export default GlassCard;