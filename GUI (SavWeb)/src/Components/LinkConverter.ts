import { SavWeb } from "./SavWeb";

const Messengers = [
  { name: "Telegram", link: "t.me/" }, // Checked
  { name: "Simplex", link: "simplex.chat/" }, // Checked
  { name: "Threema", link: "threema.id/" }, // Checked
  { name: "Line", link: "line.me/" }, // Checked
  { name: "Facebook", link: "facebook.com/" }, // Checked
  { name: "Twitter", link: "twitter.com/" }, // Checked
  { name: "Instagram", link: "instagram.com/" }, // Checked
  { name: "WhatsApp", link: "wa.me/" }, // Checked
  { name: "Discord", link: "discord." },
  { name: "Signal", link: "signal." },
  { name: "Keybase", link: "keybase." },
  { name: "Matrix", link: "matrix." },
  { name: "XMPP", link: "xmpp." },
  { name: "IRC", link: "irc." },
  { name: "Email", link: "mailto" },
  { name: "Wire", link: "wire." },
  { name: "WeChat", link: "weixin.qq.com/" },
  { name: "Viber", link: "viber." },
  { name: "KakaoTalk", link: "kakao" },
  { name: "Snapchat", link: "snapchat.com/" },
  { name: "TikTok", link: "tiktok.com/" },
  { name: "Reddit", link: "reddit.com/" },
  { name: "Wickr", link: "wickr.com/" },
  { name: "Ricochet", link: "ricochet." },
  { name: "Dust", link: "dust." },
  { name: "Hushed", link: "hushed." },
  { name: "CoverMe", link: "coverme." },
  { name: "GhostChat", link: "ghostchat." },
];

/**
 * Check if email is in a valid format
 * @param email
 * @returns
 */
export function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Remove the protocol https:// or http:// and www. from a url
 * @param url
 * @returns
 */
export function urlStartByDomainName(url: string) {
  let label = url.startsWith("https://")
    ? url.substring(8)
    : url.startsWith("http://")
    ? url.substring(7)
    : url;
  if (label.startsWith("www.")) {
    return label.substring(4);
  }
  return label;
}

/**
 * Get a short name of the messenger contact from a url
 * @param startByDomain URL start by domain name. So, without protocol and www.
 * @returns A short name of the messenger contact
 */
export function messengerShortName(startByDomain: string) {
  if (isValidEmail(startByDomain)) {
    let s = startByDomain.indexOf("@");
    if (s) {
      const e = startByDomain.indexOf(".", s + 1);
      if (e) return startByDomain.substring(s, e);
    }
  }
  const found = Messengers.find((m) => {
    return startByDomain.startsWith(m.link);
  });
  return found?.name;
}

export function openLinkOrMail(link: string, target = "_blank", content = "", subject = "") {
  if (!link.startsWith("https://") && !link.startsWith("mailto:")) {
    if (link.startsWith("http://")) {
      link = "https://" + link.substring(7);
    }
    if (isValidEmail(link)) {
      // Email
      link = `mailto:${link}`;
      if(subject.length > 0 || content.length > 0){
        link += `?${subject.length > 0 ? `subject=${encodeURIComponent(subject)}` : ''}${content.length > 0 ? `&body=${encodeURIComponent(content)}` : ''}`
      }
    }
    else {
      link = "https://" + link;
    }

    if(link.startsWith("https://t.me/") ){
      // Telegram
      if(subject.length > 0 || content.length > 0){
        const predefinedText = `?text=${encodeURIComponent(subject.length > 0 && content.length > 0? subject + '\n' : '' + content)}`;
        if(predefinedText.length < 2000) {
          // Telegram has a limit of around 2000 characters
          link += predefinedText;
        }
      }
    }
  }
  SavWeb.goTo(link, target);
}
