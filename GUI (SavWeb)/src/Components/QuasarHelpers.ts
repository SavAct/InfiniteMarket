export async function copy(
  text: string | undefined,
  message: string,
  caption?: string
) {
  if (text !== undefined) {
    try {
      await Quasar.copyToClipboard(text);

      Quasar.Notify.create({
        type: "positive",
        message,
        caption,
        position: "top",
      });
      return;
    } catch (e) {}
  }
  Quasar.Notify.create({
    type: "negative",
    message: "Cannot copy to clipboard",
    position: "top",
  });
}