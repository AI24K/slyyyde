import { deleteDomainAndLinks } from "@/lib/api/domains";
import { dub } from "@/lib/dub";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { cancelSubscription } from "@/lib/stripe";
import { WorkspaceProps } from "@/lib/types";
import { formatRedisLink, redis } from "@/lib/upstash";
import {
  DUB_DOMAINS_ARRAY,
  LEGAL_USER_ID,
  LEGAL_WORKSPACE_ID,
  R2_URL,
} from "@dub/utils";
import { softDeleteDomainAndLinks } from "./links/soft-delete-links";

export async function deleteWorkspace(
  workspace: Pick<
    WorkspaceProps,
    "id" | "slug" | "logo" | "stripeId" | "referralLinkId"
  >,
) {
  // TODO:
  // Remove links associated with default domain

  const customDomains = await prisma.domain.findMany({
    where: {
      projectId: workspace.id,
    },
    select: {
      slug: true,
    },
  });

  await Promise.all([
    // Remove the users
    prisma.projectUsers.deleteMany({
      where: {
        projectId: workspace.id,
      },
    }),

    // Remove the default workspace
    prisma.user.updateMany({
      where: {
        defaultWorkspace: workspace.slug,
      },
      data: {
        defaultWorkspace: null,
      },
    }),

    // Cancel the workspace's Stripe subscription
    workspace.stripeId && cancelSubscription(workspace.stripeId),

    // Delete workspace logo if it's a custom logo stored in R2
    workspace.logo &&
      workspace.logo.startsWith(`${R2_URL}/logos/${workspace.id}`) &&
      storage.delete(workspace.logo.replace(`${R2_URL}/`, "")),

    // Set the referral link to `/deleted/[slug]`
    workspace.referralLinkId &&
      dub.links.update(workspace.referralLinkId, {
        key: `/deleted/${workspace.slug}-${workspace.id}`,
        archived: true,
        identifier: `/deleted/${workspace.slug}-${workspace.id}`,
      }),
  ]);

  // Delete the workspace
  await prisma.project.delete({
    where: {
      id: workspace.id,
    },
  });

  // Trigger the links cleanup job for each custom domain
  if (customDomains.length > 0) {
    await Promise.all(
      customDomains.map(({ slug }) =>
        softDeleteDomainAndLinks({
          workspace,
          domain: slug,
        }),
      ),
    );
  }
}

export async function deleteWorkspaceAdmin(
  workspace: Pick<
    WorkspaceProps,
    "id" | "slug" | "logo" | "stripeId" | "referralLinkId"
  >,
) {
  const [customDomains, defaultDomainLinks] = await Promise.all([
    prisma.domain.findMany({
      where: {
        projectId: workspace.id,
      },
      select: {
        slug: true,
      },
    }),
    prisma.link.findMany({
      where: {
        projectId: workspace.id,
        domain: {
          in: DUB_DOMAINS_ARRAY,
        },
      },
    }),
  ]);

  const updateLinkRedisResponse = await Promise.allSettled(
    defaultDomainLinks.map(async (link) => {
      return redis.hset(link.domain.toLowerCase(), {
        [link.key.toLowerCase()]: {
          ...(await formatRedisLink(link)),
          projectId: LEGAL_WORKSPACE_ID,
        },
      });
    }),
  );

  // update all default domain links to the legal workspace
  const updateLinkPrismaResponse = await prisma.link.updateMany({
    where: {
      projectId: workspace.id,
      domain: {
        in: DUB_DOMAINS_ARRAY,
      },
    },
    data: {
      userId: LEGAL_USER_ID,
      projectId: LEGAL_WORKSPACE_ID,
    },
  });

  console.log({ updateLinkRedisResponse, updateLinkPrismaResponse });

  // delete all domains, links, and uploaded images associated with the workspace
  const deleteDomainsLinksResponse = await Promise.allSettled([
    ...customDomains.map(({ slug }) => deleteDomainAndLinks(slug)),
  ]);

  const deleteWorkspaceResponse = await Promise.allSettled([
    // delete workspace logo if it's a custom logo stored in R2
    workspace.logo &&
      workspace.logo.startsWith(`${R2_URL}/logos/${workspace.id}`) &&
      storage.delete(workspace.logo.replace(`${R2_URL}/`, "")),
    // if they have a Stripe subscription, cancel it
    workspace.stripeId && cancelSubscription(workspace.stripeId),
    // set the referral link to `/deleted/[slug]`
    workspace.referralLinkId &&
      dub.links.update(workspace.referralLinkId, {
        key: `/deleted/${workspace.slug}-${workspace.id}`,
        archived: true,
        identifier: `/deleted/${workspace.slug}-${workspace.id}`,
      }),
    // delete the workspace
    prisma.project.delete({
      where: {
        slug: workspace.slug,
      },
    }),
  ]);

  return {
    updateLinkRedisResponse,
    updateLinkPrismaResponse,
    deleteDomainsLinksResponse,
    deleteWorkspaceResponse,
  };
}
