import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { apiRequest } from "../../config/api.js";
import { useToast } from "../../context/ToastContext.jsx";

function Profile() {
  const { user, loading } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    profile: {
      age: "",
      gender: "",
      income: "",
      state: "",
      district: "",
      category: "",
      occupation: "",
      landHolding: "",
    },
  });
  const [initial, setInitial] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchMe() {
      if (!user) {
        setLoadingRemote(false);
        return;
      }
      try {
        const res = await apiRequest("/users/me");
        const u = res.data || {};
        const next = {
          name: u.name || "",
          phone: u.phone || "",
          profile: {
            age: u.profile?.age ?? "",
            gender: u.profile?.gender || "",
            income: u.profile?.income ?? "",
            state: u.profile?.state || "",
            district: u.profile?.district || "",
            category: u.profile?.category || "",
            occupation: u.profile?.occupation || "",
            landHolding: u.profile?.landHolding ?? "",
          },
        };
        if (!cancelled) {
          setForm(next);
          setInitial(next);
        }
      } catch (e) {
        if (!cancelled) {
          pushToast({ type: "error", message: e.message || "Failed to load profile" });
        }
      } finally {
        if (!cancelled) setLoadingRemote(false);
      }
    }
    fetchMe();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Name is required";
    if (f.phone && !/^\+?[0-9]{7,15}$/.test(f.phone)) e.phone = "Enter a valid phone";
    if (f.profile.age !== "" && (Number.isNaN(Number(f.profile.age)) || Number(f.profile.age) < 0 || Number(f.profile.age) > 120)) e.age = "Age must be between 0 and 120";
    if (f.profile.income !== "" && (Number(f.profile.income) < 0)) e.income = "Income cannot be negative";
    if (f.profile.landHolding !== "" && (Number(f.profile.landHolding) < 0)) e.landHolding = "Land holding cannot be negative";
    return e;
  };

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial || {}), [form, initial]);

  if (loading || loadingRemote) return <div className="p-4">Loading...</div>;

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateProfileField = (key, value) => setForm((f) => ({ ...f, profile: { ...f.profile, [key]: value } }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const currentErrors = validate(form);
      setErrors(currentErrors);
      if (Object.keys(currentErrors).length) throw new Error("Please fix the errors");
      const payload = { ...form };
      // Convert numeric strings to numbers where applicable
      if (payload.profile?.age !== "") payload.profile.age = Number(payload.profile.age);
      if (payload.profile?.income !== "") payload.profile.income = Number(payload.profile.income);
      if (payload.profile?.landHolding !== "") payload.profile.landHolding = Number(payload.profile.landHolding);
      const res = await apiRequest("/users/me", { method: "PUT", body: payload });
      pushToast({ type: "success", message: "Profile updated" });
      setInitial(form);
    } catch (err) {
      pushToast({ type: "error", message: err.message || "Update failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`} placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          {errors.name ? <p className="text-sm text-red-500 mt-1">{errors.name}</p> : null}
        </div>
        <div>
          <input className={`input input-bordered w-full ${errors.phone ? "input-error" : ""}`} placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          {errors.phone ? <p className="text-sm text-red-500 mt-1">{errors.phone}</p> : null}
        </div>

        <div>
          <input className={`input input-bordered w-full ${errors.age ? "input-error" : ""}`} placeholder="Age" type="number" value={form.profile.age} onChange={(e) => updateProfileField("age", e.target.value)} />
          {errors.age ? <p className="text-sm text-red-500 mt-1">{errors.age}</p> : null}
        </div>
        <div>
          <select className="select select-bordered w-full" value={form.profile.gender} onChange={(e) => updateProfileField("gender", e.target.value)}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <input className={`input input-bordered w-full ${errors.income ? "input-error" : ""}`} placeholder="Income" type="number" value={form.profile.income} onChange={(e) => updateProfileField("income", e.target.value)} />
          {errors.income ? <p className="text-sm text-red-500 mt-1">{errors.income}</p> : null}
        </div>
        <input className="input input-bordered w-full" placeholder="State" value={form.profile.state} onChange={(e) => updateProfileField("state", e.target.value)} />
        <input className="input input-bordered w-full" placeholder="District" value={form.profile.district} onChange={(e) => updateProfileField("district", e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Category" value={form.profile.category} onChange={(e) => updateProfileField("category", e.target.value)} />
        <input className="input input-bordered w-full" placeholder="Occupation" value={form.profile.occupation} onChange={(e) => updateProfileField("occupation", e.target.value)} />
        <div>
          <input className={`input input-bordered w-full ${errors.landHolding ? "input-error" : ""}`} placeholder="Land holding (in acres)" type="number" value={form.profile.landHolding} onChange={(e) => updateProfileField("landHolding", e.target.value)} />
          {errors.landHolding ? <p className="text-sm text-red-500 mt-1">{errors.landHolding}</p> : null}
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={submitting || !isDirty || Object.keys(errors).length > 0}>{submitting ? "Saving..." : "Save"}</button>
          <button type="button" className="btn" disabled={!isDirty || submitting} onClick={() => setForm(initial)}>Reset</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;


