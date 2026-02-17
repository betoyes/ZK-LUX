// server/asaas.ts
const ASAAS_BASE_URL = process.env.ASAAS_BASE_URL || "https://api-sandbox.asaas.com/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

function mustGetApiKey() {
  if (!ASAAS_API_KEY) throw new Error("Missing ASAAS_API_KEY env var");
  return ASAAS_API_KEY;
}

async function asaasFetch(path: string, init: RequestInit = {}) {
  const apiKey = mustGetApiKey();

  const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Asaas usa access_token no header :contentReference[oaicite:3]{index=3}
      "access_token": apiKey,
      ...(init.headers || {}),
    },
  });

  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch {}

  if (!res.ok) {
    const msg = json?.errors?.[0]?.description || json?.message || text || `HTTP ${res.status}`;
    throw new Error(`Asaas error: ${msg}`);
  }

  return json;
}

export type CreatePixPaymentInput = {
  customer: string; // customerId no Asaas
  value: number;
  description?: string;
};

export async function createPixPayment(input: CreatePixPaymentInput) {
  // POST /payments com billingType PIX (documentação de payments) :contentReference[oaicite:4]{index=4}
  const dueDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  return asaasFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customer,
      billingType: "PIX",
      value: input.value,
      description: input.description || "Pedido ZK-LUX",
      dueDate, // <-- AGORA VAI
    }),
  });

}

export async function getPixQrCode(paymentId: string) {
  // GET /payments/{id}/pixQrCode :contentReference[oaicite:5]{index=5}
  return asaasFetch(`/payments/${paymentId}/pixQrCode`, { method: "GET" });
}

// (opcional, mas recomendado) criar customer no Asaas
export async function createCustomerIfNeeded(data: { name: string; email: string; cpfCnpj?: string }) {
  return asaasFetch("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpfCnpj,
    }),
  });
}
