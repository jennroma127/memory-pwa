export async function onRequestPost(context) {
    try {
        const { to, subject, body, from } = await context.request.json();

        const apiKey = context.env.RESEND_API_KEY;
        if (!apiKey) {
            return Response.json(
                { error: 'RESEND_API_KEY not configured in Cloudflare environment variables' },
                { status: 500 }
            );
        }

        if (!to || !subject || !body) {
            return Response.json(
                { error: 'Missing required fields: to, subject, body' },
                { status: 400 }
            );
        }

        const fromAddress = from || 'MEmory <noreply@memory.jrovisionpros.com>';

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                from: fromAddress,
                to: Array.isArray(to) ? to : [to],
                subject,
                text: body
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return Response.json(
                { error: data.message || 'Failed to send email' },
                { status: res.status }
            );
        }

        return Response.json({ success: true, id: data.id });

    } catch (err) {
        return Response.json(
            { error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
