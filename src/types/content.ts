export interface Author {
  name: string;
  logo: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  publishedAt: string;
  slug: string;
  banner: string;
  labels: string[];
  authors: Author[];
  draft: boolean;
}

export interface BlogPost extends BlogMetadata {
  id: string;
  readingTime: string;
  html?: string;
  mdx?: boolean;
  components?: ContentComponent[];
}

export interface ContentComponent {
  type: "image-compare";
  props: {
    before: string;
    after: string;
    beforeAlt?: string;
    afterAlt?: string;
    beforeLabel?: string;
    afterLabel?: string;
  };
}

export interface BlogCard {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  labels: string[];
}

export interface Signature {
  svgText: string;
  id: string;
}

export interface Like {
  postId: string;
  count: number;
}
