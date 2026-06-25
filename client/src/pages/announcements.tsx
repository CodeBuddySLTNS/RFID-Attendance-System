import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coleAPI } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Pencil, Trash2, X, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface Announcement {
  id: number;
  message: string;
  facultyId: number;
  createdAt: string;
  updatedAt: string;
}

export const Announcements = () => {
  const queryClient = useQueryClient();

  const { data: announcements, isFetching } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: () => coleAPI("/announcements")({}),
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setMessage("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (a: Announcement) => {
    setMessage(a.message);
    setEditingId(a.id);
    setIsFormOpen(true);
  };

  const { mutateAsync: createAnnouncement, isPending: isCreating } =
    useMutation({
      mutationFn: coleAPI("/announcements", "POST"),
      onSuccess: () => {
        toast.success("announcement posted!");
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        resetForm();
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("failed to post announcement");
        }
      },
    });

  const { mutateAsync: updateAnnouncement, isPending: isUpdating } =
    useMutation({
      mutationFn: (data: { message: string }) =>
        coleAPI(`/announcements/${editingId}`, "PATCH")(data),
      onSuccess: () => {
        toast.success("announcement updated!");
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        resetForm();
      },
      onError: (error) => {
        if (isAxiosError(error) && error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("failed to update announcement");
        }
      },
    });

  const { mutateAsync: deleteAnnouncement } = useMutation({
    mutationFn: (id: number) => coleAPI(`/announcements/${id}`, "DELETE")({}),
    onSuccess: () => {
      toast.success("announcement deleted");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: () => {
      toast.error("failed to delete announcement");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("message is required");
      return;
    }
    if (editingId) {
      await updateAnnouncement({ message });
    } else {
      await createAnnouncement({ message });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(id);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="border-l-8 border-orange-500 pl-3">
          <h2 className="font-bold text-2xl text-slate-800">Announcements</h2>
          <p className="text-slate-500 text-sm mt-1">
            Post and manage announcements for your students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["announcements"] })
            }
            disabled={isFetching}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Syncing..." : "Refresh"}
          </Button>
          <Button
            size="sm"
            onClick={openCreateForm}
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            New Announcement
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="p-6 gap-0 bg-white border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-slate-800">
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h3>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement here..."
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update"
                    : "Post Announcement"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {announcements && announcements.length > 0 ? (
          announcements.map((a) => {
            const dateStr = new Date(a.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });
            const timeStr = new Date(a.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={a.id}
                className="p-5 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="p-2.5 bg-orange-50 text-orange-500 rounded-lg h-fit shrink-0">
                      <Megaphone size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-700 text-base whitespace-pre-wrap leading-relaxed">
                        {a.message}
                      </p>
                      <p className="text-slate-400 text-xs mt-3">
                        {dateStr} at {timeStr}
                        {a.updatedAt !== a.createdAt && " (edited)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEditForm(a)}
                      className="p-2 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-2 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-10 bg-white border border-slate-100 shadow-sm text-center">
            <Megaphone size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">
              No announcements yet. Click "New Announcement" to get started.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
