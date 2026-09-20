import type { Choice } from '../types';
import { getFlavour } from '../data/flavours';

export const WHATSAPP_DESTINATION = '917978443720';

export function buildWhatsAppMessage(choice: Choice): string {
  const flavourText = choice.flavourIds
    .map((id) => {
      const flavour = getFlavour(id);
      if (!flavour) return '';
      return `${flavour.name} (${choice.customizations[id] ?? 'Normal'})`;
    })
    .filter(Boolean)
    .join('\n');

  return [
    'Hello Hillview Hookah Expert,',
    '',
    'I found my customised choice with Hillview Hookah Mixology.',
    '',
    `Recommended Mix: ${choice.mixName || 'A thoughtful Hillview mix'}`,
    `Flavours:\n${flavourText || 'Surprise me with a thoughtful mix.'}`,
    `Taste: ${choice.tastes.length ? choice.tastes.join(', ') : 'Surprise me'}`,
    `Strength: ${choice.strength}`,
    `Avoid: ${choice.avoid.length ? choice.avoid.join(', ') : 'Nothing noted'}`,
    `Remarks: ${choice.remarks.trim() || 'None'}`,
    '',
    'Please prepare this choice for my table.',
    '— Hillview Hookah Mixology',
  ].join('\n');
}

export function getWhatsAppUrl(choice: Choice): string {
  return `https://wa.me/${WHATSAPP_DESTINATION}?text=${encodeURIComponent(buildWhatsAppMessage(choice))}`;
}