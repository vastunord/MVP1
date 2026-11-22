// Keep the owner's evidence even if an independently run isolation stage fails.
export async function runOwnerStage(actions) {
  const project = await actions.getOrCreateProject();
  const render = await actions.attachExistingRender(project);
  await actions.onCheckpoint?.("attachment", { project, render });
  await actions.verifyHistory(project, render);
  await actions.verifyOwnerAssets(render);
  await actions.onCheckpoint?.("owner assets", { project, render });
  await actions.verifyAnonymousDenial(render);
  await actions.verifyComparison(project, render);
  await actions.signOutAndBackIn();
  await actions.verifyHistory(project, render);
  await actions.verifyOwnerAssets(render);
  await actions.onCheckpoint?.("reopened", { project, render });
  return { project, render };
}

export async function runIsolationStage(actions, evidence) {
  if (!evidence?.project || !evidence?.render)
    throw new Error("Owner-stage evidence is required");
  if (!(await actions.hasVerifiedSecondUser())) return { status: "PENDING" };
  await actions.verifyOtherUserDenial(evidence.project, evidence.render);
  return { status: "PASS" };
}
