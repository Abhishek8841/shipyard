import { prisma } from "@shipyard/database";
import type { signinType, signupType } from "../schema/auth.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { idType } from "../schema/auth.schema.js";


export const signupService = async (signupPayload: signupType) => {

    let saltRounds = 10;

    const { username, password } = signupPayload;
    const alreadExist = await prisma.user.findUnique({
        where: { username }
    });
    if (alreadExist) throw new Error("Username already taken");

    const hashed = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create(
        {
            data: {
                username,
                passwordHash: hashed
            }
        }
    );

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    return { user, token };
}

export const signinService = async (signupPayload: signinType) => {

    const { username, password } = signupPayload;
    const alreadyExist = await prisma.user.findUnique({
        where: { username }
    });

    if (!alreadyExist) throw new Error("User doesn't exist. Signup first.");

    const isCorrect = await bcrypt.compare(password, alreadyExist.passwordHash);
    if (!isCorrect) throw new Error("Invalid password");

    const payload = { id: alreadyExist.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    return { alreadyExist, token };
}

export const meService = async (mePayload: idType) => {
    const user = await prisma.user.findUnique({
        where: { id: mePayload },
        select: {
            username: true,
            id: true,
        }
    });
    if (!user) throw new Error("Invalid request");

    return user;

}

export const authMiddleWareService = (token: string) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof (payload) === "string") throw new Error("Invalid input");
    return payload;
}