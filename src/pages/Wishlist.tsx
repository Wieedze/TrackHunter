import { useState } from 'react';
import { Heart, Trash2, Music, FolderPlus, Folder, X, ChevronRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist.ts';
import { Button } from '../components/ui/Button.tsx';

export function Wishlist() {
  const {
    items,
    folders,
    loading,
    removeFromWishlist,
    moveToFolder,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useWishlist();

  const [activeFolder, setActiveFolder] = useState<string | null>(null); // null = "All"
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-text-secondary">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0 && folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <Heart size={32} strokeWidth={1.5} className="text-text-tertiary" />
        <p className="text-text-secondary">Your wishlist is empty.</p>
        <p className="text-sm text-text-tertiary">
          Add tracks you want to keep an eye on from the search results.
        </p>
      </div>
    );
  }

  // Filter items by active folder
  const filteredItems =
    activeFolder === null
      ? items
      : activeFolder === '__uncategorized__'
        ? items.filter((i) => !i.folderId)
        : items.filter((i) => i.folderId === activeFolder);

  const uncategorizedCount = items.filter((i) => !i.folderId).length;

  function handleCreateFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    createFolder(name);
    setNewFolderName('');
    setShowNewFolder(false);
  }

  function handleRename(id: string) {
    const name = editName.trim();
    if (!name) return;
    renameFolder(id, name);
    setEditingFolder(null);
    setEditName('');
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
      {/* Sidebar: folders */}
      <div className="w-full shrink-0 sm:w-48">
        <h2 className="font-display text-lg font-semibold text-text-primary">Wishlist</h2>
        <p className="text-xs text-text-tertiary mb-3">{items.length} track{items.length !== 1 ? 's' : ''}</p>

        <nav className="space-y-1">
          {/* All */}
          <button
            onClick={() => setActiveFolder(null)}
            className={`flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors ${
              activeFolder === null ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>All</span>
            <span className="text-xs text-text-tertiary">{items.length}</span>
          </button>

          {/* Uncategorized */}
          {folders.length > 0 && (
            <button
              onClick={() => setActiveFolder('__uncategorized__')}
              className={`flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors ${
                activeFolder === '__uncategorized__' ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>Uncategorized</span>
              <span className="text-xs text-text-tertiary">{uncategorizedCount}</span>
            </button>
          )}

          {/* Folders */}
          {folders.map((folder) => {
            const count = items.filter((i) => i.folderId === folder.id).length;
            return (
              <div key={folder.id} className="group flex items-center gap-1">
                {editingFolder === folder.id ? (
                  <div className="flex w-full items-center gap-1">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleRename(folder.id); if (e.key === 'Escape') setEditingFolder(null); }}
                      className="flex-1 rounded-sm border border-border bg-bg-primary px-2 py-1 text-sm text-text-primary focus:border-border-active focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleRename(folder.id)} className="text-xs text-accent">OK</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveFolder(folder.id)}
                    onDoubleClick={() => { setEditingFolder(folder.id); setEditName(folder.name); }}
                    className={`flex flex-1 items-center justify-between rounded-sm px-3 py-1.5 text-sm transition-colors ${
                      activeFolder === folder.id ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Folder size={12} strokeWidth={1.5} />
                      <span className="truncate">{folder.name}</span>
                    </span>
                    <span className="text-xs text-text-tertiary">{count}</span>
                  </button>
                )}
                <button
                  onClick={() => deleteFolder(folder.id)}
                  className="hidden group-hover:block text-text-tertiary hover:text-status-error transition-colors"
                  title="Delete folder"
                >
                  <X size={12} strokeWidth={1.5} />
                </button>
              </div>
            );
          })}

          {/* New folder */}
          {showNewFolder ? (
            <div className="flex items-center gap-1">
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); if (e.key === 'Escape') setShowNewFolder(false); }}
                placeholder="Folder name"
                className="flex-1 rounded-sm border border-border bg-bg-primary px-2 py-1 text-sm text-text-primary placeholder:text-text-tertiary focus:border-border-active focus:outline-none"
                autoFocus
              />
              <button onClick={handleCreateFolder} className="text-xs text-accent">Add</button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFolder(true)}
              className="flex w-full items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <FolderPlus size={12} strokeWidth={1.5} />
              New folder
            </button>
          )}
        </nav>
      </div>

      {/* Track list */}
      <div className="flex-1">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-12">
            <p className="text-sm text-text-tertiary">No tracks in this folder.</p>
          </div>
        ) : (
          <div className="rounded-sm border border-border bg-bg-secondary">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-bg-tertiary">
                    <Music size={16} strokeWidth={1.5} className="text-text-tertiary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.track.artist} — {item.track.title}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                      {item.track.label && ` · ${item.track.label}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Move to folder dropdown */}
                  {folders.length > 0 && (
                    <select
                      value={item.folderId ?? ''}
                      onChange={(e) => moveToFolder(item.id, e.target.value || undefined)}
                      className="rounded-sm border border-border bg-bg-primary px-2 py-1 text-xs text-text-secondary focus:border-border-active focus:outline-none"
                      title="Move to folder"
                    >
                      <option value="">No folder</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-xs text-text-tertiary hover:border-status-error hover:text-status-error transition-colors"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
