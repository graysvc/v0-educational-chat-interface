# Formulario de Contacto

## Que es

Modal con formulario (nombre, email, mensaje) que se abre desde el boton "Contacto" del footer. Envia un email a `guido@grays.vc` via Resend.

## Flujo

```
Click "Contacto" (footer)
  → Se abre modal
  → Usuario completa nombre, email, mensaje
  → Click "Enviar mensaje"
  → POST /api/contact { name, email, message }
  → API route valida campos (server-side)
  → Resend envia email a guido@grays.vc
  → Exito → muestra "Te respondere lo antes posible"
  → Error → muestra mensaje de error
```

## Archivos principales

| Archivo | Rol |
|---|---|
| `app/api/contact/route.ts` | Route handler: valida campos, envia email via Resend |
| `widgets/layout/contact-modal.tsx` | Modal con formulario y estado de envio |
| `widgets/layout/site-footer.tsx` | Boton que abre/cierra el modal |

## Validacion

### Client-side
- Campos `required` (HTML nativo)
- `type="email"` en input de email
- `maxLength` en cada campo
- Boton disabled mientras envia

### Server-side (`/api/contact`)
- `name`: string no vacio, max 100 chars
- `email`: formato valido (regex), max 254 chars
- `message`: string no vacio, max 2000 chars
- Sin `RESEND_API_KEY` → 503 con mensaje claro

## Servicio de email

- **Resend** (resend.com)
- API key: `RESEND_API_KEY` en `.env.local` (local) y Netlify env vars (produccion)
- Free tier: 100 emails/dia
- Sender: `onboarding@resend.dev` (default de Resend free tier)
- Reply-to: email del usuario (para responder directo)

## Seguridad

| Aspecto | Mitigacion |
|---|---|
| API key | Solo en server (`route.ts`), nunca en browser |
| XSS en email | Texto plano, Resend escapa HTML |
| Spam | Validacion de campos + Netlify DDoS protection |
| Datos personales | No se guarda nada en DB, email se envia y se olvida |

## Configuracion

1. Crear cuenta en resend.com
2. Generar API key
3. Agregar `RESEND_API_KEY=re_xxxxxxxx` en `.env.local`
4. Agregar misma key en Netlify → Site settings → Environment variables

## Validacion FSD

```
app/api/contact/route.ts
  → resend (npm externo)                    ✅

widgets/layout/contact-modal.tsx
  → react, lucide-react (npm externo)       ✅
  → No importa de capas superiores          ✅

widgets/layout/site-footer.tsx
  → ./contact-modal (mismo widget/slice)    ✅
```
