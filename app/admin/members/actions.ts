"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  MemberStatus,
  MembershipStatus,
} from "../../../lib/generated/prisma/client";
import { prisma } from "../../../lib/prisma";

function getMembershipStatus(memberStatus: MemberStatus) {
  switch (memberStatus) {
    case MemberStatus.CANCELLED:
      return MembershipStatus.CANCELLED;

    case MemberStatus.INACTIVE:
      return MembershipStatus.EXPIRED;

    case MemberStatus.SUSPENDED:
      return MembershipStatus.PAUSED;

    default:
      return MembershipStatus.ACTIVE;
  }
}

function readMemberForm(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const membershipPlan = String(
    formData.get("membershipPlan") ?? "",
  ).trim();
  const statusValue = String(formData.get("status") ?? "ACTIVE");

  if (!firstName || !lastName || !email || !membershipPlan) {
    throw new Error("Please complete all required fields.");
  }

  const validStatuses = Object.values(MemberStatus);

  if (!validStatuses.includes(statusValue as MemberStatus)) {
    throw new Error("Invalid member status.");
  }

  return {
    firstName,
    lastName,
    email,
    phone: phone || null,
    membershipPlan,
    status: statusValue as MemberStatus,
  };
}

export async function createMember(formData: FormData) {
  const memberData = readMemberForm(formData);

  const plan = await prisma.membershipPlan.findUnique({
    where: {
      name: memberData.membershipPlan,
    },
  });

  if (!plan) {
    throw new Error("The selected membership plan does not exist.");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);

  endDate.setDate(endDate.getDate() + plan.durationDays);

  await prisma.member.create({
    data: {
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone,
      status: memberData.status,
      memberships: {
        create: {
          planId: plan.id,
          status: getMembershipStatus(memberData.status),
          startDate,
          endDate,
        },
      },
    },
  });

  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function updateMember(
  memberId: string,
  formData: FormData,
) {
  const memberData = readMemberForm(formData);

  const [member, selectedPlan] = await Promise.all([
    prisma.member.findUnique({
      where: {
        id: memberId,
      },
      include: {
        memberships: {
          where: {
            status: {
              in: [
                MembershipStatus.ACTIVE,
                MembershipStatus.PAUSED,
              ],
            },
          },
          orderBy: {
            startDate: "desc",
          },
          take: 1,
        },
      },
    }),

    prisma.membershipPlan.findUnique({
      where: {
        name: memberData.membershipPlan,
      },
    }),
  ]);

  if (!member) {
    throw new Error("Member not found.");
  }

  if (!selectedPlan) {
    throw new Error("The selected membership plan does not exist.");
  }

  const currentMembership = member.memberships[0];
  const planHasChanged =
    !currentMembership ||
    currentMembership.planId !== selectedPlan.id;

  await prisma.$transaction(async (transaction) => {
    await transaction.member.update({
      where: {
        id: memberId,
      },
      data: {
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        email: memberData.email,
        phone: memberData.phone,
        status: memberData.status,
      },
    });

    if (planHasChanged) {
      if (currentMembership) {
        await transaction.membership.update({
          where: {
            id: currentMembership.id,
          },
          data: {
            status: MembershipStatus.CANCELLED,
            endDate: new Date(),
          },
        });
      }

      const startDate = new Date();
      const endDate = new Date(startDate);

      endDate.setDate(
        endDate.getDate() + selectedPlan.durationDays,
      );

      await transaction.membership.create({
        data: {
          memberId,
          planId: selectedPlan.id,
          status: getMembershipStatus(memberData.status),
          startDate,
          endDate,
        },
      });
    } else if (currentMembership) {
      await transaction.membership.update({
        where: {
          id: currentMembership.id,
        },
        data: {
          status: getMembershipStatus(memberData.status),
        },
      });
    }
  });

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${memberId}/edit`);

  redirect("/admin/members");
}
export async function deleteMember(memberId: string) {
  await prisma.$transaction(async (transaction) => {
    await transaction.booking.deleteMany({
      where: {
        memberId,
      },
    });

    await transaction.membership.deleteMany({
      where: {
        memberId,
      },
    });

    await transaction.payment.deleteMany({
      where: {
        memberId,
      },
    });

    await transaction.order.deleteMany({
      where: {
        memberId,
      },
    });

    await transaction.member.delete({
      where: {
        id: memberId,
      },
    });
  });

  revalidatePath("/admin/members");
}