/**
 * lib/qr-payload.ts
 *
 * Pure builders that turn structured user input into the string a QR code
 * should encode, following the de-facto standard payload formats scanners
 * understand (mailto:, tel:, SMSTO:, WIFI:). Framework-free and
 * unit-testable, like the other lib/ modules. The qrcode rendering library
 * itself is only imported by the (code-split) tool component — this file
 * stays dependency-free.
 */

export type QrContentType = "url" | "text" | "email" | "phone" | "sms" | "wifi";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrFields {
  /** url + text */
  text: string;
  /** email */
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  /** phone + sms */
  phoneNumber: string;
  smsMessage: string;
  /** wifi */
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;
}

export const emptyQrFields: QrFields = {
  text: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  phoneNumber: "",
  smsMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
};

/** Escape the characters the WIFI: format treats as syntax. */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"'])/g, "\\$1");
}

/**
 * Build the encoded payload for the active content type. Returns "" when
 * the required field(s) for that type are empty — the tool shows its
 * empty state instead of encoding a meaningless fragment.
 */
export function buildQrPayload(type: QrContentType, fields: QrFields): string {
  switch (type) {
    case "text":
      return fields.text;

    case "url": {
      const url = fields.text.trim();
      return url;
    }

    case "email": {
      const to = fields.emailTo.trim();
      if (!to) return "";
      const params = new URLSearchParams();
      if (fields.emailSubject) params.set("subject", fields.emailSubject);
      if (fields.emailBody) params.set("body", fields.emailBody);
      const query = params.toString();
      return `mailto:${to}${query ? `?${query}` : ""}`;
    }

    case "phone": {
      const number = fields.phoneNumber.replace(/[^\d+]/g, "");
      return number ? `tel:${number}` : "";
    }

    case "sms": {
      const number = fields.phoneNumber.replace(/[^\d+]/g, "");
      if (!number) return "";
      // SMSTO:number:message — the most widely supported SMS payload.
      return `SMSTO:${number}:${fields.smsMessage}`;
    }

    case "wifi": {
      const ssid = fields.wifiSsid;
      if (!ssid) return "";
      const parts = [
        `T:${fields.wifiEncryption}`,
        `S:${escapeWifi(ssid)}`,
      ];
      if (fields.wifiEncryption !== "nopass" && fields.wifiPassword) {
        parts.push(`P:${escapeWifi(fields.wifiPassword)}`);
      }
      if (fields.wifiHidden) parts.push("H:true");
      return `WIFI:${parts.join(";")};;`;
    }
  }
}
