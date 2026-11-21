export type Channel = 'GALLERY'|'PINTEREST'|'YOUTUBE';
export type Eligibility = { origin:'USER'|'COMPANY_DEMO'; assetState:'VALIDATED'|'PENDING'|'QUARANTINED'|'DELETED'; rightsVerified:boolean; activeConsentChannels:readonly Channel[]; approvedReviewChannels:readonly Channel[]; withdrawn:boolean };
export function canPublish(input:Eligibility,channel:Channel) {
  if(input.assetState!=='VALIDATED'||input.withdrawn||!input.rightsVerified) return false;
  if(!input.approvedReviewChannels.includes(channel)) return false;
  if(input.origin==='USER'&&(!input.activeConsentChannels.includes('GALLERY')||!input.activeConsentChannels.includes(channel))) return false;
  return true;
}
export interface DisabledSocialPublisherAdapter {
  readonly enabled:false;
  publish():never;
}
