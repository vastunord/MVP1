import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPrivateMedia, matchesMagic, type AssetRecord, type MediaRepository, type PrivateMediaDriver } from '../src/server/media.ts';
import { canPublish } from '../src/server/gallery-policy.ts';
import { readServerConfig } from '../src/server/config.ts';

const actor = { userId: 'owner', workspaceId: 'vastu-workspace' };
const other = { userId: 'other', workspaceId: 'other-workspace' };
function fixture() {
  let asset: AssetRecord | null = null;
  let removed = false;
  const repo: MediaRepository = {
    async canEditProject(a, id) { return a.userId === actor.userId && a.workspaceId === actor.workspaceId && id === 'project'; },
    async findAsset(id) { return asset?.id === id ? asset : null; },
    async createPending(input) { asset = { id: input.id, workspaceId: input.actor.workspaceId, ownerId: input.actor.userId, origin: 'USER', state: 'PENDING', objectKey: input.objectKey, mimeType: input.contentType, byteSize: input.byteSize, uploadExpiresAt: input.expiresAt }; },
    async markValidated() { if (asset) asset.state = 'VALIDATED'; },
    async markQuarantined() { if (asset) asset.state = 'QUARANTINED'; },
    async markDeleted() { if (asset) asset.state = 'DELETED'; },
  };
  const driver: PrivateMediaDriver = {
    async signPut(key) { return `signed-put:${key}`; },
    async signGet(key) { return `signed-get:${key}`; },
    async inspect() { return { contentType: 'image/png', byteSize: 8, firstBytes: Uint8Array.from([137,80,78,71,13,10,26,10]) }; },
    async remove() { removed = true; },
  };
  return { media: createPrivateMedia(repo, driver, () => new Date('2026-11-21T12:00:00Z')), getAsset: () => asset, wasRemoved: () => removed };
}

test('private media authorizes only project editors and accepted image metadata', async () => {
  const { media, getAsset } = fixture();
  const request = { projectId: 'project', contentType: 'image/png', byteSize: 8, filename: 'room.png' };
  await assert.rejects(media.authorizeUpload(other, request), /Project access denied/);
  await assert.rejects(media.authorizeUpload(actor, { ...request, contentType: 'image/svg+xml' }), /Unsupported/);
  await assert.rejects(media.authorizeUpload(actor, { ...request, byteSize: 21 * 1024 * 1024 }), /size/);
  const ticket = await media.authorizeUpload(actor, request);
  assert.match(ticket.uploadUrl, /^signed-put:private\/vastu-workspace\//);
  assert.equal(getAsset()?.state, 'PENDING');
  await assert.rejects(media.complete(other, ticket.assetId), /access denied/);
  await media.complete(actor, ticket.assetId);
  await assert.rejects(media.authorizeDownload(other, ticket.assetId), /access denied/);
  assert.match(await media.authorizeDownload(actor, ticket.assetId), /^signed-get:private\//);
});

test('media validation rejects a mismatched object and deletion revokes access', async () => {
  const { media, getAsset, wasRemoved } = fixture();
  const ticket = await media.authorizeUpload(actor, { projectId: 'project', contentType: 'image/jpeg', byteSize: 8, filename: 'room.jpg' });
  await assert.rejects(media.complete(actor, ticket.assetId), /verification failed/);
  assert.equal(getAsset()?.state, 'QUARANTINED');
  await assert.rejects(media.authorizeDownload(actor, ticket.assetId), /access denied/);
  assert.equal(wasRemoved(), false);
  assert.equal(matchesMagic('image/png', Uint8Array.from([137,80,78,71,13,10,26,10])), true);
});

test('gallery requires rights, editorial review, and separate user consents', () => {
  const base = { origin: 'USER' as const, assetState: 'VALIDATED' as const, rightsVerified: true, activeConsentChannels: ['GALLERY'] as const, approvedReviewChannels: ['GALLERY', 'PINTEREST'] as const, withdrawn: false };
  assert.equal(canPublish(base, 'GALLERY'), true);
  assert.equal(canPublish(base, 'PINTEREST'), false);
  assert.equal(canPublish({ ...base, activeConsentChannels: ['GALLERY', 'PINTEREST'] }, 'PINTEREST'), true);
  assert.equal(canPublish({ ...base, withdrawn: true }, 'GALLERY'), false);
  assert.equal(canPublish({ ...base, rightsVerified: false }, 'GALLERY'), false);
  assert.equal(canPublish({ ...base, approvedReviewChannels: [] }, 'GALLERY'), false);
});

test('cloud configuration remains closed without dedicated resources', () => {
  assert.equal(readServerConfig({ APP_ENV: 'preview', MEDIA_UPLOADS_ENABLED: 'false' }).uploadsEnabled, false);
  assert.throws(() => readServerConfig({ APP_ENV: 'production', MEDIA_UPLOADS_ENABLED: 'true' }), /dedicated database/);
  assert.throws(() => readServerConfig({ APP_ENV: 'production', DATABASE_URL: 'not-a-url' }), /Invalid URL/);
});
