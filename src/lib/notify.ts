import { toast } from "react-toastify";

export type NotifyType = "success" | "error" | "warning" | "info" | "default"

export const notify = ({ text, type }: { text: string, type: NotifyType }) => toast(text, { type, autoClose: 3000, hideProgressBar: true, closeOnClick: true })