"use client";
import {
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type InputHTMLAttributes,
} from "react";
export function Button({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={"button " + className} {...props} />;
}
export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={"input " + className} {...props} />;
}
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={"card " + className}>{children}</div>;
}
export function Dialog({
  label,
  close,
  children,
}: {
  label: string;
  close: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button className="quiet" onClick={() => ref.current?.showModal()}>
        {label}
      </Button>
      <dialog ref={ref} aria-label={label}>
        <div className="stack">
          <h2>{label}</h2>
          {children}
          <Button onClick={() => ref.current?.close()}>{close}</Button>
        </div>
      </dialog>
    </>
  );
}
