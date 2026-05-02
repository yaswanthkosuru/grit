declare module "react-katex" {
  import { ComponentType } from "react";

  type KatexProps = {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: Record<string, unknown>;
    as?: keyof JSX.IntrinsicElements;
  };

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
}
