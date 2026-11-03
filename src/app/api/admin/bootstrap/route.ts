import { NextResponse } from "next/server";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidBootstrapToken(
  suppliedToken: string,
  expectedToken: string
): boolean {
  const supplied = Buffer.from(suppliedToken, "utf8");
  const expected = Buffer.from(expectedToken, "utf8");

  return (
    expected.length > 0 &&
    supplied.length === expected.length &&
    timingSafeEqual(supplied, expected)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;

  const bootstrapKey =
    typeof data.bootstrapKey === "string" ? data.bootstrapKey : "";
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password =
    typeof data.password === "string" ? data.password : "";
  const fullName =
    typeof data.fullName === "string" ? data.fullName.trim() : "";

  const expectedToken = process.env.ADMIN_BOOTSTRAP_TOKEN;

  if (
    !expectedToken ||
    !isValidBootstrapToken(bootstrapKey, expectedToken)
  ) {
    return NextResponse.json(
      { error: "Invalid bootstrap credentials." },
      { status: 401 }
    );
  }

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 ||
    !fullName
  ) {
    return NextResponse.json(
      { error: "Please provide a valid email, a password of at least 8 characters, and your full name." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const claimToken = randomUUID();

  let claimAcquired = false;
  let createdUserId: string | null = null;
  let bootstrapCompleted = false;

  try {
    const { data: claimed, error: claimError } = await admin.rpc(
      "claim_initial_owner_bootstrap",
      { p_claim_token: claimToken }
    );

    if (claimError) {
      throw claimError;
    }

    if (claimed !== true) {
      return NextResponse.json(
        { error: "Initial administrator setup has already been claimed or completed." },
        { status: 409 }
      );
    }

    claimAcquired = true;

    const { data: userData, error: createUserError } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

    if (createUserError) {
      await admin.rpc("release_initial_owner_bootstrap", {
        p_claim_token: claimToken,
      });

      claimAcquired = false;

      return NextResponse.json(
        { error: "Could not create the administrator account. The email may already be registered." },
        { status: 409 }
      );
    }

    if (!userData.user) {
      throw new Error("User creation returned no user.");
    }

    createdUserId = userData.user.id;

    const { error: bootstrapError } = await admin.rpc(
      "bootstrap_initial_owner",
      {
        p_user_id: createdUserId,
        p_email: email,
        p_full_name: fullName,
        p_claim_token: claimToken,
      }
    );

    if (bootstrapError) {
      throw bootstrapError;
    }

    bootstrapCompleted = true;
    claimAcquired = false;

    return NextResponse.json(
      {
        success: true,
        message: "Administrator account created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin bootstrap failed:", error);

    if (!bootstrapCompleted && createdUserId) {
      const { error: deleteError } =
        await admin.auth.admin.deleteUser(createdUserId);

      if (deleteError) {
        console.error("Failed to clean up Auth user after bootstrap failure.");
      }
    }

    if (claimAcquired) {
      const { error: releaseError } = await admin.rpc(
        "release_initial_owner_bootstrap",
        { p_claim_token: claimToken }
      );

      if (releaseError) {
        console.error("Failed to release administrator bootstrap claim.");
      }
    }

    return NextResponse.json(
      { error: "Administrator setup could not be completed. Please try again." },
      { status: 500 }
    );
  }
}