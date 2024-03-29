import clsx from "clsx";
import Link from "next/link";
import {
	FaCheckCircle,
	FaExclamationCircle,
	FaQuestionCircle,
	FaRegUserCircle,
	FaTimesCircle,
} from "react-icons/fa";

import type { AchievementStatus, AchievementType } from "@/@types/ApiBaseTypes";

export type BucketListItemPreviewProps = AchievementType & {
	status: AchievementStatus;
};

export function BucketListItemPreview({
	id,
	title,
	status,
	categoryId,
	availableTo,
}: BucketListItemPreviewProps) {
	const daysLeft = new Date(availableTo * 1000 - Date.now()).toLocaleString(
		"hu-HU",
		{ day: "numeric" },
	);
	const timeLeft = new Date(availableTo * 1000 - Date.now()).toLocaleTimeString(
		"hu-HU",
		{ timeStyle: "short" },
	);
	return (
		<Link
			href={{
				pathname: "/bucketlist/[categoryId]/[id]",
				query: { categoryId, id },
			}}
		>
			<a>
				<figure className="flex gap-4 justify-between items-center py-3 px-4 text-white rounded-2xl bg-blur-7">
					<div>
						<h4 className="text-xl line-clamp-1">{`${title}`}</h4>
						<p className="text-xs text-warmGray-400">
							<span
								className={clsx(
									"whitespace-nowrap",
									status === "ACCEPTED" && "text-green-600",
									status === "REJECTED" && "text-red-600",
									status === "SUBMITTED" && "text-blue-600",
									status === "NOT_SUBMITTED" && "text-yellow-600",
									status === "NOT_LOGGED_IN" && "text-purple-600",
								)}
							>{`${
								(status === "ACCEPTED" && "Elfogadva") ||
								(status === "REJECTED" && "Elutasítva") ||
								(status === "SUBMITTED" && "Feldolgozás alatt") ||
								(status === "NOT_SUBMITTED" && "Leadásra vár") ||
								(status === "NOT_LOGGED_IN" && "Nem vagy belépve")
							}`}</span>{" "}
							-{" "}
							<span className="whitespace-nowrap">{`Hátralévő idő: ${
								Number.parseInt(daysLeft, 10) > 0 ? `${daysLeft} nap ` : ``
							}${timeLeft}`}</span>
						</p>
					</div>
					<div className="">
						{status === "ACCEPTED" && (
							<FaCheckCircle className="w-12 h-12 text-green-500" />
						)}
						{status === "REJECTED" && (
							<FaTimesCircle className="w-12 h-12 text-red-500" />
						)}
						{status === "SUBMITTED" && (
							<FaQuestionCircle className="w-12 h-12 text-blue-500" />
						)}
						{status === "NOT_SUBMITTED" && (
							<FaExclamationCircle className="w-12 h-12 text-yellow-500" />
						)}
						{status === "NOT_LOGGED_IN" && (
							<FaRegUserCircle className="w-12 h-12 text-purple-500" />
						)}
					</div>
				</figure>
			</a>
		</Link>
	);
}
