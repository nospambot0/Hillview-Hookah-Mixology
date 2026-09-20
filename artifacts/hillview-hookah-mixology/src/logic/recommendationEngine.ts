import { flavours, type Flavour, type Strength } from '../data/flavours';
import type { FinderAnswers } from '../types';

export type Recommendation = {
  flavour: Flavour;
  title: string;
  description: string;
  pairing: string;
};

const strengthWeight: Record<Strength, number> = { Light: 1, Medium: 2, Strong: 3 };

export function getRecommendations(answers: FinderAnswers): Recommendation[] {
  const ranked = flavours
    .map((flavour) => {
      const tastePoints = flavour.tags.reduce((points, tag) => points + (answers.tastes.includes(tag) ? 5 : 0), 0);
      const favouritePoints = answers.favouriteId === flavour.id ? 10 : 0;
      const strengthPoints = Math.max(0, 5 - Math.abs(strengthWeight[flavour.strength] - strengthWeight[answers.strength]) * 2);
      const avoidPoints = answers.avoid.reduce((points, avoid) => {
        const target = avoid.replace('Too ', '');
        return points + (flavour.tags.includes(target) || (target === 'Strong' && flavour.strength === 'Strong') ? -8 : 0);
      }, 0);
      const surprisePoints = answers.surprise ? (flavour.id === 'adalya-lady-killer' ? 8 : 0) : 0;
      return { flavour, score: tastePoints + favouritePoints + strengthPoints + avoidPoints + surprisePoints };
    })
    .sort((a, b) => b.score - a.score || a.flavour.name.localeCompare(b.flavour.name));

  const picks = ranked.slice(0, 3);
  const titles = ['The house call', 'A confident second pour', 'The one to keep curious'];
  return picks.map(({ flavour }, index) => ({
    flavour,
    title: titles[index],
    description:
      index === 0
        ? `${flavour.character} It sits naturally inside the mood you described.`
        : index === 1
          ? `A little contrast, still in your lane. ${flavour.character}`
          : `For the table that likes a small plot twist. ${flavour.character}`,
    pairing: flavour.tags.slice(0, 3).join(' · '),
  }));
}
