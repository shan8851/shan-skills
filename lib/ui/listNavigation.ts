export const getWrappedIndex = (index: number, itemCount: number): number => {
  if (itemCount <= 0) {
    return 0;
  }

  if (index < 0) {
    return itemCount - 1;
  }

  if (index >= itemCount) {
    return 0;
  }

  return index;
};

export const getSelectedIndex = <T>(
  items: T[],
  isSelectedItem: (item: T) => boolean,
): number => {
  const matchedIndex = items.findIndex(isSelectedItem);

  if (matchedIndex >= 0) {
    return matchedIndex;
  }

  return 0;
};
