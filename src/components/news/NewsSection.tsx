import clsx from "clsx";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import type { ArticlePreviewProps } from "./ArticlePreview";
import { ArticlePreview } from "./ArticlePreview";

export type NewsSectionProps = {
	articles: {
		mdx: MDXRemoteSerializeResult<{ [key: string]: unknown }>;
		title: string;
		brief: string;
		timestamp: number;
		imageUrl: string;
		highlighted: boolean;
	}[];
	title?: string;
	lastX?: number;
};

export function NewsSection({
	articles,
	lastX,
	title = "Hírek",
}: NewsSectionProps) {
	const articlesToRender = lastX ? articles?.slice(0, lastX) : articles;
	return (
		<section className="container px-4 lg:px-32 xl:px-48 2xl:px-64 mx-auto mb-8">
			<h2 className="mb-6 text-4xl font-bold">{title}</h2>
			<div className={clsx("grid grid-cols-1 gap-4")}>
				{articlesToRender?.map((article) => {
					return <ArticlePreview key={article.title} {...article} />;
				})}
			</div>
		</section>
	);
}
