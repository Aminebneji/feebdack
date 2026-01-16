import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Domaines email populaires et légitimes
const POPULAR_EMAIL_DOMAINS = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
    'live.com',
    'msn.com',
    'aol.com',
    'mail.com',
    'zoho.com',
    'yandex.com',
    'gmx.com'
];

// Typos courants de domaines populaires
const COMMON_TYPOS: Record<string, string> = {
    'gail.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'outloo.com': 'outlook.com',
    'outlok.com': 'outlook.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'icoud.com': 'icloud.com',
    'iclod.com': 'icloud.com'
};

// Liste de domaines jetables/temporaires à bloquer
const DISPOSABLE_EMAIL_DOMAINS = [
    'tempmail.com',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com',
    'throwaway.email',
    'temp-mail.org',
    'yopmail.com',
    'maildrop.cc',
    'getnada.com',
    'trashmail.com'
];


//Vérifie si l'email contient un typo courant
export function detectEmailTypo(email: string): { hasTypo: boolean; suggestion?: string } {
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
        return { hasTypo: false };
    }

    if (COMMON_TYPOS[domain]) {
        return {
            hasTypo: true,
            suggestion: email.replace(domain, COMMON_TYPOS[domain])
        };
    }

    return { hasTypo: false };
}


// Vérifie si le domaine de l'email a des enregistrements MX (peut recevoir des emails)
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

// Vérifie si l'email utilise un domaine jetable
export function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}


//Vérifie si le domaine est dans la liste des domaines populaires

export function isPopularDomain(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return POPULAR_EMAIL_DOMAINS.includes(domain);
}
