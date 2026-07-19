"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyState } from "@/components/shared/EmptyState";
import { CopyButton } from "@/components/tools/CopyButton";
import { SegmentedControl } from "@/components/tools/SegmentedControl";
import { ToolTextarea } from "@/components/tools/ToolTextarea";
import {
  buildQrPayload,
  emptyQrFields,
  type QrContentType,
  type QrFields,
  type WifiEncryption,
} from "@/lib/qr-payload";

/**
 * components/tools/qr-code-generator/QrCodeGenerator.tsx
 *
 * Live QR code generation for six content types. Payload construction is
 * pure (lib/qr-payload); this component owns form state and canvas
 * rendering via the `qrcode` library.
 *
 * BUNDLE NOTE: this is the first tool with a third-party dependency, so
 * implementations.tsx loads it with next/dynamic — the qrcode library is
 * code-split into a chunk fetched only on /tools/qr-code-generator. Every
 * other route's JS is unchanged.
 *
 * Rendering: one effect keyed on [payload, size, level] draws to a canvas.
 * The canvas's internal resolution is the chosen export size (256–1024)
 * while CSS caps its display width — downloads are crisp, layout stays
 * responsive. Renders are async with a cancellation flag so a stale draw
 * never overwrites a newer one; failures (e.g. payload too long for the
 * chosen error-correction level) surface as a role="alert" card.
 */

const CONTENT_TYPES = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
  { value: "wifi", label: "WiFi" },
] as const;

const SIZES = [
  { value: "256", label: "256 px" },
  { value: "512", label: "512 px" },
  { value: "1024", label: "1024 px" },
] as const;

const EC_LEVELS = [
  { value: "L", label: "L · 7%" },
  { value: "M", label: "M · 15%" },
  { value: "Q", label: "Q · 25%" },
  { value: "H", label: "H · 30%" },
] as const;

const WIFI_ENCRYPTION = [
  { value: "WPA", label: "WPA / WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "No password" },
] as const;

type EcLevel = (typeof EC_LEVELS)[number]["value"];

export function QrCodeGenerator() {
  const [type, setType] = useState<QrContentType>("url");
  const [fields, setFields] = useState<QrFields>(emptyQrFields);
  const [size, setSize] = useState<(typeof SIZES)[number]["value"]>("512");
  const [level, setLevel] = useState<EcLevel>("M");

  const [rendering, setRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [canCopyImage, setCanCopyImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ClipboardItem (image copy) is browser- and permission-dependent —
  // detect after mount so SSR markup never diverges.
  useEffect(() => {
    setCanCopyImage(
      typeof ClipboardItem !== "undefined" &&
        typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.write === "function",
    );
  }, []);

  function setField<K extends keyof QrFields>(key: K, value: QrFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  const payload = useMemo(() => buildQrPayload(type, fields), [type, fields]);
  const hasPayload = payload.length > 0;

  // Draw (or redraw) the QR code whenever payload/size/level change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !payload) return;

    let cancelled = false;
    setRendering(true);

    QRCode.toCanvas(canvas, payload, {
      width: Number(size),
      errorCorrectionLevel: level,
      margin: 2,
      // Fixed black-on-white regardless of theme: scanner contrast beats
      // dark-mode aesthetics for the code itself.
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(() => {
        if (!cancelled) setRenderError(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error && /too big|big to be stored/i.test(error.message)
            ? "This content is too long for a QR code at this error-correction level. Shorten it or lower the level."
            : "This content could not be encoded as a QR code.";
        setRenderError(message);
      })
      .finally(() => {
        if (!cancelled) setRendering(false);
      });

    return () => {
      cancelled = true;
    };
  }, [payload, size, level]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `qr-code-${size}px.png`;
      anchor.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const [imageCopied, setImageCopied] = useState(false);
  async function copyImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) return;
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setImageCopied(true);
      window.setTimeout(() => setImageCopied(false), 2000);
    } catch {
      // Write blocked — Download PNG remains as the guaranteed path.
    }
  }

  function clearAll() {
    setFields(emptyQrFields);
    setRenderError(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: content + options */}
      <div className="flex flex-col gap-6">
        <SegmentedControl
          label="What should the QR code contain?"
          options={CONTENT_TYPES}
          value={type}
          onChange={setType}
        />

        {(type === "url" || type === "text") && (
          <ToolTextarea
            id="qr-text"
            label={type === "url" ? "Link" : "Text"}
            value={fields.text}
            onChange={(value) => setField("text", value)}
            placeholder={
              type === "url"
                ? "https://example.com/your-page"
                : "Any text — notes, a message, a coupon code…"
            }
            rows={type === "url" ? 2 : 4}
          />
        )}

        {type === "email" && (
          <div className="flex flex-col gap-4">
            <Input
              id="qr-email-to"
              label="Email address"
              type="email"
              value={fields.emailTo}
              onChange={(value) => setField("emailTo", value)}
              placeholder="hello@example.com"
              autoComplete="off"
            />
            <Input
              id="qr-email-subject"
              label="Subject (optional)"
              value={fields.emailSubject}
              onChange={(value) => setField("emailSubject", value)}
              placeholder="Question about your product"
              autoComplete="off"
            />
            <ToolTextarea
              id="qr-email-body"
              label="Message (optional)"
              value={fields.emailBody}
              onChange={(value) => setField("emailBody", value)}
              placeholder="Pre-filled message body…"
              rows={3}
            />
          </div>
        )}

        {(type === "phone" || type === "sms") && (
          <div className="flex flex-col gap-4">
            <Input
              id="qr-phone"
              label="Phone number"
              type="tel"
              value={fields.phoneNumber}
              onChange={(value) => setField("phoneNumber", value)}
              placeholder="+1 555 123 4567"
              hint="Include the country code for reliable scanning."
              autoComplete="off"
            />
            {type === "sms" && (
              <ToolTextarea
                id="qr-sms-message"
                label="Message (optional)"
                value={fields.smsMessage}
                onChange={(value) => setField("smsMessage", value)}
                placeholder="Pre-filled SMS text…"
                rows={3}
              />
            )}
          </div>
        )}

        {type === "wifi" && (
          <div className="flex flex-col gap-4">
            <Input
              id="qr-wifi-ssid"
              label="Network name (SSID)"
              value={fields.wifiSsid}
              onChange={(value) => setField("wifiSsid", value)}
              placeholder="MyHomeNetwork"
              autoComplete="off"
            />
            <SegmentedControl
              label="Security"
              options={WIFI_ENCRYPTION}
              value={fields.wifiEncryption}
              onChange={(value) =>
                setField("wifiEncryption", value as WifiEncryption)
              }
            />
            {fields.wifiEncryption !== "nopass" && (
              <Input
                id="qr-wifi-password"
                label="Password"
                value={fields.wifiPassword}
                onChange={(value) => setField("wifiPassword", value)}
                placeholder="Network password"
                autoComplete="off"
                spellCheck={false}
              />
            )}
            <Checkbox
              id="qr-wifi-hidden"
              label="Hidden network"
              hint="the network doesn't broadcast its name"
              checked={fields.wifiHidden}
              onChange={(value) => setField("wifiHidden", value)}
            />
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
          <SegmentedControl
            label="Image size"
            options={SIZES}
            value={size}
            onChange={setSize}
          />
          <SegmentedControl
            label="Error correction"
            options={EC_LEVELS}
            value={level}
            onChange={setLevel}
          />
          <p className="text-xs text-foreground-muted">
            Higher error correction survives more damage or overlaid logos,
            but makes the code denser.
          </p>
        </div>
      </div>

      {/* Right: preview + actions */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground-muted">Preview</p>

        {renderError && (
          <div
            role="alert"
            className="rounded-xl border border-border bg-surface-sunken p-4 text-sm"
          >
            <p className="font-semibold text-foreground">
              Can&apos;t generate this QR code
            </p>
            <p className="mt-1 text-foreground-muted">{renderError}</p>
          </div>
        )}

        <div
          className={`relative items-center justify-center rounded-xl border border-border bg-white p-6 ${
            hasPayload && !renderError ? "flex" : "hidden"
          }`}
        >
          {/* Internal resolution = export size; CSS keeps display responsive. */}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`QR code encoding: ${payload}`}
            className="h-auto w-full max-w-80"
          />
          {rendering && (
            <p
              role="status"
              className="absolute bottom-2 right-3 text-xs text-foreground-muted"
            >
              Updating…
            </p>
          )}
        </div>

        {!hasPayload && !renderError && (
          <EmptyState
            title="Your QR code will appear here"
            description="Fill in the fields on the left — the code regenerates live with every keystroke, entirely in your browser."
          />
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={downloadPng} disabled={!hasPayload || !!renderError}>
            Download PNG
          </Button>
          {canCopyImage && (
            <Button
              variant="secondary"
              size="sm"
              onClick={copyImage}
              disabled={!hasPayload || !!renderError}
              aria-live="polite"
            >
              {imageCopied ? "Image copied" : "Copy image"}
            </Button>
          )}
          <CopyButton
            text={payload}
            label="Copy encoded text"
            disabled={!hasPayload}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            disabled={!hasPayload && !renderError}
          >
            Clear
          </Button>
        </div>

        {hasPayload && (
          <p className="break-all font-mono text-xs text-foreground-muted">
            {payload}
          </p>
        )}
      </div>
    </div>
  );
}
