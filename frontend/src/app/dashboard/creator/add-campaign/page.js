"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Plus, Camera, CircleExclamation } from "@gravity-ui/icons";

const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

function SpinnerIcon() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

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
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Campaign</h1>
        <p className="text-sm text-gray-500 mt-1">Launch your fundraising campaign</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Title</label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
            placeholder="Help us build a solar-powered water pump"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Story</label>
          <textarea
            required
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
            placeholder="Tell your story and why people should support..."
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <select
            required
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Funding Goal (credits)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g. 10000"
              value={form.fundingGoal}
              onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Contribution</label>
            <input
              type="number"
              required
              min="1"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g. 5"
              value={form.minimumContribution}
              onChange={(e) => setForm({ ...form, minimumContribution: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
          <input
            type="date"
            required
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Reward Info</label>
          <textarea
            rows={2}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder:text-gray-400"
            placeholder="What do supporters get for contributing?"
            value={form.rewardInfo}
            onChange={(e) => setForm({ ...form, rewardInfo: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Image</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Camera className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-900 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer disabled:opacity-50"
            />
          </div>
          {uploading && (
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
              <SpinnerIcon /> Uploading image...
            </p>
          )}
          {form.imageUrl && (
            <div className="mt-3 relative">
              <img src={form.imageUrl} alt="Preview" className="h-36 w-full object-cover rounded-xl border border-gray-200" />
              <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Uploaded</div>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl text-sm">
            <CircleExclamation className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25"
        >
          {submitting ? <SpinnerIcon /> : <Plus className="w-4 h-4" />}
          {submitting ? "Saving..." : "Add Campaign"}
        </button>
      </form>
    </div>
  );
}
