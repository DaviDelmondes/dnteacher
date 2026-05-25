import type { VercelRequest, VercelResponse } from "@vercel/node"
import { prisma } from "../lib/prisma"
import { sendContactEmail } from "../lib/email"

const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "*"

function cors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  cors(res)

  if (req.method === "OPTIONS") return res.status(204).end()

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  try {
    const { name, phone, email, service, message } = req.body ?? {}

    if (!name || !phone || !service) {
      return res.status(400).json({
        error: "Campos obrigatórios: nome, telefone e serviço",
      })
    }

    const contact = await prisma.contact.create({
      data: { name, phone, email: email || null, service, message: message || null },
    })

    await sendContactEmail({ name, phone, email, service, message })

    return res.status(201).json({
      success: true,
      message: "Contato registrado com sucesso",
      id: contact.id,
    })
  } catch (err) {
    console.error("[contact]", err)
    return res.status(500).json({
      error: "Erro interno. Tente novamente em instantes.",
    })
  }
}
