import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);


//Vérifie si le domaine de l'email a des enregistrements MX (peut recevoir des emails)

export async function validateEmailDomain(email: string): Promise<boolean> {
    try {
        const domain = email.split('@')[1];

        if (!domain) {
            return false;
        }

        // Vérifier les enregistrements MX (Mail Exchange)
        const mxRecords = await resolveMx(domain);

        // Le domaine doit avoir au moins un serveur mail
        return mxRecords && mxRecords.length > 0;
    } catch (error) {
        // Si la résolution DNS échoue, le domaine n'existe pas ou ne peut pas recevoir d'emails
        return false;
    }
}

// Liste de domaines jetables/temporaires à bloquer
const DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com',
    'throwaway.email',
    'temp-mail.org',
    'yopmail.com',
    'maildrop.cc'
];

// Vérifie si l'email utilise un domaine jetable
export function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}
