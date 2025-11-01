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

    // Authenticated client (reads user from Authorization header)
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });

    const {
      full_government_name,
      date_of_birth,
      gender,
      permanent_address,
      citizenship_photo_url,
      nid_photo_url,
      live_photo_url,
      driver_license_photo_url,
      qualification,
      profession,
      languages,
      experience_description,
      services_provided,
      bad_habits,
      hobbies,
      dreams,
      personality_type,
      why_choose_you,
      emergency_contact_name,
      emergency_contact_relation,
      emergency_contact_phone,
    } = await req.json();

    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role client for privileged insert
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Ensure guide profile exists and get id
    const { data: guideProfile, error: gpError } = await adminClient
      .from("guide_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (gpError) throw gpError;
    if (!guideProfile) {
      return new Response(JSON.stringify({ error: "Guide profile not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const insertPayload = {
      user_id: user.id,
      guide_profile_id: guideProfile.id,
      full_government_name,
      date_of_birth,
      gender,
      permanent_address,
      citizenship_photo_url,
      nid_photo_url,
      live_photo_url,
      driver_license_photo_url: driver_license_photo_url || null,
      qualification,
      profession,
      languages: Array.isArray(languages) ? languages : [],
      experience_description,
      services_provided,
      bad_habits: bad_habits || null,
      hobbies: hobbies || null,
      dreams: dreams || null,
      personality_type: personality_type || null,
      why_choose_you: why_choose_you || null,
      emergency_contact_name,
      emergency_contact_relation,
      emergency_contact_phone,
      verification_status: 'pending',
    };

    const { data: kyc, error: insertError } = await adminClient
      .from("kyc_verifications")
      .insert(insertPayload)
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true, kyc }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("submit-kyc error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});