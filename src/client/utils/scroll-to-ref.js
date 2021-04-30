export default (ref, diff) => {
  if (ref) {
    window.setTimeout(() => {
      ref.current.scrollIntoView(true);
      window.setTimeout(() => {
        const { top } = ref.current.getBoundingClientRect();
        if (top < diff) {
          window.scrollBy(0, top - diff);
        }
      }, 100);
    }, 200);
  }
};

export const smoothScrollToRef = (ref, diff) => {
  if (ref && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.top + scrollTop - diff;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
};
