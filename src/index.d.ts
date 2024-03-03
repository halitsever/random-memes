import IReddit from "./lib/reddit";

export interface IMethods {
    random: () => void;
    reddit: (params: IReddit) => void;
}