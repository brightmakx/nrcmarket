import webpush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

console.log("VAPID PUBLIC KEY EXISTS:", !!publicKey);
console.log("VAPID PRIVATE KEY EXISTS:", !!privateKey);

if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
}

webpush.setVapidDetails(
    "mailto:mandabright17@gmail.com",
    publicKey,
    privateKey
);

export default webpush;