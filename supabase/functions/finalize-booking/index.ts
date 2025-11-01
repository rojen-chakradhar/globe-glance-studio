import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Backend not configured correctly");
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { booking_id, commission_percentage } = await req.json();
    if (!booking_id) {
      return new Response(JSON.stringify({ error: "booking_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pct = typeof commission_percentage === "number" && commission_percentage >= 0 ? commission_percentage : 15; // default 15%

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch booking
    const { data: booking, error: bookingError } = await adminClient
      .from("bookings")
      .select("id, guide_id, tourist_id, total_amount, duration_hours, status")
      .eq("id", booking_id)
      .maybeSingle();

    if (bookingError) throw bookingError;
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure requester is involved
    if (user.id !== booking.tourist_id && user.id !== booking.guide_id && booking.guide_id !== null) {
      return new Response(JSON.stringify({ error: "Unauthorized for this booking" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If guide_id is not set yet and caller is guide, assign them
    let guideId = booking.guide_id as string | null;
    if (!guideId && user.id !== booking.tourist_id) {
      // caller is the guide accepting a custom request
      guideId = user.id;
      const { error: setGuideError } = await adminClient
        .from("bookings")
        .update({ guide_id: guideId })
        .eq("id", booking_id);
      if (setGuideError) throw setGuideError;
    }

    if (!guideId) {
      return new Response(JSON.stringify({ error: "Guide not assigned" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalAmount = Number(booking.total_amount || 0);
    if (!isFinite(totalAmount) || totalAmount <= 0) {
      return new Response(JSON.stringify({ error: "Booking amount not set" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const commission = Math.round((totalAmount * (pct / 100)) * 100) / 100; // round to cents

    // Ensure wallet exists
    const { data: wallet, error: walletErr } = await adminClient
      .from("guide_tokens")
      .select("id, balance, currency")
      .eq("user_id", guideId)
      .maybeSingle();

    if (walletErr) throw walletErr;

    let currentBalance = Number(wallet?.balance || 0);

    if (!wallet) {
      // Create empty wallet
      const { data: newWallet, error: createWalErr } = await adminClient
        .from("guide_tokens")
        .insert({ user_id: guideId, balance: 0, currency: 'USD' })
        .select("id, balance, currency")
        .single();
      if (createWalErr) throw createWalErr;
      currentBalance = Number(newWallet.balance || 0);
    }

    if (currentBalance < commission) {
      return new Response(JSON.stringify({
        error: "Insufficient token balance",
        required: commission,
        balance: currentBalance,
      }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Deduct and log transaction
    const newBalance = Math.round((currentBalance - commission) * 100) / 100;

    const { error: balErr } = await adminClient
      .from("guide_tokens")
      .update({ balance: newBalance })
      .eq("user_id", guideId);
    if (balErr) throw balErr;

    const { error: txErr } = await adminClient
      .from("token_transactions")
      .insert({
        user_id: guideId,
        booking_id,
        amount: commission,
        direction: 'debit',
        reason: 'commission',
        metadata: { commission_percentage: pct },
      });
    if (txErr) throw txErr;

    // Mark booking confirmed if it was pending
    if (booking.status !== 'confirmed') {
      const { error: updBookingErr } = await adminClient
        .from("bookings")
        .update({ status: 'confirmed' })
        .eq("id", booking_id);
      if (updBookingErr) throw updBookingErr;
    }

    return new Response(JSON.stringify({
      success: true,
      commission,
      balance: newBalance,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("finalize-booking error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
