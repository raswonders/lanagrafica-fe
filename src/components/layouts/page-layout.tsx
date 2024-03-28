import { ReactNode } from "react";

type PagePropsProps = {
  children?: ReactNode;
};

export function PageLayout({ children }: PagePropsProps) {
  return <section className="sm:px-8 pt-20">{children}</section>;
}
