export const ContainerWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${className} max-w-[1700px] mx-auto py-8 px-4 md:px-8 md:py-14 lg:px-12`}
    >
      {children}
    </div>
  );
};
