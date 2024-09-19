export async function isPubKeyValid(pubKey: string) {
    // Check if the seller's public key is valid with openpgp
    try{
      await openpgp.readKey({ armoredKey: pubKey });
      return true;

    } catch (e) {
      return e;
    }
}