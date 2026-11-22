# Protected Preview browser verification

The final test deployment uses application commit `b35bbb28dd9f` and deployment ID `dpl_BepcdXDcQyUrnTpN8iqAsE7wr1UY`. On 22 November 2026, a fresh, signed-out Edge browser used the project’s short-lived trusted identity only for requests to this deployment. The guest journey used owner-approved gallery photos. [Vastu Nord technical Preview](https://vastunord-67rdd27lp-vastu-nord.vercel.app)

| Browser journey | Observed result |
| --- | --- |
| English homepage | Previous wrapped from the first image pair. Next returned to that pair. The four links covered rooms, lighting, materials and furniture. |
| FAQ and legal | The home page showed 12 FAQ entries. Expanding a question revealed its answer. The English footer opened English Terms of use. |
| Public gallery to Studio | The gallery listed 50 studies. The Bedrooms filter narrowed the gallery; its study dialog offered 17 photographic tool choices. Choosing Room Reimagination opened the guest editor with the matching title and selected source photo for `gallery-04`. |
| Studio settings | At 1440 × 960 the editor showed Open Studio and Workflow. Room and style thumbnails decoded. Changing the room updated its selected radio. Prana V1 offered Low, Medium, High, Ultra and Fast. The editor omitted seed controls and disabled Improve with Prana for an empty prompt. |
| Mobile | At 390 × 844 the gallery and guest editor fit the viewport. Tapping a study and opening Studio displayed its source image. |

The browser allowed read requests only. Rendering, registration, uploads and provider billing were outside this check.

[Desktop guest editor](guest-room-desktop.jpg) · [Mobile gallery](gallery-mobile.jpg)
