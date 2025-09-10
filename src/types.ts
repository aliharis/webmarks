export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  tags: string[];
  listId: string;
  createdAt: Date;
  lastAccessed?: Date;
}

export interface BookmarkList {
  id: string;
  name: string;
  color: string;
  bookmarkCount: number;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string[];
  listId: string;
}