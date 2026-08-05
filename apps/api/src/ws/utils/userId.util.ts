import cookie from "cookie"
import { IncomingMessage } from "http"
import jwt from "jsonwebtoken"

export function getUserId(req: IncomingMessage): null | string {
    const parsedCookie = cookie.parseCookie(req.headers.cookie || "");
    const token = parsedCookie.token;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof payload == "string") return null;
    return payload.id;
}