"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeWrapper({ value, size }: { value: string; size: number }) {
  return <QRCodeCanvas value={value} size={size} level="H" includeMargin />;
}
