/**
 * Typo Detection Utilities
 *
 * Custom implementation for detecting and suggesting corrections for email domain typos
 */

import { findClosestMatch, similarityScore } from './string-distance';

export const POPULAR_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'live.com',
  'msn.com',
  'me.com',
  'mac.com',
  'comcast.net',
  'verizon.net',
  'att.net',
  'sbcglobal.net',
  'bellsouth.net',
  'cox.net',
  'earthlink.net',
  'charter.net',
  'optonline.net',
  'juno.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'sohu.com',
  'yeah.net',
  'mail.ru',
  'inbox.ru',
  'bk.ru',
  'list.ru',
  'rambler.ru',
  'web.de',
  't-online.de',
  'freenet.de',
  'orange.fr',
  'laposte.net',
  'free.fr',
  'wanadoo.fr',
  'libero.it',
  'virgilio.it',
  'alice.it',
  'tiscali.it',
  'fastwebnet.it',
  'telenet.be',
  'skynet.be',
  'bluewin.ch',
  'uol.com.br',
  'bol.com.br',
  'terra.com.br',
  'ig.com.br',
  'globo.com',
  'rediffmail.com',
  'sify.com',
  'in.com',
];

export const POPULAR_SECOND_LEVEL_DOMAINS = [
  'yahoo',
  'hotmail',
  'outlook',
  'gmail',
  'icloud',
  'aol',
  'mail',
  'live',
  'msn',
  'comcast',
  'verizon',
  'att',
  'sbcglobal',
  'bellsouth',
  'cox',
  'earthlink',
  'charter',
  'optonline',
  'gmx',
  'yandex',
  'zoho',
  'protonmail',
];

export const POPULAR_TOP_LEVEL_DOMAINS = [
  'com',
  'net',
  'org',
  'edu',
  'gov',
  'mil',
  'co.uk',
  'com.au',
  'com.tw',
  'ca',
  'co.nz',
  'de',
  'fr',
  'it',
  'ru',
  'jp',
  'nl',
  'kr',
  'se',
  'eu',
  'ie',
  'co.il',
  'us',
  'at',
  'be',
  'dk',
  'hk',
  'es',
  'gr',
  'ch',
  'no',
  'cz',
  'in',
  'net.au',
  'info',
  'biz',
  'co.jp',
  'sg',
  'hu',
  'io',
  'co',
  'me',
  'tv',
  'cc',
  'ws',
  'name',
  'mobi',
  'asia',
  'tel',
  'travel',
  'pro',
  'aero',
  'coop',
  'museum',
  'jobs',
  'cat',
  'post',
  'app',
  'dev',
  'tech',
  'online',
  'site',
  'website',
  'store',
  'shop',
  'blog',
  'cloud',
  'email',
  'news',
  'media',
  'space',
  'world',
  'global',
  'digital',
  'network',
  'systems',
  'solutions',
  'services',
  'support',
  'help',
  'click',
  'link',
  'top',
  'xyz',
  'win',
  'bid',
  'download',
  'stream',
  'video',
  'photo',
  'pics',
  'pictures',
  'gallery',
  'design',
  'art',
  'music',
  'movie',
  'film',
  'radio',
  'live',
  'life',
  'love',
  'fun',
  'cool',
  'best',
  'new',
  'now',
  'today',
];

export interface TypoSuggestion {
  full: string;
  address: string;
  domain: string;
}

export interface TypoDetectionOptions {
  domains?: string[];
  secondLevelDomains?: string[];
  topLevelDomains?: string[];
  threshold?: number;
}

/**
 * Split email into parts
 */
function splitEmail(email: string): { address: string; domain: string } | null {
  const parts = email.split('@');
  if (parts.length !== 2) {
    return null;
  }
  return {
    address: parts[0]!,
    domain: parts[1]!,
  };
}

/**
 * Split domain into parts
 */
function splitDomain(domain: string): {
  secondLevel: string;
  topLevel: string;
} | null {
  const parts = domain.split('.');
  if (parts.length < 2) {
    return null;
  }

  if (parts.length === 2) {
    return {
      secondLevel: parts[0]!,
      topLevel: parts[1]!,
    };
  }

  const topLevel = parts.slice(1).join('.');
  return {
    secondLevel: parts[0]!,
    topLevel,
  };
}

/**
 * Detect typos in email domain and suggest corrections
 */
export function detectTypo(
  email: string,
  options: TypoDetectionOptions = {}
): TypoSuggestion | null {
  const {
    domains = POPULAR_DOMAINS,
    secondLevelDomains = POPULAR_SECOND_LEVEL_DOMAINS,
    topLevelDomains = POPULAR_TOP_LEVEL_DOMAINS,
    threshold = 0.7,
  } = options;

  const emailParts = splitEmail(email.toLowerCase().trim());
  if (!emailParts) {
    return null;
  }

  const { address, domain } = emailParts;

  if (domains.includes(domain)) {
    return null;
  }

  const closestDomain = findClosestMatch(domain, domains, threshold);
  if (closestDomain && closestDomain.match !== domain) {
    return {
      full: `${address}@${closestDomain.match}`,
      address,
      domain: closestDomain.match,
    };
  }

  const domainParts = splitDomain(domain);
  if (!domainParts) {
    return null;
  }

  const { secondLevel, topLevel } = domainParts;

  const closestSecondLevel = findClosestMatch(secondLevel, secondLevelDomains, threshold);
  const closestTopLevel = findClosestMatch(topLevel, topLevelDomains, threshold);

  if (!closestSecondLevel && !closestTopLevel) {
    return null;
  }

  const suggestedSecondLevel = closestSecondLevel ? closestSecondLevel.match : secondLevel;
  const suggestedTopLevel = closestTopLevel ? closestTopLevel.match : topLevel;
  const suggestedDomain = `${suggestedSecondLevel}.${suggestedTopLevel}`;

  if (suggestedDomain === domain) {
    return null;
  }

  return {
    full: `${address}@${suggestedDomain}`,
    address,
    domain: suggestedDomain,
  };
}

/**
 * Calculate confidence score for a typo suggestion
 */
export function calculateConfidence(originalDomain: string, suggestedDomain: string): number {
  return similarityScore(originalDomain, suggestedDomain);
}
