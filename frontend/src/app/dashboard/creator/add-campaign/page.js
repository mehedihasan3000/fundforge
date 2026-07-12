"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function AddCampaign() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    story: "",
    category: "",
    fundingGoal: "",
    minimumContribution: "",
    deadline: "",
    rewardInfo: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("https://api.imgbb.com/1/upload?key=08fa52c2209d62ab836c2de43466515f", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, imageUrl: data.data.url }));
      } else {
        setError("Image upload failed");
      }
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/api/campaigns", form);
      router.push("/dashboard/creator/my-campaigns");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Campaign</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Campaign Title</label>
          <input
            type="text"
            required
            className="w-full border rounded-lg px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Story</label>
          <textarea
            required
            rows={4}
            className="w-full border rounded-lg px-3 py-2"
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            required
            className="w-full border rounded-lg px-3 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Funding Goal (credits)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full border rounded-lg px-3 py-2"
              value={form.fundingGoal}
              onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Contribution</label>
            <input
              type="number"
              required
              min="1"
              className="w-full border rounded-lg px-3 py-2"
              value={form.minimumContribution}
              onChange={(e) => setForm({ ...form, minimumContribution: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <input
            type="date"
            required
            className="w-full border rounded-lg px-3 py-2"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reward Info</label>
          <textarea
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
            value={form.rewardInfo}
            onChange={(e) => setForm({ ...form, rewardInfo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Campaign Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          {form.imageUrl && (
            <img src={form.imageUrl} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add Campaign"}
        </button>
      </form>
    </div>
  );
}
