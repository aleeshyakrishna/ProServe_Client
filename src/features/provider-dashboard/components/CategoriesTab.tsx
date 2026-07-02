"use client";

import * as React from "react";
import api from "@/lib/axios";
import { Plus, Edit2, Trash2, Tag, Check, X, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconName: string | null;
  imageUrl: string | null;
}

export function CategoriesTab() {
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Form states
  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [iconName, setIconName] = React.useState("Wrench");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/categories");
      if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch category lists");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle auto-generating slug from name
  React.useEffect(() => {
    if (!editId) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [name, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      if (isEditing && editId) {
        await api.put(`/api/categories/${editId}`, {
          name,
          slug,
          description,
          iconName,
        });
      } else {
        await api.post("/api/categories", {
          name,
          slug,
          description,
          iconName,
        });
      }

      // Reset
      setName("");
      setSlug("");
      setDescription("");
      setIconName("Wrench");
      setIsEditing(false);
      setEditId(null);
      
      // Reload
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInit = (cat: CategoryItem) => {
    setIsEditing(true);
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setIconName(cat.iconName || "Wrench");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This might affect existing services.")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      setError("Failed to delete category");
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="h-8 w-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Category Directory
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Establish and refine classification options mapping service catalogs.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-error-50 border border-error-100 text-error-500 text-xs font-medium flex items-center gap-2">
          <ShieldAlert size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-4 border-b border-[var(--border-subtle)]">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              {isEditing ? "Modify Category" : "Add Category"}
            </CardTitle>
            <CardDescription className="text-xs">
              {isEditing ? "Update existing category specifications" : "Register a new service tag category"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                placeholder="e.g. AC SERVICES"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />

              <Input
                label="URL Slug"
                placeholder="e.g. ac-services"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isSubmitting}
                required
              />

              <Input
                label="Lucide Icon Name"
                placeholder="e.g. Wind, Droplets, Zap"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                disabled={isSubmitting}
              />

              <Textarea
                label="Description"
                placeholder="Briefly state categories utility..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)] justify-end">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditId(null);
                      setName("");
                      setSlug("");
                      setDescription("");
                      setIconName("Wrench");
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                  {isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right: Category List Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4 border-b border-[var(--border-subtle)]">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Active Classifications ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] text-[var(--text-tertiary)] font-bold uppercase tracking-wider">
                    <th className="p-4">Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Icon</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)] font-medium">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <td className="p-4 font-bold">{cat.name}</td>
                      <td className="p-4 font-mono text-[10px] text-[var(--text-secondary)]">{cat.slug}</td>
                      <td className="p-4">
                        <span className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-[10px] font-semibold">
                          {cat.iconName || "Wrench"}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--text-secondary)] max-w-xs truncate">
                        {cat.description || "—"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditInit(cat)}
                            className="p-1 hover:text-emerald-500 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-1 hover:text-error-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[var(--text-tertiary)]">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
