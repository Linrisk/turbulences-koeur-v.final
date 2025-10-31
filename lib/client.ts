export type Letter = {
  id: string;
  content: string;
  city: string;
  relationshipType: "amoureuse" | "amicale" | "familiale";
  createdAt: string;
  updatedAt: string;
};

export type MailboxLocation = {
  id: string;
  city: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
};

export type PageContent = {
  id: string;
  pageKey: string;
  title: string | null;
  content: string;
  metaDescription: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentRevision = {
  id: string;
  pageContentId: string;
  title: string | null;
  content: string;
  updatedBy: string | null;
  createdAt: string;
};

export type AdminSession = {
  id: string;
  adminId: string;
  sessionToken: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
};
