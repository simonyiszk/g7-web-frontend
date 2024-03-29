import clsx from "clsx";
import type {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import getConfig from "next/config";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import useSWR from "swr";

import type { AchievementRouteResponse } from "@/@types/ApiResponses";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { fetcher, getAccessToken } from "@/utils/utils";

export async function getServerSideProps<
	Q extends ParsedUrlQuery = ParsedUrlQuery,
>(context: GetServerSidePropsContext<Q>) {
	const rawAchievement: AchievementRouteResponse = await (
		await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}achievement/${context.req.cookies.accessToken}/submit/${context.query.id}`,
		)
	).json();

	return {
		props: {
			rawAchievement,
		},
	};
}

export default function AchievementPage({
	rawAchievement,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { publicRuntimeConfig } = getConfig();
	const router = useRouter();
	if (!getAccessToken() || getAccessToken() === "") {
		if (typeof window !== "undefined" && router) router.push("/api/auth/login");
	}
	const { data } = useSWR<AchievementRouteResponse>(
		`${
			publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL
		}achievement/${getAccessToken()}/submit/${router.query.id}`,
		fetcher,
		{ initialData: rawAchievement },
	);

	const [textInput, setTextInput] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

	if (!data || typeof document === "undefined") {
		return (
			<Layout
				title={rawAchievement?.achievement?.title ?? "Töltés..."}
				className="container px-4 lg:px-32 xl:px-48 2xl:px-64 pt-8 mx-auto"
			>
				<Skeleton />
			</Layout>
		);
	}

	const daysLeft = new Date(
		data.achievement.availableTo * 1000 - Date.now(),
	).toLocaleString("hu-HU", {
		day: "numeric",
	});
	const hoursLeft = new Date(
		data.achievement.availableTo * 1000 - Date.now(),
	).toLocaleTimeString("hu-HU", {
		timeStyle: "short",
	});

	return (
		<Layout
			title={`${data.achievement.title}`}
			className="container px-4 lg:px-32 xl:px-48 2xl:px-64 pt-8 mx-auto"
		>
			<h1 className="mb-4 text-4xl font-bold">{data.achievement.title}</h1>
			<h2 className="mb-2 text-xl">
				Állapot:{" "}
				{`${
					(data.status === "ACCEPTED" && "Elfogadva") ||
					(data.status === "REJECTED" && "Elutasítva") ||
					(data.status === "SUBMITTED" && "Feldolgozás alatt") ||
					(data.status === "NOT_SUBMITTED" && "Leadásra vár") ||
					(data.status === "NOT_LOGGED_IN" && "Nem vagy belépve")
				}`}{" "}
				<span
					className={clsx(
						"inline-block w-3 h-3 rounded-full",
						data.status === "ACCEPTED" && "bg-green-600",
						data.status === "REJECTED" && "bg-red-600",
						data.status === "SUBMITTED" && "bg-blue-600",
						data.status === "NOT_SUBMITTED" && "bg-yellow-600",
						data.status === "NOT_LOGGED_IN" && "bg-purple-600",
					)}
				/>
			</h2>
			<h2 className="mb-2 text-xl">
				Hátralévő idő:{" "}
				{Number.parseInt(daysLeft, 10) > 0 ? `${daysLeft} nap ` : ``}
				{hoursLeft}
			</h2>
			<h2 className="mb-2 text-xl">
				Beadás határideje:{" "}
				{new Date(data.achievement.availableTo * 1000).toLocaleString("hu-HU", {
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</h2>
			<p className="mt-2 mb-4">{data.achievement.description}</p>

			{data.submission?.response && data.submission.response !== "" && (
				<p className="my-4">Értékelő kommentje: {data.submission?.response}</p>
			)}

			{data.status !== "SUBMITTED" && data.status !== "ACCEPTED" && (
				<form
					onSubmit={async (event) => {
						event.preventDefault();
						if (!getAccessToken() || getAccessToken() === "") {
							router.push("/api/auth/login");
							return;
						}
						if (selectedFile && textInput !== "") {
							const formData = new FormData();
							formData.append("file", selectedFile);
							const encodedAnswer = encodeURIComponent(textInput);
							const res = await fetch(
								`${
									publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL
								}achievement/${getAccessToken()}/submit?achievementId=${
									router.query.id
								}&textAnswer=${encodedAnswer}`,
								{
									method: "POST",
									body: formData,
								},
							);
							router.reload();
							return;
						}
						if (selectedFile) {
							const formData = new FormData();
							formData.append("file", selectedFile);
							const res = await fetch(
								`${
									publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL
								}achievement/${getAccessToken()}/submit?achievementId=${
									router.query.id
								}`,
								{
									method: "POST",
									body: formData,
								},
							);
							router.reload();
							return;
						}
						if (textInput !== "") {
							const encodedAnswer = encodeURIComponent(textInput);
							const res = await fetch(
								`${
									publicRuntimeConfig.NEXT_PUBLIC_API_BASE_URL
								}achievement/${getAccessToken()}/submit?achievementId=${
									router.query.id
								}&textAnswer=${encodedAnswer}`,
								{
									method: "POST",
								},
							);
							router.reload();
							return;
						}
						window.alert("Nem adtál meg semmit!");
					}}
					className="flex flex-col"
				>
					{(data.achievement.type === "BOTH" ||
						data.achievement.type === "IMAGE") && (
						<input
							className="mt-2"
							type="file"
							onChange={(event) => {
								if (event?.target?.files && event.target.files.length > 0) {
									setSelectedFile(event.target.files[0]);
								}
							}}
							accept="image/*"
						/>
					)}

					{(data.achievement.type === "BOTH" ||
						data.achievement.type === "TEXT") && (
						<textarea
							className="p-2 mt-4 h-32 border-2 border-gray-600 bg-blur-7"
							placeholder="Szöveges válasz:"
							value={textInput}
							onChange={(event) => {
								setTextInput(event.target.value);
							}}
						/>
					)}

					{data.achievement.expectedResultDescription !== "" && (
						<p className="my-4">
							Tipp a beadáshoz: {data.achievement.expectedResultDescription}
						</p>
					)}

					<button
						type="submit"
						className="self-center p-4 mt-2 mb-4 text-xl font-bold text-white rounded-lg bg-blur-7 w-fit"
					>
						Beadás
					</button>
				</form>
			)}
		</Layout>
	);
}
