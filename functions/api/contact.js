/**
 * Cloudflare Pages Function — POST /api/contact
 * Handles the 4-field contact form on christopherfrendo.com and forwards via Resend API.
 * Set RESEND_API_KEY and CONTACT_TO_EMAIL in your Cloudflare Pages environment variables.
 */
export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const botcheck = formData.get('botcheck');
    if (botcheck) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const firstName = (formData.get('firstName') || '').toString().trim();
    const lastName = (formData.get('lastName') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, and email are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resendApiKey = context.env?.RESEND_API_KEY;
    const toEmail = context.env?.CONTACT_TO_EMAIL || 'chris@christopherfrendo.com';

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          ok: true,
          message: 'Form payload validated. Configure RESEND_API_KEY in Cloudflare Pages to enable email delivery.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Christopher Frendo Portfolio <onboarding@resend.dev>',
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio Inquiry from ${firstName} ${lastName}`,
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({ error: errText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
