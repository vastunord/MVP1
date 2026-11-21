import 'server-only';
import { issueSignedToken,presignUrl,head,get,del } from '@vercel/blob';
import type { PrivateMediaDriver } from './media';

// Instantiate only after confirming a dedicated Vastu Nord private store.
export function createVercelPrivateDriver(token:string):PrivateMediaDriver {
  if(!token) throw new Error('Private storage credential is missing');
  return {
    async signPut(pathname,contentType,byteSize,expiresAt) {
      const scope=await issueSignedToken({pathname,operations:['put'],validUntil:expiresAt.getTime(),allowedContentTypes:[contentType],maximumSizeInBytes:byteSize,token});
      return (await presignUrl(scope,{operation:'put',pathname,access:'private',validUntil:expiresAt.getTime(),allowedContentTypes:[contentType],maximumSizeInBytes:byteSize})).presignedUrl;
    },
    async signGet(pathname,expiresAt) {
      const scope=await issueSignedToken({pathname,operations:['get'],validUntil:expiresAt.getTime(),token});
      return (await presignUrl(scope,{operation:'get',pathname,access:'private',validUntil:expiresAt.getTime(),useCache:false})).presignedUrl;
    },
    async inspect(pathname) {
      const metadata=await head(pathname,{token});
      if(!metadata) throw new Error('Object missing');
      const blob=await get(pathname,{access:'private',token});
      if(!blob) throw new Error('Object missing');
      if(!blob.stream) throw new Error('Object stream unavailable');
      const reader=blob.stream.getReader(); const firstBytes=new Uint8Array(12);let offset=0;
      try { while(offset<12) {const part=await reader.read();if(part.done)break;const length=Math.min(part.value.length,12-offset);firstBytes.set(part.value.subarray(0,length),offset);offset+=length;} }
      finally {await reader.cancel();}
      return {contentType:metadata.contentType,byteSize:metadata.size,firstBytes};
    },
    async remove(pathname) {await del(pathname,{token});},
  };
}
