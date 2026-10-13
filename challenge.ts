// Challenge 1: What can be built at this site?
//
// POST /api/lot-check drafts the lot checklist for the active site: what to
// look up in the town's zoning ordinance, where to find it, and recent Rhode
// Island housing law changes worth checking. It never fills in the values:
// those come from the ordinance, and the team types them in.
import type { Express } from 'express';
import { askGeminiJson, siteLines, SiteContext } from './challengeApi';

export interface LotCheckItem {
  label: string;
  whatToLookFor: string;
  whereToFindIt: string;
}

export interface ReformNote {
  title: string;
  whatItMeans: string;
  howItCouldApply: string;
}

export interface LotCheck {
  districtHint: string;
  items: LotCheckItem[];
  reforms: ReformNote[];
}

const SCHEMA = {
  type: 'object',
  properties: {
    districtHint: {
      type: 'string',
      description:
        'How to find the zoning district for this address (for example the town zoning map or GIS viewer). Do not guess the district.',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          whatToLookFor: { type: 'string' },
          whereToFindIt: { type: 'string' },
        },
        required: ['label', 'whatToLookFor', 'whereToFindIt'],
      },
    },
    reforms: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          whatItMeans: { type: 'string' },
          howItCouldApply: { type: 'string' },
        },
        required: ['title', 'whatItMeans', 'howItCouldApply'],
      },
    },
  },
  required: ['districtHint', 'items', 'reforms'],
};

const SYSTEM = `You help Rhode Island housing practitioners check what a zoning ordinance allows on a lot.
Never state a dimensional value (lot size, setback, height, unit count) as fact: say what to look for and where in the ordinance it usually is.
Cover at least: minimum lot size, front/side/rear setbacks, height limit, units allowed by right, parking minimums, and whether multifamily needs a special use permit.
For reforms, name Rhode Island housing laws from 2024 to 2026 that could change what a lot can hold (for example accessory dwelling units), and say "confirm the current law" in howItCouldApply.
Write plainly for someone who is not a lawyer.`;

export function registerChallenge(app: Express) {
  app.post('/api/lot-check', async (req, res) => {
    try {
      const site = req.body as SiteContext;
      if (!site?.address || !site?.town) {
        return res.status(400).json({ error: 'Explore a site first.' });
      }
      const result = await askGeminiJson<LotCheck>(
        SYSTEM,
        `${siteLines(site)}\n\nDraft the lot checklist for this site.`,
        SCHEMA
      );
      res.json(result);
    } catch (err: any) {
      console.error('Lot check error:', err);
      res.status(500).json({ error: err.message || 'Could not draft the lot checklist.' });
    }
  });
}
