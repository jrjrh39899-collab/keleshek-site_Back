import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const supabaseUrl = process.env.SUPABASE_URL || "https://xvqsbjzbngnolcggojwr.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "keleshek-backend",
    timestamp: new Date().toISOString(),
  });
});

// Get all coordinators
app.get("/api/members", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("keleshek_members")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get achievements
app.get("/api/achievements", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("keleshek_achievements")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get site content
app.get("/api/content", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("keleshek_content")
      .select("data")
      .eq("key", "main_content")
      .single();

    if (error) throw error;
    res.json(data ? data.data : null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Keleshek Backend running on port ${PORT}`);
});
