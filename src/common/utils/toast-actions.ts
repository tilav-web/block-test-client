import { toast } from "sonner";

export const toastError = (description: string) => {
  return toast.error("Xatolik!", { description });
};

export const toastSuccess = (description: string) => {
  return toast.success("Muvaffaqiyat!", { description });
};