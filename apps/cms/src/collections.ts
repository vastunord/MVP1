import { APIError, type CollectionConfig, type Field } from "payload";
import {
  approvedCover,
  canPublish,
  publishable,
  staffRole,
  type Article,
} from "./editorial-policy.ts";

// Only the local bootstrap command carries this symbol; HTTP input cannot construct it.
export const bootstrapStaff = Symbol("trusted-cms-first-staff");

export const Staff: CollectionConfig = {
  slug: "staff",
  auth: { maxLoginAttempts: 5, lockTime: 600000, tokenExpiration: 3600 },
  admin: { useAsTitle: "email" },
  access: {
    admin: ({ req }) => !!staffRole(req.user),
    create: ({ req }) => staffRole(req.user) === "administrator",
    delete: ({ req }) => staffRole(req.user) === "administrator",
    read: ({ req }) =>
      staffRole(req.user) === "administrator" ||
      (req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) =>
      staffRole(req.user) === "administrator" ||
      (req.user ? { id: { equals: req.user.id } } : false),
  },
  hooks: {
    beforeChange: [
      ({ operation, req, context, data }) => {
        if (
          operation === "create" &&
          staffRole(req.user) !== "administrator" &&
          !(context as Record<symbol, unknown>)[bootstrapStaff]
        )
          throw new APIError(
            "An administrator must create staff accounts.",
            403,
          );
        return data;
      },
    ],
  },
  fields: [
    {
      name: "role",
      type: "select",
      options: ["editor", "publisher", "administrator"],
      defaultValue: "editor",
      required: true,
      access: { update: ({ req }) => staffRole(req.user) === "administrator" },
      saveToJWT: false,
    },
  ],
};

function language(name: "nb" | "en", label: string): Field {
  return {
    type: "group",
    name,
    label,
    fields: [
      { type: "text", name: "title", required: true },
      { type: "textarea", name: "summary", required: true },
      { type: "textarea", name: "body", required: true },
      {
        type: "text",
        name: "alt",
        label: "Cover image description",
        required: true,
      },
    ],
  };
}

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: { useAsTitle: "slug" },
  versions: { drafts: true, maxPerDoc: 30 },
  access: {
    read: ({ req }) => !!staffRole(req.user),
    readVersions: ({ req }) => !!staffRole(req.user),
    create: ({ req }) => !!staffRole(req.user),
    update: ({ req }) => !!staffRole(req.user),
    delete: ({ req }) => canPublish(staffRole(req.user)),
  },
  hooks: {
    beforeChange: [
      ({ req, data, originalDoc, operation }) => {
        const role = staffRole(req.user);
        // Runtime REST and local automation both pass through these checks.
        const publishing = data._status === "published";
        if (originalDoc?._status === "published" && data._status !== "draft") {
          throw new APIError(
            "Save changes as a draft for another editorial review.",
            400,
          );
        }
        if (publishing && !canPublish(role))
          throw new APIError("A publisher must approve publication.", 403);
        if (
          publishing &&
          (operation === "create" || originalDoc?.review !== "submitted")
        ) {
          throw new APIError(
            "Save the article as a submitted draft before publishing.",
            400,
          );
        }
        if (
          publishing &&
          !publishable({ ...originalDoc, ...data } as Article)
        ) {
          throw new APIError(
            "Complete both translations, cover, rights check and source note before publishing.",
            400,
          );
        }
        if (originalDoc?._status === "published" && !canPublish(role)) {
          throw new APIError(
            "A publisher must handle changes to a published article.",
            403,
          );
        }
        if (data._status === "draft") data.rightsConfirmed = false;
        return data;
      },
    ],
  },
  fields: [
    {
      type: "text",
      name: "slug",
      required: true,
      unique: true,
      index: true,
      validate: (value: string | undefined | null) =>
        (typeof value === "string" &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        "Use a lowercase, hyphenated URL slug.",
    },
    {
      type: "select",
      name: "review",
      options: [
        { label: "Drafting", value: "drafting" },
        { label: "Submitted for review", value: "submitted" },
      ],
      required: true,
      defaultValue: "drafting",
    },
    language("nb", "Norsk bokmål"),
    language("en", "English"),
    {
      type: "text",
      name: "cover",
      required: true,
      validate: (value: string | undefined | null) =>
        approvedCover(value) ||
        "Select an existing public Vastu Nord photo path.",
    },
    {
      type: "textarea",
      name: "sourceNote",
      label: "Editorial sources and image rights",
      required: true,
    },
    {
      type: "checkbox",
      name: "rightsConfirmed",
      label: "Commercial image rights and editorial content reviewed",
      defaultValue: false,
      access: {
        create: ({ req }) => canPublish(staffRole(req.user)),
        update: ({ req }) => canPublish(staffRole(req.user)),
      },
    },
  ],
};
