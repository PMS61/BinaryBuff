"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel = React.forwardRef((
  {
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    onSelect,
    defaultIndex = 0,
    ...props
  },
  ref
) => {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
    startIndex: defaultIndex
  }, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(defaultIndex);

  const onPrevClick = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const onNextClick = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = React.useCallback((index) => {
    api?.scrollTo(index);
  }, [api]);

  const handleSelect = React.useCallback(() => {
    if (!api) return;

    const newIndex = api.selectedScrollSnap();
    setCurrentIndex(newIndex);
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    onSelect?.(newIndex);
  }, [api, onSelect]);

  React.useEffect(() => {
    if (!api) return;

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api, handleSelect]);

  React.useEffect(() => {
    if (setApi) {
      setApi(api);
    }
  }, [api, setApi]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev: onPrevClick,
        scrollNext: onNextClick,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        currentIndex
      }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "left-1 top-1/2 -translate-y-1/2"
          : "left-1/2 top-1 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute rounded-full",
        orientation === "horizontal"
          ? "right-1 top-1/2 -translate-y-1/2"
          : "bottom-1 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
