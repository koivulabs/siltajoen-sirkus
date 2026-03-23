export const prerender = false; // Always run server-side

import { Resend } from 'resend';

// Only instantiate Resend if the API key is present
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    
    // Distinguish between Contact Form and Newsletter
    const formType = data.get('type') || 'contact';
    const email = data.get('email');
    
    // Check if API key is configured correctly before actually attempting
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Email not sent.");
      return new Response(JSON.stringify({
        success: true,
        message: 'Lomake vastaanotettu! (Testitila - ei lähetetty).'
      }), {
        status: 200,
      });
    }

    if (formType === 'newsletter') {
      const response = await resend.emails.send({
        from: 'Ilmoitukset <onboarding@resend.dev>', // Update when domain verified
        to: ['siilo@siltajoensirkus.fi', 'marianne@siltajoensirkus.fi'],
        subject: 'Siltajoen Sirkus: Uusi uutiskirjetilaus!',
        html: `<p>Uusi uutiskirjeen tilaaja:</p><p>Sähköposti: <b>${email}</b></p>`
      });
      if (response.error) throw new Error(response.error.message);
    } else {
      const name = data.get('name');
      const message = data.get('message');
      
      const response = await resend.emails.send({
        from: 'Yhteydenotot <onboarding@resend.dev>', // Update when domain verified
        to: ['siilo@siltajoensirkus.fi', 'marianne@siltajoensirkus.fi'],
        subject: `Siltajoen Sirkus: Yhteydenotto lähettäjältä ${name}`,
        html: `<p>Uusi viesti tullut sivujen kautta!</p>
               <p><b>Nimi:</b> ${name}</p>
               <p><b>Sähköposti:</b> ${email}</p>
               <fieldset style="margin-top:20px; padding:10px; border:1px solid #ccc;">
                <legend>Viesti:</legend>
                <p>${message}</p>
               </fieldset>`
      });
      if (response.error) throw new Error(response.error.message);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Viesti on lähetetty onnistuneesti!'
    }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Viestin lähetys epäonnistui. Yritä uudelleen myöhemmin.'
    }), { status: 500 });
  }
};
