import { eodepos } from './eodepos';
import { batchkeeper } from './batchkeeper';
import { rastaCutz } from './rasta-cutz';
import { wattforgeSolar } from './wattforge-solar';
import type { CaseStudy } from './types';

export type { WorkSummary, WorkTag, CaseStudy, FlowStep, FlowDiagram, ScreenPair, ScreenRef, SiteShot } from './types';
export const work = { eodepos, batchkeeper, rastaCutz, wattforgeSolar } as const;

/** Projects that have a full page at /work/<slug>, in the order "next project" follows. */
export const caseStudies: CaseStudy[] = [eodepos, batchkeeper, rastaCutz, wattforgeSolar];
