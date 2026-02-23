const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js")

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey )

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Supabase is ready !");
});

app.get("/todos", async(req, res) => {
  try {
    const { data, error } = await supabase
    .from("Todos")
    .select("*");

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.log("Error fetching todos:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: error.message})
  }
});

app.delete("/todos/:id", async(req,res) => {
  try {
    const todoId = req.params.id;
    
    const { data , error } = await supabase
    .from("Todos")
    .delete()
    .eq("id", todoId)
    .select();

    if (error) throw error

    if (!data || data.length == 0) {
      return res.status(404).json({ message: "ไม่พบงานที่ต้องการลบ Id อาจจะผิดน้า"});
    }

    res.json({ message: "ลบงานสำเร็จเรียบร้อยแล้ว!", deletedData: data});
  } catch (error) {
    console.log("Error deleting todo:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล",error: error.message})
  }
})

app.post("/todos", async(req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "กรุณาส่งชื่องาน (title) มาด้วยฮาฟสุดหล่อ!" })
    }

    const { data, error } = await supabase
    .from("Todos")
    .insert([
      { title: title }
    ])
    .select();

    if (error) throw error;

    res.status(201).json({ message: "เพิ่มงานสำเร็จแล้วนะฮาฟ", data: data});

  } catch (error) {
    console.log("Error fetching todos:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: error.message})
  }
});

app.put("/todos/:id" , async(req,res) => {
  try {
    const todoId = req.params.id;

    const { is_completed } = req.body;

    const { data, error } = await supabase
    .from("Todos")
    .update({ is_completed: is_completed})
    .eq("id", todoId)
    .select();

    if (error) throw error;

    res.json({ message: "อัปเดตสถานะสำเร็จ!", data: data});
  } catch (error) {
    console.log("Error updating todo:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต", error: error.message})
  }
})

app.listen (PORT ,() => {
  console.log(`Server Running on port ${PORT}`);
  console.log("🚀 Supabase รันได้แล้วน้องงงง");
});

module.exports = supabase;
