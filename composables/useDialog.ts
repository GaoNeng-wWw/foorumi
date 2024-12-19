export type UseDialog = {
  initializeValue?: boolean;
};
export const useDialog = (
  { initializeValue = false }: UseDialog,
) => {
  const isOpen = ref(initializeValue);
  const onBeforeCloseStack: (() => void)[] = [];
  const onCloseStack: (() => void)[] = [];
  const onBeforeClose = (cb: () => void) => {
    onBeforeCloseStack.push(cb);
  };
  const onClose = (cb: () => void) => {
    onCloseStack.push(cb);
  };
  const open = () => isOpen.value = true;
  const close = () => {
    onBeforeCloseStack.forEach(f => f());
    isOpen.value = false;
    onCloseStack.forEach(f => f());
  };
  const toggle = () => isOpen.value = !isOpen.value;
  return { isOpen, open, close, toggle, onBeforeClose, onClose };
};
