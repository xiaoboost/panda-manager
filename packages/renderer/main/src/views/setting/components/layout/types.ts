import type React from 'react';

export enum DescriptionKind {
  Text,
  Link,
}

export interface DescriptionText {
  kind: DescriptionKind.Text;
  content: React.ReactNode;
}

export interface DescriptionLink {
  kind: DescriptionKind.Link;
  title?: string;
  href: string;
  content: React.ReactNode;
}

export type DescriptionData = DescriptionText | DescriptionLink;

export type Description = React.ReactNode | DescriptionData[];
