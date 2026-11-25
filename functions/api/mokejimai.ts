/** GET /api/mokejimai – kurie el. mokėjimai įjungti (be jokių slaptų duomenų) */
import { emailEnabled, json, onlineMethods, type Ctx } from '../../src/server/shop/env.ts';

export const onRequestGet = ({ env }: Ctx) => json({ online: onlineMethods(env), email: emailEnabled(env) });
