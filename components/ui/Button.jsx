const Button = ({
  children,
  variant = "primary",
  className = "",
  href,
  target,
  rel,
  download,
  type = "button",
  ...props
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#bc8741] to-[#d6a85e] text-white hover:from-[#d6a85e] hover:to-[#eec876] hover:brightness-105",
    secondary:
      "border border-[#ba8a44] text-white bg-transparent hover:bg-[#ba8a44] hover:text-white",
    outline:
      "border border-[#eec876] text-[#eec876] bg-transparent hover:bg-[#ba8a44]/20 hover:text-[#eec876] hover:border-[#eec876]",
  };

  const classes = `
        inline-flex items-center justify-center
        min-h-11
        px-4 sm:px-5 lg:px-6
        py-3 lg:py-4
        text-sm sm:text-base
        font-semibold
        rounded-xl
        transition-all duration-200
        gap-1
        cursor-pointer
        uppercase tracking-[1.3px]
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${className}
      `;

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noreferrer" : undefined)}
        download={download}
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
