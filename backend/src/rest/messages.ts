import { PublicKey } from '@solana/web3.js';
import { Express, Request, Response } from 'express';
import { createDirectMessgeThread, getThreadsForUser } from '../util/dialect-utils';

const ENDPOINT_URL = "/api/messages"

export function initMessageEndpoints(app: Express) {

    app.post(`${ENDPOINT_URL}/create`, async (req: Request, res: Response) => {

        let creator = req.body.creator
        let recipient = req.body.recipient

        return res.send(await createDirectMessgeThread(creator, recipient))

    })

    app.get(`${ENDPOINT_URL}/get`, async (req: Request, res: Response) => {
        let user = req.query.user
        return res.send(await getThreadsForUser((user as string)))
    })



}