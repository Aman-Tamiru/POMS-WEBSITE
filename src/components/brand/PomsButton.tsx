
import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
  } from "react";

  type PomsButtonVariant = "gold" | "outline" | "text";

  type SharedProps = {
    children: ReactNode;
    variant?: PomsButtonVariant;
    className?: string;
  };

  type PomsButtonProps = SharedProps &
    ButtonHTMLAttributes<HTMLButtonElement>;

  type PomsLinkButtonProps = SharedProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

  function getButtonClass(
    variant: PomsButtonVariant,
    className = ""
  ) {
    return [
      "poms-button",
      `poms-button--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
  }

  export function PomsButton({
    children,
    variant = "gold",
    className,
    type = "button",
    ...props
  }: PomsButtonProps) {
    return (
      <button
        type={type}
        className={getButtonClass(variant, className)}
        {...props}
      >
        {children}
      </button>
    );
  }

  export function PomsLinkButton({
    children,
    href,
    variant = "gold",
    className,
    ...props
  }: PomsLinkButtonProps) {
    return (
      <a
        href={href}
        className={getButtonClass(variant, className)}
        {...props}
      >
        {children}
      </a>
    );
  }
