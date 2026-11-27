# MNML capability mapping

27 November Maya checkpoint: the nine room visual styles are validated prompt guidance, not verified native MNML styles; the single previously successful live interior test did not establish any of these particular outputs. Maya experience labels are UI aliases for existing tool operations, not provider model IDs. Other experience choices, including Motion, are disabled for the current workflow. Full per-control capability and quote registry remains to be implemented.

MNML documents render, edit, enhancement and video endpoints; its render modes include interior, exterior and landscape. The mappings below describe the application's existing integration, not proof that each specific result or control works. One interior synthetic render has succeeded live; the remaining tools need individual provider acceptance and output validation. Source and reference images for render/video requests are limited to 15 MB each. [MNML API reference](https://developers.mnml.ai/docs/api-reference) · [Render parameters](https://developers.mnml.ai/docs/renders)

| Studio tool | Existing operation | Limitations |
|---|---|---|
| Room Reimagination | Interior render | One synthetic provider render succeeded; saved-project journey pending |
| Virtual Home Staging | Interior render | Staging behavior unverified live |
| Furniture Refresh | Interior render | Precise placement and masks unverified |
| Seasonal Styling | Interior render | Season fidelity unverified |
| Decor Re-definition | Interior render | Spot selection unverified |
| Material Refinement | Interior render | Precise material targeting unverified |
| Lighting Reimagination | Interior render | Individual lighting control fidelity unverified |
| Outdoor Visualization | Exterior render | Live output unverified |
| Sky Transformation | Exterior render | Exact sky replacement unverified |
| Seasonal Transformation | Exterior render | Season fidelity unverified |
| Hardscape Design | Landscape render | Surface masks unavailable |
| Garden Design | Landscape render | Touch-up precision unverified |
| Spa & Pool Redesign | Landscape render | Pool geometry unverified |
| Visual Cleanup | Prompt edit | Brush-and-delete mode is rejected; mask support unavailable |
| Resolution Enhancement | Enhance or upscale | Manual controls are rejected; provider output unverified |
| Perspective Correction | Prompt edit | Exact geometric correction and sliders not verified |
| Object Placement | Prompt edit | Precise placement and masks unverified |

Configured controls are validated locally and supplied as prompt descriptions where supported; this does not establish that MNML honors each setting. Generated results remain private; server-side ownership checks and the Preview submission gate remain in force. No extra provider call was made during this assessment.

24 November remediation: the client and server now allow the photo workflow and, where supported by the existing configuration, style references; resolution enhancement additionally permits upscale. Generic sketch, plan, masterplan, concept and video choices are held unavailable pending tool-specific validation. Range controls without established bounds are disabled and rejected when changed; their default values are not passed as prompt instructions. These restrictions are local changes, not a claim of live provider verification.
