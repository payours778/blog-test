import { Request, Response } from 'express';
export declare const getMoments: (req: Request, res: Response) => Promise<void>;
export declare const getMomentById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createMoment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateMoment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMoment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const likeMoment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=momentController.d.ts.map