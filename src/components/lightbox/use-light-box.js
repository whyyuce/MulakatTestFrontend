import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export default function useLightBox(slides) {
  const [selected, setSelected] = useState(-1);

  const handleOpen = useCallback(
    (slideUrl) => {
      console.log('slides', slideUrl);
      const slideIndex = slides.findIndex((slide) => slide.url === slideUrl);
      console.log('slideindex', slideIndex);
      setSelected(slideIndex);
    },
    [slides]
  );

  const handleClose = useCallback(() => {
    setSelected(-1);
  }, []);

  return {
    selected,
    open: selected >= 0,
    onOpen: handleOpen,
    onClose: handleClose,
    setSelected,
  };
}
